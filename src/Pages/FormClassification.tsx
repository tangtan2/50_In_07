import React from "react";
import Spacer from "../Shared/Spacer";
import APIClient from "../API/APIClient";
import Dropdown, { Option } from "react-dropdown";
import { PostClassificationType, ClassificationPrediction } from "../types";
import HockeyRink from "../images/hockey_rink.png";

type Props = {};
type State = {
  selectedPlayerName: string;
  selectedHeight: number;
  selectedWeight: number;
  selectedPrimaryPosition: string;
  selectedOpposingTeam: string;
  selectedPeriodType: string;
  inputtedXCoordinate: number;
  inputtedYCoordinate: number;
  clickedXCoordinate: number | null;
  clickedYCoordinate: number | null;
  inputtedYourGoals: number;
  inputtedOpponentGoals: number;
  selectedClassificationMethod: string;
  predictionResults: string;
  windowWidth: number;
};

export default class FormClassification extends React.Component<Props, State> {
  state: State = {
    selectedPlayerName: "",
    selectedHeight: 0,
    selectedWeight: 0,
    selectedPrimaryPosition: "",
    selectedOpposingTeam: "",
    selectedPeriodType: "",
    inputtedXCoordinate: 0,
    inputtedYCoordinate: 0,
    clickedXCoordinate: null,
    clickedYCoordinate: null,
    inputtedYourGoals: 0,
    inputtedOpponentGoals: 0,
    selectedClassificationMethod: "",
    predictionResults: "",
    windowWidth: 0,
  };
  playerNames: string[] = [];
  primaryPositions: { [playerName: string]: string } = {};
  heights: { [playerName: string]: number } = {};
  weights: { [playerName: string]: number } = {};
  opposingTeams: string[] = [];
  periodTypes: string[] = [];
  classificationMethods = ["Support Vector Machine", "Random Forest"];
  xCoordinateLimit = 100;
  yCoordinateLimit = 43;

  updateWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  async componentDidMount() {
    window.addEventListener("resize", this.updateWindowWidth);
    await this.handleGetPlayers();
    await this.handleGetOpposingTeams();
    await this.handleGetPeriodTypes();
    this.setState({
      selectedPlayerName: this.playerNames[0],
      selectedHeight: this.heights[this.playerNames[0]],
      selectedWeight: this.weights[this.playerNames[0]],
      selectedPeriodType: this.periodTypes[0],
      selectedOpposingTeam: this.opposingTeams[0],
      selectedPrimaryPosition: this.primaryPositions[this.playerNames[0]],
      selectedClassificationMethod: this.classificationMethods[0],
      windowWidth: window.innerWidth,
    });
  }

  async handleGetPlayers() {
    const players = (await APIClient.getPlayers()).filter(
      (x) => x?.primaryPosition !== "Goalie"
    );
    this.playerNames = players.map((x) => x?.firstName + " " + x?.lastName);
    players.map((x) => {
      if (x !== null) {
        this.primaryPositions[x.firstName + " " + x.lastName] =
          x.primaryPosition;
        this.heights[x.firstName + " " + x.lastName] =
          parseInt(x.height.split("-")[0]) * 12 +
          parseInt(x.height.split("-")[1]);
        this.weights[x.firstName + " " + x.lastName] = x.weight;
      }
      return null;
    });
  }

  async handleGetOpposingTeams() {
    this.opposingTeams = await APIClient.getTeamNames();
  }

  async handleGetPeriodTypes() {
    this.periodTypes = await APIClient.getPeriodTypes();
  }

  handleSetPlayerName(option: Option) {
    this.setState({
      selectedPlayerName: option.value,
      selectedPrimaryPosition: this.primaryPositions[option.value],
      selectedHeight: this.heights[option.value],
      selectedWeight: this.weights[option.value],
    });
  }

  handleSetOpposingTeam(option: Option) {
    this.setState({ selectedOpposingTeam: option.value });
  }

  handleSetPeriodType(option: Option) {
    this.setState({ selectedPeriodType: option.value });
  }

  handleSetClassificationMethod(option: Option) {
    this.setState({ selectedClassificationMethod: option.value });
  }

  handleClickRinkLocation(
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) {
    const element = document.getElementById("hockey-rink");
    const boundingBox = element?.getBoundingClientRect();
    if (boundingBox !== undefined) {
      const height = boundingBox.bottom - boundingBox.top;
      const width = boundingBox.right - boundingBox.left;
      const clickedXWidthPercent = (event.clientX - boundingBox.left) / width;
      const clickedYHeightPercent = (event.clientY - boundingBox.top) / height;
      const normalizedXCoordinate =
        clickedXWidthPercent * this.xCoordinateLimit * 2 -
        this.xCoordinateLimit;
      const normalizedYCoordinate =
        -clickedYHeightPercent * this.yCoordinateLimit * 2 +
        this.yCoordinateLimit;
      this.setState({
        inputtedXCoordinate: Math.round(normalizedXCoordinate),
        inputtedYCoordinate: Math.round(normalizedYCoordinate),
        clickedXCoordinate: event.pageX,
        clickedYCoordinate: event.pageY,
      });
    }
  }

  handleSetYourGoals(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ inputtedYourGoals: parseInt(event.target.value) });
  }

  handleSetOpponentGoals(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ inputtedOpponentGoals: parseInt(event.target.value) });
  }

  async handlePostClassification() {
    let goalRatio;
    if (this.state.inputtedYourGoals === 0) {
      goalRatio = 0;
    } else if (
      this.state.inputtedOpponentGoals + this.state.inputtedYourGoals ===
      0
    ) {
      goalRatio = this.state.inputtedYourGoals;
    } else {
      goalRatio =
        this.state.inputtedYourGoals /
        (this.state.inputtedOpponentGoals + this.state.inputtedYourGoals);
    }
    const data: PostClassificationType = {
      full_name: this.state.selectedPlayerName,
      primary_position: this.state.selectedPrimaryPosition,
      height: this.state.selectedHeight,
      weight: this.state.selectedWeight,
      opposing_team: this.state.selectedOpposingTeam,
      period_type: this.state.selectedPeriodType,
      x_coordinate: this.state.inputtedXCoordinate,
      y_coordinate: this.state.inputtedYCoordinate,
      goal_ratio: goalRatio,
    };
    let prediction: ClassificationPrediction;
    if (this.state.selectedClassificationMethod === "Random Forest") {
      prediction = await this.handlePostClassificationRFPrediction(data);
    } else {
      prediction = await this.handlePostClassificationSVMPrediction(data);
    }
    const predictionSummary =
      "Using classification method: " +
      this.state.selectedClassificationMethod +
      ", player " +
      this.state.selectedPlayerName +
      " is most likely to " +
      (prediction.playerType === "Scorer"
        ? "successfully score a goal"
        : "miss a goal") +
      " when attempting a shot during a " +
      this.state.selectedPeriodType +
      " period against the " +
      this.state.selectedOpposingTeam +
      " from coordinates (" +
      this.state.inputtedXCoordinate +
      ", " +
      this.state.inputtedYCoordinate +
      ") when the Leafs have scored " +
      this.state.inputtedYourGoals +
      " goals and the opponent has scored " +
      this.state.inputtedOpponentGoals +
      " goals. ";
    this.setState({ predictionResults: predictionSummary });
  }

  async handlePostClassificationSVMPrediction(data: PostClassificationType) {
    const prediction: ClassificationPrediction =
      await APIClient.postClassificationSVM(data);
    return prediction;
  }

  async handlePostClassificationRFPrediction(data: PostClassificationType) {
    const prediction: ClassificationPrediction =
      await APIClient.postClassificationRF(data);
    return prediction;
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px" }}>DESCRIPTION PLACEHOLDER</div>
        <div
          style={{
            display: "flex",
            flexDirection: this.state.windowWidth > 1200 ? "row" : "column",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "450px",
            }}
          >
            <div>Select your prediction parameters!</div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "160px" }}>Player Name: </div>
              <Spacer type="column" size="medium" />
              <Dropdown
                options={this.playerNames}
                value={this.state.selectedPlayerName}
                onChange={(option) => {
                  this.handleSetPlayerName(option);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "160px" }}>Period Type: </div>
              <Spacer type="column" size="medium" />
              <Dropdown
                options={this.periodTypes}
                value={this.state.selectedPeriodType}
                onChange={(option) => {
                  this.handleSetPeriodType(option);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "160px" }}>Opposing Team: </div>
              <Spacer type="column" size="medium" />
              <Dropdown
                options={this.opposingTeams}
                value={this.state.selectedOpposingTeam}
                onChange={(option) => {
                  this.handleSetOpposingTeam(option);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "160px" }}>Your Goals: </div>
              <Spacer type="column" size="medium" />
              <input
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "2px",
                  flex: 1,
                  height: "30px",
                  fontFamily: "Nunito Sans",
                  fontSize: "12pt",
                  color: "#333",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
                type="number"
                value={this.state.inputtedYourGoals}
                onChange={(event) => {
                  this.handleSetYourGoals(event);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "160px" }}>Opponent Goals: </div>
              <Spacer type="column" size="medium" />
              <input
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "2px",
                  flex: 1,
                  height: "30px",
                  fontFamily: "Nunito Sans",
                  fontSize: "12pt",
                  color: "#333",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
                type="number"
                value={this.state.inputtedOpponentGoals}
                onChange={(event) => {
                  this.handleSetOpponentGoals(event);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "160px" }}>Classification Method: </div>
              <Spacer type="column" size="medium" />
              <Dropdown
                options={this.classificationMethods}
                value={this.state.selectedClassificationMethod}
                onChange={(option) => {
                  this.handleSetClassificationMethod(option);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "160px" }}>X Coordinate: </div>
              <Spacer type="column" size="medium" />
              <input
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "2px",
                  flex: 1,
                  height: "30px",
                  fontFamily: "Nunito Sans",
                  fontSize: "12pt",
                  color: "#333",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
                disabled={true}
                type="number"
                value={this.state.inputtedXCoordinate}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "160px" }}>Y Coordinate: </div>
              <Spacer type="column" size="medium" />
              <input
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "2px",
                  flex: 1,
                  height: "30px",
                  fontFamily: "Nunito Sans",
                  fontSize: "12pt",
                  color: "#333",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
                disabled={true}
                type="number"
                value={this.state.inputtedYCoordinate}
              />
            </div>
          </div>
          {this.state.windowWidth > 1200 ? (
            <div />
          ) : (
            <Spacer type="row" size="large" />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                height: "60px",
                width: "250px",
                border: "2px solid #1b4f72",
                boxShadow: "2px 2px 1px 0.5px #1b4f72",
                backgroundColor: "white",
                borderRadius: "5px",
                fontSize: "12pt",
                fontFamily: "Nunito Sans",
              }}
              onClick={() => {
                this.handlePostClassification();
              }}
            >
              Make a Prediction...
            </button>
          </div>
          {this.state.windowWidth > 1200 ? (
            <div />
          ) : (
            <Spacer type="row" size="large" />
          )}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              border: "2px solid #1b4f72",
              boxShadow: "2px 2px 1px 0.5px #1b4f72",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                padding: "10px",
                borderBottom: "1px solid #1b4f72",
              }}
            >
              Prediction Results
            </div>
            <Spacer type="row" size="xlarge" />
            <div style={{ flex: 0.5 }} />
            <div
              style={{
                width: "80%",
                textAlign: "center",
                whiteSpace: "normal",
              }}
            >
              {this.state.predictionResults}
            </div>
            <div style={{ flex: 1 }} />
            <Spacer type="row" size="xlarge" />
          </div>
        </div>
        <Spacer type="row" size="xlarge" />
        <div style={{ textAlign: "center" }}>
          Click the location on the rink where you would like to simulate your
          shot from.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <img
            alt="Hockey Rink"
            id="hockey-rink"
            style={{
              borderRadius: "10px",
              border: "2px solid #1b4f72",
              boxShadow: "2px 2px 1px 0.5px #1b4f72",
              opacity: 0.5,
            }}
            onClick={(event) => {
              this.handleClickRinkLocation(event);
            }}
            src={HockeyRink}
            width="700px"
          />
        </div>
        <Spacer type="row" size="xlarge" />
        {this.state.clickedXCoordinate !== null &&
        this.state.clickedYCoordinate !== null ? (
          <div
            style={{
              position: "absolute",
              left: this.state.clickedXCoordinate - 4,
              top: this.state.clickedYCoordinate - 12,
              cursor: "default",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            x
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}
