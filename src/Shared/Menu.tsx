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
        backgroundColor: "#d5d8dc",
        borderRadius: "5px",
        padding: "10px",
        boxShadow: "1px 1px 3px 0.5px lightgrey",
        right: 0,
        position: "absolute",
      }}
    >
      <div
        className="menu-item"
        onClick={() => {
          history.push("/");
        }}
      >
        Home
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid white",
        }}
      />
      <div
        className="menu-item"
        onClick={() => {
          history.push("/analysis/play-location");
        }}
      >
        Play Location Analysis
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid white",
        }}
      />
      <div
        className="menu-item"
        onClick={() => {
          history.push("/analysis/player");
        }}
      >
        Player Stats
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid white",
        }}
      />
      <div
        className="menu-item"
        onClick={() => {
          history.push("/analysis/goalie");
        }}
      >
        Goalie Stats
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid white",
        }}
      />
      <div
        className="menu-item"
        onClick={() => {
          history.push("/analysis/team");
        }}
      >
        Team Stats
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid white",
        }}
      />
      <div
        className="menu-item"
        style={{
          fontStyle: "italics",
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
