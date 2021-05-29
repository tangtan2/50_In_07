import React from "react";

type Props = {
  title: string;
  defaultTab: string;
  tabs: { tabName: string; body: any }[];
};
type State = {
  activeTab: string;
};

export default class Card extends React.Component<Props, State> {
  state = { activeTab: this.props.defaultTab };

  render() {
    return (
      <div
        style={{
          border: "1px solid lightgrey",
          borderRadius: "5px",
          padding: "10px",
          backgroundColor: "white",
        }}
      >
        <div>{this.props.title}</div>
        {this.props.tabs.map((tab) => {
          return <div>{tab.tabName}</div>;
        })}
      </div>
    );
  }
}
