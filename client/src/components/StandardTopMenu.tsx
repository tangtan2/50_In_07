import React, { Component } from "react";

type Props = {
  menuItems: Array<string>;
};

class StandardTopMenu extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          height: "100px",
        }}
      >
        {this.props.menuItems.map((menuSelection) => {
          return (
            <div
              key={menuSelection}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <span style={{ fontSize: 20 }}>{menuSelection}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default StandardTopMenu;
