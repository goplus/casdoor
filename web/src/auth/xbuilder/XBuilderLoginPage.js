import i18next from "i18next";
import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import * as Setting from "../../Setting";
import {getAuthUrl} from "../Provider";
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

function Sep() {
  return (
    <div style={{
      width: "100%",
      fontSize: "14px",
      color: "#A7B1BB",
      lineHeight: "22px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "16px",
    }}>
      <div style={{
        flex: "1 1 0",
        height: "1px",
        backgroundColor: "#EAEFF3",
      }}></div>
      <span>{i18next.language === "zh" ? "或" : "or"}</span>
      <div style={{
        flex: "1 1 0",
        height: "1px",
        backgroundColor: "#EAEFF3",
      }}></div>
    </div>
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

function LoginFormPc({application}) {
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
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 85px",
          gap: "12px",
        }}
      >
        {filterProviders(application.providers).map((provider, i, arr) => (
          <React.Fragment key={provider.name}>
            <LoginButton application={application} provider={provider.provider} primary={i === 0} />
            {arr.length === 2 && i === 0 && <Sep />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function LoginFormMobile({application}) {
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
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {filterProviders(application.providers).map((provider, i, arr) => (
          <React.Fragment key={provider.name}>
            <LoginButton application={application} provider={provider.provider} primary={i === 0} />
          </React.Fragment>
        ))}
      </div>
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
