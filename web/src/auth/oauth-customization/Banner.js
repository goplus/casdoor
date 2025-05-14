import TextLoop from "./TextLoop";
import bg from "./bg.jpg";

export const Banner = () => {
  return (
    <div style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "371px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: "65px",
        lineHeight: "130%",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}>
        {
          process.env.TARGET === "xbuilder" ? (
            <div>在 XBuilder<br /><span style={{color: "rgba(64, 106, 255, 1)"}}>创作并分享</span>你的作品</div>
          ) : (
            <>
              <div>
                Welcome to Go+ Community
              </div>
              <TextLoop
                prefix="for "
                texts={["Engineering", "STEM Education", "Data Science"]}
              />
            </>
          )
        }
      </div>

    </div>
  );
};
