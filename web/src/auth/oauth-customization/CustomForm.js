import i18next from "i18next";
import {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import bgMobile from "./bg-mobile.jpg";
import LanguageSelect from "../../common/select/LanguageSelect";
import {LoginButton} from "./LoginButton";
import {Banner} from "./Banner";

const filterProviders = (providers) => {
  return providers.filter((provider) => provider.canSignIn && provider.canSignUp);
};

const CustomFormDesktop = ({application}) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Banner />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
          position: "relative",
        }}
      >
        <div style={{position: "absolute", top: 20, right: 16}}>
          <LanguageSelect languages={application.organizationObj.languages} />
        </div>
        <div
          style={{
            width: "295px",
            gap: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {filterProviders(application.providers).map((provider) => (
            <LoginButton key={provider.name} application={application} provider={provider.provider} />
          ))}
        </div>
      </div>
    </div>
  );
};

const GoPlusLogo = () => (
  <svg width="170" height="42" viewBox="0 0 170 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.0767 3.06311C8.10901 3.06311 0 11.1097 0 20.9989C0 30.8894 8.10901 38.9365 18.0767 38.9369H32.2577V30.6587H18.0767C12.7095 30.6587 8.34249 26.3253 8.34249 20.9993C8.34249 15.6748 12.7095 11.3414 18.0767 11.3414H45.8844V3.06311H18.0767ZM37.8191 25.2768V38.8912H46.1615V23.8975C46.1615 20.0933 43.0426 16.9989 39.2094 16.9989H18.0767V25.2768H37.8191ZM69.8027 3.06311C59.8355 3.06311 51.7278 11.1097 51.7278 20.9989C51.7278 30.8894 59.8355 38.9365 69.8027 38.9365H83.7065C93.6736 38.9365 101.781 30.8898 101.781 20.9989C101.781 11.1097 93.6742 3.06311 83.7065 3.06311H69.8027ZM69.8031 30.6583C64.4361 30.6583 60.0704 26.3247 60.0704 20.9989C60.0704 15.6744 64.4356 11.341 69.8031 11.341H83.7069C89.0741 11.341 93.4398 15.6748 93.4398 20.9989C93.4398 26.3247 89.0741 30.6583 83.7069 30.6583H69.8031ZM120.668 10.4103L120.639 3.1599L114.376 3.18454L114.405 10.4349L107.1 10.4636L107.126 16.6781L114.432 16.648L114.461 23.8984L120.724 23.8733L120.693 16.623L128 16.5929L127.975 10.3803L120.668 10.4103Z" fill="white" />
  </svg>
);

function XBuilderLogoSlogan() {
  return (
    <>
      <svg width="65" height="63" viewBox="0 0 65 63" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5982 53.8243L14.5757 53.8488L16.3052 55.5782L16.3277 55.5538L16.9175 56.1437L10.3706 59.9708L4.25149 62.8341C3.4648 63.2018 2.6484 62.3854 3.01614 61.5988L5.87942 55.4796L9.69094 48.9171L14.5982 53.8243ZM58.4497 15.7198L19.5542 54.5978C19.5449 54.6071 19.5343 54.6155 19.523 54.6222L19.1021 54.8673L18.0581 53.8243L57.3062 14.5763L58.4497 15.7198ZM55.5767 12.8468L16.3286 52.0948L10.9624 46.7277L11.2095 46.3038C11.2162 46.2923 11.2245 46.281 11.2339 46.2716L50.1265 7.39661L55.5767 12.8468Z" fill="white" />
        <path d="M51.6177 5.88419L53.256 4.10984C55.4832 1.69782 58.2511 1.35345 61.3197 4.11083C64.8845 7.51304 63.5457 10.4342 61.3188 12.8459L59.9094 14.1465L51.6177 5.88419Z" fill="white" />
        <path d="M51.6177 5.88419L53.256 4.10984C55.4832 1.69782 58.2511 1.35345 61.3197 4.11083C64.8845 7.51304 63.5457 10.4342 61.3188 12.8459L59.9094 14.1465L51.6177 5.88419Z" fill="white" />
        <path d="M63.166 52.9716C65.457 55.2658 65.457 58.985 63.166 61.2792C60.875 63.5734 57.1602 63.5734 54.8692 61.2792L17.0742 23.4335L25.377 15.1307L63.166 52.9716ZM27.3018 0.0799666C27.4264 -0.03006 27.6159 -0.0269465 27.7334 0.0907088L31.2373 3.5995C31.84 4.20325 31.8401 5.18237 31.2373 5.78602L23.6406 13.3915L23.6484 13.3993L15.3457 21.702L15.3438 21.7001L9.62208 27.4306C9.01919 28.0341 8.04136 28.0342 7.43849 27.4306L0.45216 20.4345C-0.150736 19.8307 -0.150705 18.8517 0.45216 18.2479L16.2656 2.41297C16.3486 2.32989 16.4712 2.3012 16.583 2.3368C17.6465 2.67542 18.7796 2.85829 19.9551 2.85829C22.7714 2.85825 25.343 1.80888 27.3018 0.0799666Z" fill="white" />
      </svg>
      <p style={{margin: "0"}}>在 XBuilder<br />创作并分享你的作品</p>
    </>
  );
}

function LogoSlogan() {
  if (process.env.TARGET === "xbuilder") {
    return <XBuilderLogoSlogan />;
  }
  return <GoPlusLogo />;
}

export const CustomFormMobile = ({application}) => {

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div
        style={{
          backgroundImage: `url(${bgMobile})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "404px",
          position: "relative",
          zIndex: 1,
          gap: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "27px",
            color: "#fff",
            fontSize: "18px",
            lineHeight: "25px",
            fontWeight: "600",
            letterSpacing: "0.36px",
          }}
        >
          <LogoSlogan />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexDirection: "column",
            alignItems: "flex-start",
            width: "295px",
          }}
        >
          <LanguageSelect
            languages={application.organizationObj.languages}
            dark={true}
          />
          {filterProviders(application.providers).map((provider) => (
            <LoginButton key={provider.type} application={application} provider={provider.provider} />
          ))}
        </div>
      </div>
    </div>
  );
};

const useMediaQuery = (query) => {
  const mediaMatch = window.matchMedia(query);
  const [matches, setMatches] = useState(mediaMatch.matches);

  useEffect(() => {
    const handler = (e) => setMatches(e.matches);
    mediaMatch.addEventListener("change", handler);
    return () => mediaMatch.removeEventListener("change", handler);
  });

  return matches;
};

export const CustomForm = ({application}) => {
  // use media query to determine which form to show
  const isMobile = useMediaQuery("(max-width: 768px)");

  return <>
    <Helmet>
      <title>{i18next.t("login:Sign In")}</title>
      <link rel="icon" href={application.organizationObj?.favicon} />
    </Helmet>
    {isMobile ? (
      <CustomFormMobile application={application} />
    ) : (
      <CustomFormDesktop application={application} />
    )}
    <style>
      {`.ant-layout-footer {
        background: #fff !important;
      }`}
    </style>
  </>;
};
