import React from "react";
import Card from "../Shared/Card";
import Page from "../Shared/Page";
import Spacer from "../Shared/Spacer";
import { PlayerSummaryType, SeasonSummaryType } from "../types";
import PlayerSummary from "./PlayerSummary";
import SeasonSummary from "./SeasonSummary";
import Dropdown, { Option } from "react-dropdown";
import "../Shared/Dropdown.css";

declare global {
  interface Window {
    initPlayLocationViz(container: any, options: any): void;
    initPlayerViz(container: any, options: any): void;
    initGoalieViz(container: any, options: any): void;
    initTeamViz(container: any, options: any): void;
    clearViz(): void;
  }
}

type Props = {};
type State = {
  playerStats: PlayerSummaryType;
  seasonStats: SeasonSummaryType;
};

export default class PageHome extends React.Component<Props, State> {
  state: State = {
    playerStats: null,
    seasonStats: null,
  };
  playerList: string[] = [];
  seasonList: string[] = [];

  constructor(props: Props) {
    super(props);
    window.clearViz();
  }

  componentDidMount() {
    this.playerList = ["test", "test1"];
    this.seasonList = ["2014-2015", "2015-2016"];
    const playerData = {
      firstName: "test",
      lastName: "test",
      jerseyNumber: 1,
      birthDate: "1995-09-30",
      nationality: "CAN",
      height: "6-1",
      weight: 300,
      isAlternateCaptain: false,
      isCaptain: true,
      isRookie: false,
      shootsCatches: "L",
      primaryPosition: "Center",
      imageLink:
        "https://www.hockeydb.com/ihdb/stats/photo.php?if=joe-thornton-2021-38.jpg",
    };
    const seasonData = {
      season: "2014-2015",
      gamesPlayed: 1,
      wins: 2,
      losses: 3,
      overtime: 1,
      points: 2,
      goalsPerGame: 3,
      goalsAgainstPerGame: 1.05,
      evGGARatio: 4.9,
      powerPlayPercentage: 1,
      powerPlayGoals: 2,
      powerPlayGoalsAgainst: 3,
      powerPlayOpportunities: 1,
      penaltyKillPercentage: 4,
      shotsPerGame: 5,
      shotsAllowedPerGame: 1,
      winScoreFirst: 4,
      winOppScoreFirst: 2,
      winLeadFirstPer: 8,
      winLeadSecondPer: 4,
      winOutshootOpp: 2,
      winOutshotByOpp: 3,
      faceoffsTaken: 4,
      faceoffsLost: 6,
      faceoffsWon: 6,
    };
    this.setState({ playerStats: playerData, seasonStats: seasonData });
  }

  async handleSelectPlayer(player: Option) {
    const data = null;
    this.setState({ playerStats: data });
  }

  async handleSelectSeason(season: Option) {
    const data = null;
    this.setState({ seasonStats: data });
  }

  render() {
    return (
      <Page>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Card title="50 in '07" titleAlign="right" titleSize={25}>
            <div>
              <div
                style={{
                  float: "left",
                  paddingLeft: "10px",
                  paddingRight: "20px",
                }}
              >
                <img
                  alt="Maple Leafs Logo"
                  src="//upload.wikimedia.org/wikipedia/en/thumb/e/e7/Toronto_Maple_Leafs_Logo_1939_-_1967.svg/184px-Toronto_Maple_Leafs_Logo_1939_-_1967.svg.png"
                />
              </div>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  padding: "10px",
                  fontSize: "14pt",
                  fontWeight: "lighter",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                efficitur nunc porta malesuada luctus. Nullam tristique bibendum
                ipsum sit amet volutpat. Donec fermentum risus sed nisl dictum
                vulputate. Nullam non ex turpis. Nullam condimentum odio ut
                tincidunt eleifend. Morbi congue leo enim, non congue massa
                tristique et. Integer ut magna a enim molestie congue eu eget
                leo. Maecenas gravida nunc sed ligula pretium consequat.
                Phasellus lobortis tincidunt arcu, quis maximus nisi accumsan
                vitae. Suspendisse at congue lorem, a hendrerit ante. Integer
                leo tortor, dictum vel orci viverra, porta dictum libero.
                Vestibulum quis metus lorem. Donec rutrum elementum facilisis.
                Fusce diam sapien, euismod non purus pharetra, mollis ornare
                lacus. Vestibulum auctor, turpis varius semper porttitor, massa
                mauris aliquam dolor, eget maximus quam odio eget nunc. Nulla
                efficitur dolor eu nisi sollicitudin congue. Praesent congue
                varius leo non euismod. Donec sed bibendum mauris. Praesent
                suscipit non purus nec gravida.
              </div>
            </div>
          </Card>
          <Spacer type="row" size="xlarge" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 0.8,
              }}
            >
              <Dropdown
                options={this.playerList}
                onChange={(option) => {
                  this.handleSelectPlayer(option);
                }}
                placeholder="Select a player"
              />
              <Spacer type="row" size="medium" />
              <Card title="Player" titleAlign="left" titleSize={20}>
                <PlayerSummary playerStats={this.state.playerStats} />
              </Card>
            </div>
            <Spacer type="column" size="xlarge" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Dropdown
                options={this.seasonList}
                onChange={(option) => {
                  this.handleSelectSeason(option);
                }}
                placeholder="Select a season"
              />
              <Spacer type="row" size="medium" />
              <Card title="Season" titleAlign="left" titleSize={20}>
                <SeasonSummary seasonStats={this.state.seasonStats} />
              </Card>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
