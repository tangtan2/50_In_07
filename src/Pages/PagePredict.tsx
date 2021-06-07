import React from "react";
import Card from "../Shared/Card";
import Page from "../Shared/Page";
import Spacer from "../Shared/Spacer";
import FormClassification from "./FormClassification";
import FormRegression from "./FormRegression";

export default class PagePredict extends React.Component {
  constructor(props: any) {
    super(props);
    window.clearViz();
  }

  render() {
    return (
      <Page>
        <Card
          expandable={true}
          initialIsExpanded={true}
          title="Predicting Goal Success: Binary Classification"
          titleAlign="left"
          titleSize={20}
        >
          <FormClassification />
        </Card>
        <Spacer type="row" size="xlarge" />
        <Card
          expandable={true}
          initialIsExpanded={false}
          title="Predicting Number of Goals Scored: Regression"
          titleAlign="left"
          titleSize={20}
        >
          <FormRegression />
        </Card>
        <Spacer type="row" size="xlarge" />
      </Page>
    );
  }
}
