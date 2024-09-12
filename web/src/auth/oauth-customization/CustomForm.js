import {useEffect, useState} from "react";
import bgMobilePng from "./bg-mobile.png";
import LanguageSelect from "../../common/select/LanguageSelect";
import {GithubButton} from "./GithubButton";
import {Checkbox} from "antd";
import i18next from "i18next";
import {Banner} from "./Banner";

const CustomFormDesktop = ({application}) => {
  const [autoSignin, setAutoSignin] = useState(true);

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
            maxWidth: "295px",
            gap: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <GithubButton
            application={application}
          />
          <Checkbox
            checked={autoSignin}
            onChange={(e) => {
              setAutoSignin(e.target.checked);
            }}
          >
            {/* TODO: We can just remove this checkbox */}
            {i18next.t("login:Auto sign in")}
          </Checkbox>

        </div>
      </div>
    </div>
  );
};

const GoPlusSvg = () => (
  <svg
    width="141"
    height="36"
    viewBox="0 0 141 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_92_221)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.8162 -0.247803C8.86808 -0.247803 0.774902 7.84537 0.774902 17.7917C0.774902 27.7395 8.86808 35.8331 18.8162 35.8335H32.9696V27.5074H18.8162C13.4595 27.5074 9.10109 23.149 9.10109 17.7922C9.10109 12.4368 13.4595 8.07839 18.8162 8.07839H46.5697V-0.247803H18.8162ZM38.5201 22.0944V35.7875H46.8462V20.7071C46.8462 16.8809 43.7334 13.7686 39.9077 13.7686H18.8162V22.0944H38.5201ZM70.4412 -0.247803C60.4936 -0.247803 52.4017 7.84537 52.4017 17.7917C52.4017 27.7395 60.4936 35.8331 70.4412 35.8331H84.3179C94.2655 35.8331 102.357 27.7399 102.357 17.7917C102.357 7.84537 94.2662 -0.247803 84.3179 -0.247803H70.4412ZM70.4417 27.5069C65.0851 27.5069 60.728 23.1483 60.728 17.7917C60.728 12.4364 65.0847 8.07792 70.4417 8.07792H84.3183C89.6751 8.07792 94.0322 12.4368 94.0322 17.7917C94.0322 23.1483 89.6751 27.5069 84.3183 27.5069H70.4417ZM121.207 7.14187L121.178 -0.150457L114.928 -0.12567L114.957 7.16666L107.666 7.19551L107.691 13.4459L114.984 13.4157L115.012 20.708L121.263 20.6828L121.233 13.3905L128.525 13.3603L128.5 7.11168L121.207 7.14187Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_92_221">
        <rect width="141" height="36" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const CustomFormMobile = ({application}) => {
  const [autoSignin, setAutoSignin] = useState(true);

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
          backgroundImage: `url(${bgMobilePng})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 68,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          gap: 48,
        }}
      >
        <GoPlusSvg />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <LanguageSelect
            languages={application.organizationObj.languages}
            dark={true}
          />
          <GithubButton
            application={application}
          />
          <Checkbox
            style={{color: "white"}}
            checked={autoSignin}
            onChange={(e) => {
              setAutoSignin(e.target.checked);
            }}
          >
            {i18next.t("login:Auto sign in")}
          </Checkbox>
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

  return isMobile ? (
    <CustomFormMobile application={application} />
  ) : (
    <CustomFormDesktop application={application} />
  );
};
