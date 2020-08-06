import React, { Component } from "react";

type MenuItem = { menuName: string; menuLink: string };
type StandardNavBarProps = {
  menuItems: Array<MenuItem>;
};
type StandardNavBarState = {
  selectedItem: MenuItem | undefined;
};

class StandardNavBar extends Component<
  StandardNavBarProps,
  StandardNavBarState
> {
  constructor(props: StandardNavBarProps) {
    super(props);
    this.state = { selectedItem: undefined };
  }
  handleSelected = (selection: MenuItem) => {
    this.setState({ selectedItem: selection });
  };
  render() {
    return (
      <div
        style={{
          height: "100px",
        }}
      >
        {this.props.menuItems.map((menuItem) => {
          const weight: "bold" | "normal" =
            this.state.selectedItem === menuItem ? "bold" : "normal";
          return (
            <React.Fragment>
              <div
                key={menuItem.menuName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <button
                  onClick={() => this.handleSelected}
                  style={{
                    fontSize: 20,
                    fontWeight: weight,
                  }}
                >
                  {menuItem.menuName}
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

export default StandardNavBar;
