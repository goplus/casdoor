import i18next from "i18next";
import {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import * as Setting from "../../Setting";
import {getAuthUrl} from "../Provider";
import * as AuthBackend from "../AuthBackend";
import * as Util from "../Util";
import "./XBuilderLoginPage.less";
import bgImgUrl from "./bg.svg";
import bgMobileImgUrl from "./bg-mobile.svg";
import illustrationImgUrl from "./illustration.svg";
import illustrationMobileImgUrl from "./illustration-mobile.svg";
import logoImgUrl from "./logo.svg";
import googleProviderLogoColorful from "./providers/google-colorful.svg";
import googleProviderMonochromeLogo from "./providers/google-monochrome.svg";
import githubProviderLogoColorful from "./providers/github-colorful.svg";
import githubProviderMonochromeLogo from "./providers/github-monochrome.svg";
import xProviderLogoColorful from "./providers/x-colorful.svg";
import xProviderMonochromeLogo from "./providers/x-monochrome.svg";
import qqProviderLogoColorful from "./providers/qq-colorful.svg";
import qqProviderMonochromeLogo from "./providers/qq-monochrome.svg";
import wechatProviderLogoColorful from "./providers/wechat-colorful.svg";
import wechatProviderMonochromeLogo from "./providers/wechat-monochrome.svg";
import arrowIconUrl from "./icons/arrow.svg";
import eyeIconUrl from "./icons/eye.svg";
import eyeOffIconUrl from "./icons/eye-off.svg";
import lockIconUrl from "./icons/lock.svg";
import userIconUrl from "./icons/user.svg";

const providerTypeLogosMap = {
  Google: {
    colorful: googleProviderLogoColorful,
    monochrome: googleProviderMonochromeLogo,
  },
  GitHub: {
    colorful: githubProviderLogoColorful,
    monochrome: githubProviderMonochromeLogo,
  },
  Twitter: {
    colorful: xProviderLogoColorful,
    monochrome: xProviderMonochromeLogo,
  },
  QQ: {
    colorful: qqProviderLogoColorful,
    monochrome: qqProviderMonochromeLogo,
  },
  WeChat: {
    colorful: wechatProviderLogoColorful,
    monochrome: wechatProviderMonochromeLogo,
  },
};

function getLoginText(provider) {
  if (i18next.language === "zh") {
    const sep = /^[a-zA-Z]+$/.test(provider.displayName) ? " " : "";
    return ["使用", provider.displayName, "登录"].join(sep);
  }
  return `Sign in with ${provider.displayName}`;
}

function LoginButton({application, provider, primary}) {
  const logos = providerTypeLogosMap[provider.type];
  return (
    <a
      className={`xbuilder-login-button ${primary ? "primary" : ""}`}
      href={getAuthUrl(application, provider, "signup")}
    >
      <img
        style={{width: "24px", height: "24px"}}
        src={primary ? logos?.monochrome : logos?.colorful}
        alt={provider.displayName}
      />
      <div style={{
        fontSize: "16px",
        fontWeight: 500,
      }}>{getLoginText(provider)}</div>
    </a>
  );
}

function UsernamePasswordLink({onClick}) {
  return (
    <a
      className="xbuilder-username-password-link"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick();
        }
      }}
      style={{
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        marginTop: "8px",
      }}
    >
      {i18next.language === "zh" ? "用户名密码登录" : "Sign in with username and password"}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "16px",
          height: "16px",
          backgroundColor: "currentColor",
          maskImage: `url(${arrowIconUrl})`,
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskSize: "16px 16px",
        }}
      ></span>
    </a>
  );
}

function ApplicationInfo({application}) {
  return (
    <>
      <img src={logoImgUrl} style={{
        width: "72px",
        marginBottom: "12px",
      }} />
      <h2 style={{
        margin: "0 0 64px",
        color: "#24292F",
        fontSize: "24px",
        lineHeight: "28px",
      }}>{application.displayName}</h2>
    </>
  );
}

function filterProviders(providers) {
  return providers.filter((provider) => provider.canSignIn && provider.canSignUp);
}

function validateUsername(username) {
  if (username === "") {
    return i18next.language === "zh" ? "请输入用户名" : "Please enter username";
  }
  if (/\s/.test(username)) {
    return i18next.language === "zh" ? "用户名不能包含空格" : "Username cannot contain spaces";
  }
  return "";
}

function validatePassword(password) {
  if (password === "") {
    return i18next.language === "zh" ? "请输入密码" : "Please enter password";
  }
  return "";
}

function usePasswordLoginForm(application, containerStyle) {
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({username: "", password: ""});

  const openPasswordLogin = () => {
    setShowPasswordLogin(true);
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    const errorMsg = validateUsername(value);
    setErrors((prev) => ({...prev, username: errorMsg}));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const errorMsg = validatePassword(value);
    setErrors((prev) => ({...prev, password: errorMsg}));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (application) => {
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    if (usernameError || passwordError) {
      setErrors({username: usernameError, password: passwordError});
      return;
    }

    const oAuthParams = Util.getOAuthGetParameters();

    const values = {
      username: username.trim(),
      password: password,
      organization: application.organization,
      application: application.name,
      signinMethod: "Password",
      type: oAuthParams?.responseType ?? "code",
    };

    AuthBackend.login(values, oAuthParams)
      .then((res) => {
        if (res.status === "ok") {
          const responseType = values.type;

          if (responseType === "code") {
            const code = res.data;
            if (oAuthParams?.redirectUri) {
              const redirectUrl = new URL(oAuthParams.redirectUri);
              redirectUrl.searchParams.append("code", code);
              if (oAuthParams.state) {
                redirectUrl.searchParams.append("state", oAuthParams.state);
              }
              Setting.goToLink(redirectUrl.toString());
            } else {
              Setting.showMessage("warning", "Sign in successful, but no redirect URI specified.");
            }
          } else {
            Setting.showMessage("error", `Unsupported response type "${responseType}". Only "code" flow is supported.`);
          }
        } else {
          Setting.showMessage("error", `${i18next.t("application:Failed to sign in")}: ${res.msg}`);
        }
      })
      .catch((error) => {
        Setting.showMessage("error", `${i18next.t("application:Failed to sign in")}: ${error.toString()}`);
      });
  };

  const passwordLoginSection = showPasswordLogin ? (
    <PasswordLoginSection
      username={username}
      onUsernameChange={handleUsernameChange}
      password={password}
      onPasswordChange={handlePasswordChange}
      showPassword={showPassword}
      onToggleShowPassword={toggleShowPassword}
      errors={errors}
      onSubmit={handleSubmit}
      application={application}
      containerStyle={containerStyle}
    />
  ) : null;

  return {
    showPasswordLogin,
    openPasswordLogin,
    passwordLoginSection,
  };
}

function InputWithIcon({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  iconUrl,
  rightIconUrl,
  onRightIconClick,
}) {
  return (
    <div style={{width: "100%"}}>
      <div style={{position: "relative", width: "100%"}}>
        <img
          src={iconUrl}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "20px",
            height: "20px",
          }}
        />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            height: "50px",
            padding: rightIconUrl ? "0 44px 0 44px" : "0 12px 0 44px",
            fontSize: "16px",
            border: error ? "1px solid #FF4D4F" : "1px solid #CFD9DE",
            borderRadius: "8px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {rightIconUrl && (
          <img
            src={rightIconUrl}
            alt=""
            aria-hidden="true"
            onClick={onRightIconClick}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "20px",
              height: "20px",
              cursor: onRightIconClick ? "pointer" : "default",
            }}
          />
        )}
      </div>
      {error && (
        <div
          style={{
            color: "#FF4D4F",
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

function PasswordLoginSection({
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  errors,
  onSubmit,
  containerStyle,
  application,
}) {
  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(application);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        ...(containerStyle || {}),
      }}
    >
      <InputWithIcon
        type="text"
        placeholder={i18next.language === "zh" ? "用户名" : "Username"}
        value={username}
        onChange={onUsernameChange}
        error={errors.username}
        iconUrl={userIconUrl}
      />

      <InputWithIcon
        type={showPassword ? "text" : "password"}
        placeholder={i18next.language === "zh" ? "密码" : "Password"}
        value={password}
        onChange={onPasswordChange}
        error={errors.password}
        iconUrl={lockIconUrl}
        rightIconUrl={showPassword ? eyeOffIconUrl : eyeIconUrl}
        onRightIconClick={onToggleShowPassword}
      />
      <button
        type="submit"
        style={{
          width: "100%",
          height: "50px",
          marginTop: "8px",
          fontSize: "16px",
          fontWeight: 500,
          color: "#fff",
          backgroundColor: "#0BC0CF",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {i18next.language === "zh" ? "立即登录" : "Sign In"}
      </button>
    </form>
  );
}

function LoginFormPc({application}) {
  const {
    showPasswordLogin,
    openPasswordLogin,
    passwordLoginSection,
  } = usePasswordLoginForm(application, {padding: "0 85px"});

  return (
    <div
      style={{
        flex: "1 1 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ApplicationInfo application={application} />
      {!showPasswordLogin ? (
        <div
          style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 85px",
            gap: "20px",
          }}
        >
          {filterProviders(application.providers).map((provider, i) => (
            <LoginButton
              key={provider.name}
              application={application}
              provider={provider.provider}
              primary={i === 0}
            />
          ))}
          <UsernamePasswordLink onClick={openPasswordLogin} />
        </div>
      ) : (
        passwordLoginSection
      )}
    </div>
  );
}

function LoginFormMobile({application}) {
  const {
    showPasswordLogin,
    openPasswordLogin,
    passwordLoginSection,
  } = usePasswordLoginForm(application);

  return (
    <div
      style={{
        width: "295px",
        paddingBottom: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ApplicationInfo application={application} />
      {!showPasswordLogin ? (
        <div
          style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {filterProviders(application.providers).map((provider, i) => (
            <LoginButton
              key={provider.name}
              application={application}
              provider={provider.provider}
              primary={i === 0}
            />
          ))}
          <UsernamePasswordLink onClick={openPasswordLogin} />
        </div>
      ) : (
        passwordLoginSection
      )}
    </div>
  );
}

function XBuilderLoginPagePc({application}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${bgImgUrl}) center/100% no-repeat #EFF3FD`,
      }}
    >
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        width: "1000px",
        height: "600px",
        padding: "72px 0",
        position: "relative",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0px 16px 32px -12px rgba(64, 186, 196, 0.18)",
      }}>
        <h1 style={{
          position: "absolute",
          left: "60px",
          top: "32px",
          margin: "0",
          fontSize: "26px",
          lineHeight: "36px",
          color: "#24292F",
        }}>{i18next.t("login:Sign In")}</h1>
        <div style={{
          flex: "1 1 0",
          background: `url(${illustrationImgUrl}) center/472px no-repeat`,
          borderRight: "1px solid #E0E7EF",
        }}></div>
        <LoginFormPc application={application} />
      </div>
    </div>
  );
}

function XBuilderLoginPageMobile({application}) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: `url(${bgMobileImgUrl}) center/100% no-repeat #EFF3FD`,
    }}>
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${illustrationMobileImgUrl}) top/100% no-repeat`,
      }}>
        <LoginFormMobile application={application} />
      </div>
    </div>
  );
}

function useMediaQuery(query) {
  const mediaMatch = window.matchMedia(query);
  const [matches, setMatches] = useState(mediaMatch.matches);

  useEffect(() => {
    const handler = (e) => setMatches(e.matches);
    mediaMatch.addEventListener("change", handler);
    return () => mediaMatch.removeEventListener("change", handler);
  });

  return matches;
}

export default function XBuilderLoginPage({application}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const langs = application.organizationObj.languages;
    const currentLang = Setting.getLanguage();
    if (langs.length > 0 && !langs.includes(currentLang)) {
      Setting.setLanguage(langs[0]);
    }
  }, []);

  return <>
    <Helmet>
      <title>{i18next.t("login:Sign In")}</title>
      <link rel="icon" href={application.organizationObj?.favicon} />
    </Helmet>
    {isMobile ? (
      <XBuilderLoginPageMobile application={application} />
    ) : (
      <XBuilderLoginPagePc application={application} />
    )}
  </>;
}
