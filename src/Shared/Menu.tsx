import { useHistory } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  let history = useHistory();

  return (
    <div
      style={{
        width: "200px",
        marginTop: "5px",
        marginRight: "5px",
        border: "1px solid lightgrey",
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "10px",
        boxShadow: "1px 1px 3px 0.5px lightgrey",
        right: 0,
        position: "absolute",
        color: "#212F3C",
      }}
    >
      <div
        className="menu-item"
        style={{
          fontWeight: window.location.pathname === "/" ? "bolder" : "normal",
        }}
        onClick={() => {
          history.push("/");
        }}
      >
        Home
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
      />
      <div
        className="menu-item"
        style={{
          fontWeight:
            window.location.pathname === "/analysis/play-location"
              ? "bolder"
              : "normal",
        }}
        onClick={() => {
          if (window.location.pathname !== "/analysis/play-location") {
            history.push("/analysis/play-location");
          }
        }}
      >
        Play Location Analysis
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
      />
      <div
        className="menu-item"
        style={{
          fontWeight:
            window.location.pathname === "/analysis/player"
              ? "bolder"
              : "normal",
        }}
        onClick={() => {
          if (window.location.pathname !== "/analysis/player") {
            history.push("/analysis/player");
          }
        }}
      >
        Player Analysis
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
      />
      <div
        className="menu-item"
        style={{
          fontWeight:
            window.location.pathname === "/analysis/goalie"
              ? "bolder"
              : "normal",
        }}
        onClick={() => {
          if (window.location.pathname !== "/analysis/goalie") {
            history.push("/analysis/goalie");
          }
        }}
      >
        Goalie Analysis
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
      />
      <div
        className="menu-item"
        style={{
          fontWeight:
            window.location.pathname === "/analysis/team" ? "bolder" : "normal",
        }}
        onClick={() => {
          if (window.location.pathname !== "/analysis/team") {
            history.push("/analysis/team");
          }
        }}
      >
        Team Analysis
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
      />
      <div
        className="menu-item"
        style={{
          fontStyle: "italics",
          fontWeight:
            window.location.pathname === "/predict" ? "bolder" : "normal",
        }}
        onClick={() => {
          history.push("/predict");
        }}
      >
        Make a Prediction!
      </div>
    </div>
  );
};

export default Menu;
