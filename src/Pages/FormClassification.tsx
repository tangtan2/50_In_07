import React from "react";
import Spacer from "../Shared/Spacer";
import APIClient from "../API/APIClient";
import { PostClassificationType, ClassificationPrediction } from "../types";

type Props = {};
type State = {
  selectedFullName: string;
  selectedPrimaryPosition: string;
  selectedOpposingTeam: string;
  selectedPeriodType: string;
  selectedXCoordinate: number;
  selectedYCoordinate: number;
  inputtedYourGoals: number;
  inputtedOpponentGoals: number;
};

export default class FormClassification extends React.Component<Props, State> {
  handlePostClassificationSVMPrediction() {
    const data: PostClassificationType = {
      fullName: this.state.selectedFullName,
      primaryPosition: this.state.selectedPrimaryPosition,
      opposingTeam: this.state.selectedOpposingTeam,
      periodType: this.state.selectedPeriodType,
      xCoordinate: this.state.selectedXCoordinate,
      yCoordinate: this.state.selectedYCoordinate,
      goalRatio:
        this.state.inputtedYourGoals / this.state.inputtedOpponentGoals,
    };
    const prediction: ClassificationPrediction =
      APIClient.postClassificationSVM(data);
  }

  handlePostClassificationRFPrediction() {
    const data: PostClassificationType = {
      fullName: this.state.selectedFullName,
      primaryPosition: this.state.selectedPrimaryPosition,
      opposingTeam: this.state.selectedOpposingTeam,
      periodType: this.state.selectedPeriodType,
      xCoordinate: this.state.selectedXCoordinate,
      yCoordinate: this.state.selectedYCoordinate,
      goalRatio:
        this.state.inputtedYourGoals / this.state.inputtedOpponentGoals,
    };
    const prediction: ClassificationPrediction =
      APIClient.postClassificationRF(data);
  }

  render() {
    return <div>test</div>;
  }
}
