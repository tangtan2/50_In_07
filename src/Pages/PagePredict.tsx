import React from "react";
import Page from "../Shared/Page";

export default class PagePredict extends React.Component {
  constructor(props: any) {
    super(props);
    window.clearViz();
  }

  render() {
    return <Page></Page>;
  }
}
