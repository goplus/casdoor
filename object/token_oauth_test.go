package object

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/beego/beego"
	"github.com/casdoor/casdoor/util"
	"github.com/xorm-io/xorm/names"
)

func setupTestOrmer(t *testing.T) {
	t.Helper()

	originalOrmer := ormer
	originalCreateDatabase := createDatabase
	configKeys := []string{"driverName", "dataSourceName", "dbName", "tableNamePrefix", "showSql", "staticBaseUrl"}
	originalConfig := map[string]string{}
	for _, key := range configKeys {
		originalConfig[key] = beego.AppConfig.String(key)
	}

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	for key, value := range map[string]string{
		"driverName":      "sqlite",
		"dataSourceName":  dsn,
		"dbName":          "",
		"tableNamePrefix": "",
		"showSql":         "false",
		"staticBaseUrl":   "https://cdn.casbin.org",
	} {
		if err := beego.AppConfig.Set(key, value); err != nil {
			t.Fatalf("set config %s: %v", key, err)
		}
	}

	createDatabase = false

	adapter, err := NewAdapter("sqlite", dsn, "")
	if err != nil {
		t.Fatalf("new adapter: %v", err)
	}
	adapter.Engine.SetTableMapper(names.NewPrefixMapper(names.SnakeMapper{}, ""))
	adapter.createTable()
	ormer = adapter

	t.Cleanup(func() {
		adapter.close()
		ormer = originalOrmer
		createDatabase = originalCreateDatabase
		for _, key := range configKeys {
			if err := beego.AppConfig.Set(key, originalConfig[key]); err != nil {
				t.Fatalf("restore config %s: %v", key, err)
			}
		}
	})
}

func addTestOrganization(t *testing.T, name string) {
	t.Helper()

	_, err := AddOrganization(&Organization{
		Owner:        "admin",
		Name:         name,
		CreatedTime:  util.GetCurrentTime(),
		PasswordType: "plain",
	})
	if err != nil {
		t.Fatalf("add organization: %v", err)
	}
}

func addTestUser(t *testing.T, owner string, name string) *User {
	t.Helper()

	user := &User{
		Owner:       owner,
		Name:        name,
		Id:          util.GenerateId(),
		DisplayName: name,
		CreatedTime: util.GetCurrentTime(),
		Type:        "normal-user",
	}
	_, err := ormer.Engine.Insert(user)
	if err != nil {
		t.Fatalf("add user: %v", err)
	}
	return user
}

func addTestCert(t *testing.T, name string) {
	t.Helper()

	pem, err := os.ReadFile(filepath.Join(".", "token_jwt_key.pem"))
	if err != nil {
		t.Fatalf("read certificate: %v", err)
	}
	key, err := os.ReadFile(filepath.Join(".", "token_jwt_key.key"))
	if err != nil {
		t.Fatalf("read private key: %v", err)
	}

	_, err = AddCert(&Cert{
		Owner:           "admin",
		Name:            name,
		CreatedTime:     util.GetCurrentTime(),
		DisplayName:     name,
		Scope:           "JWT",
		Type:            "x509",
		CryptoAlgorithm: "RS256",
		BitSize:         2048,
		ExpireInYears:   20,
		Certificate:     string(pem),
		PrivateKey:      string(key),
	})
	if err != nil {
		t.Fatalf("add cert: %v", err)
	}
}

func addTestApplication(t *testing.T, organization string, certName string) *Application {
	t.Helper()

	application := &Application{
		Owner:                "admin",
		Name:                 "app-" + util.GenerateId(),
		CreatedTime:          util.GetCurrentTime(),
		Organization:         organization,
		Cert:                 certName,
		ClientId:             util.GenerateClientId(),
		ClientSecret:         util.GenerateClientSecret(),
		TokenFormat:          "JWT",
		ExpireInHours:        1,
		RefreshExpireInHours: 2,
	}
	_, err := AddApplication(application)
	if err != nil {
		t.Fatalf("add application: %v", err)
	}
	return application
}

func TestRefreshTokenReturnsInvalidGrantForMissingUser(t *testing.T) {
	setupTestOrmer(t)

	addTestOrganization(t, "built-in")
	user := addTestUser(t, "built-in", "alice")
	addTestCert(t, "cert-test")
	application := addTestApplication(t, "built-in", "cert-test")

	accessToken, refreshToken, tokenName, err := generateJwtToken(application, user, "", "", "example.com")
	if err != nil {
		t.Fatalf("generate jwt token: %v", err)
	}

	_, err = AddToken(&Token{
		Owner:        application.Owner,
		Name:         tokenName,
		CreatedTime:  util.GetCurrentTime(),
		Application:  application.Name,
		Organization: user.Owner,
		User:         "ghost",
		Code:         util.GenerateClientId(),
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    application.ExpireInHours * hourSeconds,
		Scope:        "",
		TokenType:    "Bearer",
		CodeIsUsed:   true,
	})
	if err != nil {
		t.Fatalf("add token: %v", err)
	}

	resp, err := RefreshToken("refresh_token", refreshToken, "", application.ClientId, application.ClientSecret, "example.com")
	if err != nil {
		t.Fatalf("refresh token returned error: %v", err)
	}

	tokenError, ok := resp.(*TokenError)
	if !ok {
		t.Fatalf("expected TokenError, got %T", resp)
	}
	if tokenError.Error != InvalidGrant {
		t.Fatalf("expected invalid_grant, got %s", tokenError.Error)
	}
	if tokenError.ErrorDescription != "the user does not exist" {
		t.Fatalf("unexpected error description: %s", tokenError.ErrorDescription)
	}
}

func TestUserChangeTriggerUpdatesTokenUsers(t *testing.T) {
	setupTestOrmer(t)

	addTestOrganization(t, "built-in")
	_ = addTestUser(t, "built-in", "alice")

	refreshToken := "refresh-token-value"
	_, err := AddToken(&Token{
		Owner:        "admin",
		Name:         util.GenerateId(),
		CreatedTime:  util.GetCurrentTime(),
		Application:  "app-test",
		Organization: "built-in",
		User:         "alice",
		RefreshToken: refreshToken,
		ExpiresIn:    hourSeconds,
		TokenType:    "Bearer",
		CodeIsUsed:   true,
	})
	if err != nil {
		t.Fatalf("add token: %v", err)
	}

	err = userChangeTrigger("alice", "alice-renamed")
	if err != nil {
		t.Fatalf("userChangeTrigger: %v", err)
	}

	token, err := GetTokenByRefreshToken(refreshToken)
	if err != nil {
		t.Fatalf("get token by refresh token: %v", err)
	}
	if token == nil {
		t.Fatal("expected token to exist")
	}
	if token.User != "alice-renamed" {
		t.Fatalf("expected token user alice-renamed, got %s", token.User)
	}
}
