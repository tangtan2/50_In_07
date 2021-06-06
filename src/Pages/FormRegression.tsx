import React from "react";
import Spacer from "../Shared/Spacer";
import APIClient from "../API/APIClient";
import { PostRegressionType, RegressionPrediction } from "../types";

type Props = {};
type State = {
  selectedGameType: string;
  selectedOpposingTeam: string;
  selectedHomeOrAway: string;
  selectedFullName: string;
  selectedPrimaryPosition: string;
};

export default class FormRegression extends React.Component<Props, State> {
  handlePostRegressionENPrediction() {
    const data: PostRegressionType = {
      gameType: this.state.selectedGameType,
      opposingTeam: this.state.selectedOpposingTeam,
      homeOrAway: this.state.selectedHomeOrAway,
      fullName: this.state.selectedFullName,
      primaryPosition: this.state.selectedPrimaryPosition,
    };
    const prediction: RegressionPrediction = APIClient.postRegressionEN(data);
  }

  handlePostRegressionMLPPrediction() {
    const data: PostRegressionType = {
      gameType: this.state.selectedGameType,
      opposingTeam: this.state.selectedOpposingTeam,
      homeOrAway: this.state.selectedHomeOrAway,
      fullName: this.state.selectedFullName,
      primaryPosition: this.state.selectedPrimaryPosition,
    };
    const prediction: RegressionPrediction = APIClient.postRegressionMLP(data);
  }

  render() {
    return <div>test</div>;
  }
}
