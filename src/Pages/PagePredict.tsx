import React from "react";
import Card from "../Shared/Card";
import Page from "../Shared/Page";
import Spacer from "../Shared/Spacer";
import {
  PostClassificationType,
  PostRegressionType,
  RegressionPrediction,
  ClassificationPrediction,
} from "../types";

type Props = {};
type State = {};

export default class PagePredict extends React.Component<Props, State> {
  state: State = {};

  constructor(props: any) {
    super(props);
    window.clearViz();
  }

  handlePostClassificationSVMPrediction() {}

  handlePostClassificationRFPrediction() {}

  handlePostRegressionENPrediction() {}

  handlePostRegressionMLPPrediction() {}

  render() {
    return (
      <Page>
        <Card
          title="Predicting Goal Success: Binary Classification"
          titleAlign="left"
          titleSize={20}
        ></Card>
        <Spacer type="row" size="xlarge" />
        <Card
          title="Predicting Number of Goals Scored: Regression"
          titleAlign="left"
          titleSize={20}
        ></Card>
      </Page>
    );
  }
}
