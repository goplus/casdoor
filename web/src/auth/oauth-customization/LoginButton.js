import i18next from "i18next";
import {getAuthUrl} from "../Provider";
import {getProviderLogoURL} from "../../Setting";

const providerInfo = {
  github: {
    icon: (
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.5095 1C6.14505 1 1 6.18298 1 12.595C1 17.7205 4.29661 22.0592 8.86989 23.5947C9.44166 23.7102 9.6511 23.3452 9.6511 23.0383C9.6511 22.7695 9.63226 21.8481 9.63226 20.888C6.43059 21.5793 5.76387 19.5058 5.76387 19.5058C5.24934 18.162 4.48697 17.8167 4.48697 17.8167C3.43906 17.1063 4.5633 17.1063 4.5633 17.1063C5.7257 17.1831 6.33564 18.2965 6.33564 18.2965C7.36447 20.0625 9.02231 19.5635 9.68927 19.2563C9.78445 18.5076 10.0895 17.9893 10.4135 17.7014C7.85991 17.4326 5.17324 16.4344 5.17324 11.9806C5.17324 10.7136 5.63029 9.67702 6.35449 8.87083C6.24023 8.58294 5.83996 7.3925 6.46899 5.7992C6.46899 5.7992 7.4408 5.49199 9.63202 6.9894C10.5702 6.73559 11.5376 6.60648 12.5095 6.60539C13.4813 6.60539 14.472 6.73991 15.3868 6.9894C17.5782 5.49199 18.55 5.7992 18.55 5.7992C19.1791 7.3925 18.7786 8.58294 18.6643 8.87083C19.4076 9.67702 19.8458 10.7136 19.8458 11.9806C19.8458 16.4344 17.1591 17.4133 14.5865 17.7014C15.0058 18.0661 15.3677 18.7571 15.3677 19.8514C15.3677 21.4063 15.3488 22.6543 15.3488 23.038C15.3488 23.3452 15.5585 23.7102 16.1301 23.595C20.7033 22.0589 23.9999 17.7205 23.9999 12.595C24.0188 6.18298 18.8549 1 12.5095 1Z" fill="white" />
      </svg>
    ),
    backgroundColor: "rgba(36, 41, 47, 1)",
  },
};

export const LoginButton = ({application, provider}) => {
  const {icon, backgroundColor} = providerInfo[provider.type.toLowerCase()] || {
    icon: <img src={getProviderLogoURL(provider)} alt={`Sign in with ${provider.type}`} style={{width: 24, height: 24}} />,
    backgroundColor: "#333",
  };

  return (
    <a
      style={{
        height: "48px",
        width: "100%",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0px 50px",
        gap: "12px",
        background: backgroundColor,
        cursor: "pointer",
      }}
      href={getAuthUrl(application, provider, "signup")}
    >
      {icon}
      <div style={{color: "white", lineHeight: "24px", fontSize: "16px", fontWeight: "500"}}>{i18next.t("login:Sign in with {type}").replace("{type}", provider.type)}</div>
    </a>
  );
};
