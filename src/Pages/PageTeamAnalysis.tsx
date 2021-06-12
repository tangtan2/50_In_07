import React from "react";
import Card from "../Shared/Card";
import Page from "../Shared/Page";
import Spacer from "../Shared/Spacer";

export default class PageTeamAnalysis extends React.Component {
  teamDashboardContainer: any;
  options = {
    hideTabs: "true",
    width: "100%",
    height: "900px",
  };

  componentDidMount() {
    window.initTeamViz(this.teamDashboardContainer, this.options);
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
            title="Team Analysis"
            titleAlign="left"
            titleSize={20}
            expandable={false}
            initialIsExpanded={true}
          >
            This visualization shows some team stats for the Maple Leafs over
            the years, starting from the 2015-2016 season. The top chart shows
            the average goals scored per game, broken down into even strength,
            power play, and short handed goals.
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
              this.teamDashboardContainer = div;
            }}
          />
        </div>
        <Spacer type="row" size="xlarge" />
      </Page>
    );
  }
}
