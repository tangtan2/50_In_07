import React from "react";
import PlusIcon from "../images/plus_icon.png";
import MinusIcon from "../images/minus_icon.png";
import "./Card.css";

type Props = {
  title: string;
  titleAlign: "center" | "left" | "right";
  titleSize: number;
  expandable: boolean;
  initialIsExpanded: boolean;
};
type State = {
  isExpanded: boolean;
};

export default class Card extends React.Component<Props, State> {
  state: State = {
    isExpanded: this.props.initialIsExpanded,
  };

  handleExpandCard() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

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
          className="expandable-title"
          style={{
            fontSize: this.props.titleSize,
            marginBottom: "10px",
            textAlign: this.props.titleAlign,
            borderBottom: "1px solid lightgrey",
          }}
          onClick={() => {
            this.handleExpandCard();
          }}
        >
          {this.props.expandable ? (
            this.state.isExpanded ? (
              <img
                style={{ marginRight: "10px" }}
                width="20px"
                height="20px"
                src={MinusIcon}
                alt="Minus Icon"
              />
            ) : (
              <img
                style={{ marginRight: "10px" }}
                width="20px"
                height="20px"
                src={PlusIcon}
                alt="Plus Icon"
              />
            )
          ) : (
            <div />
          )}
          {this.props.title}
        </div>
        {this.props.expandable ? (
          this.state.isExpanded ? (
            this.props.children
          ) : (
            <div />
          )
        ) : (
          this.props.children
        )}
      </div>
    );
  }
}
