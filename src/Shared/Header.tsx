import React from "react";
import Menu from "./Menu";
import menu_icon from "../images/menu_icon.png";

type Props = {};
type State = {
  menuOpen: boolean;
};

export default class Header extends React.Component<Props, State> {
  state = {
    menuOpen: false,
  };

  onMenuToggle() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {
    return (
      <div
        style={{
          fontFamily: "Nunito Sans",
          height: "30px",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "10px 15px 10px 15px",
            border: "1px solid lightgrey",
            boxShadow: "0px 3px 7px 1px lightgrey",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "5px",
                borderRadius: "5px",
                backgroundColor: this.state.menuOpen ? "lightgrey" : "white",
                transition: "all .2s ease-out",
                WebkitTransition: "all .2s ease-out",
                MozTransition: "all .2s ease-out",
                alignItems: "center",
              }}
            >
              <input
                style={{
                  width: "30px",
                  height: "30px",
                }}
                type="image"
                src={menu_icon}
                alt="Menu Icon"
                onClick={() => {
                  this.onMenuToggle();
                }}
              />
            </div>
          </div>
        </div>
        {this.state.menuOpen && <Menu />}
      </div>
    );
  }
}
