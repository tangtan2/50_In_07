import React from "react";
import Card from "../Shared/Card";
import Page from "../Shared/Page";
import Spacer from "../Shared/Spacer";

export default class PageGoalieAnalysis extends React.Component {
  goalieDashboardContainer: any;
  options = {
    hideTabs: "true",
    width: "100%",
    height: "900px",
  };

  componentDidMount() {
    window.initGoalieViz(this.goalieDashboardContainer, this.options);
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
            title="Goalie Analysis - Frederik Andersen"
            titleAlign="left"
            titleSize={20}
            expandable={false}
            initialIsExpanded={true}
          >
            test
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
              this.goalieDashboardContainer = div;
            }}
          />
        </div>
        <Spacer type="row" size="xlarge" />
      </Page>
    );
  }
}
