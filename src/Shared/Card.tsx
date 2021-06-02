import React from "react";

type Props = {
  title: string;
  titleAlign: "center" | "left" | "right";
  titleSize: number;
};
type State = {};

export default class Card extends React.Component<Props, State> {
  render() {
    return (
      <div
        style={{
          border: "2px solid #1b4f72",
          borderRadius: "5px",
          padding: "10px",
          backgroundColor: "white",
          boxShadow: "2px 2px 1px 0.5px #1b4f72",
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: this.props.titleSize,
            marginBottom: "10px",
            textAlign: this.props.titleAlign,
            borderBottom: "1px solid lightgrey",
          }}
        >
          {this.props.title}
        </div>
        {this.props.children}
      </div>
    );
  }
}
