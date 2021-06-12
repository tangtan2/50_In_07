import React from "react";
import Card from "../Shared/Card";
import Page from "../Shared/Page";
import Spacer from "../Shared/Spacer";

export default class PagePlayLocationAnalysis extends React.Component {
  playLocationDashboardContainer: any;
  options = {
    hideTabs: "true",
    width: "100%",
    height: "900px",
  };

  componentDidMount() {
    window.initPlayLocationViz(
      this.playLocationDashboardContainer,
      this.options
    );
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
          <Card
            title="Play Location Analysis"
            titleAlign="left"
            titleSize={20}
            expandable={false}
            initialIsExpanded={true}
          >
            <div>
              This visualization shows the points on the rink where certain
              plays occured. You can filter the points by the opposing team as
              well as the Maple Leafs player who participated in the play. There
              are 9 different play types you can look at, blocked shots,
              faceoffs, giveaways, goals, hits, missed shots, penalties, shots,
              and takeaways. Blocked shots refer to any shots that were
              physically blocked before reaching the goalie/net, missed shots
              refer to shots that missed the goalie/net, and shots refer to
              shots that were saved by the goalie.
            </div>
          </Card>
          <Spacer size="xlarge" type="row" />
          <div
            style={{
              padding: "20px",
              border: "2px solid #1b4f72",
              borderRadius: "5px",
              backgroundColor: "white",
              boxShadow: "2px 2px 1px 0.5px #496588",
              flex: 1,
            }}
            ref={(div) => {
              this.playLocationDashboardContainer = div;
            }}
          />
        </div>
        <Spacer type="row" size="xlarge" />
      </Page>
    );
  }
}
