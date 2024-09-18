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
        lineHeight: "88px",
        fontWeight: 700,
        fontSize: "68px",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}>
        <div>Welcome to Go+ Community</div>
        <div style={{display: "flex"}}>for&nbsp;
          <TextLoop
            texts={["Engineering", "STEM Education", "Data Science"]}
            duration={1500}
          />
          <div style={{width: "527px"}} />
        </div>
      </div>

    </div>
  );
};
