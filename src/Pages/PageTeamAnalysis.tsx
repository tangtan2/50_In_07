import React from "react";
import Page from "../Shared/Page";

export default class PageTeamAnalysis extends React.Component {
  teamDashboardContainer: any;
  options = {
    hideTabs: "true",
    width: "100%",
    height: "900px",
  };

  render() {
    return (
      <Page>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            ref={(div) => {
              this.teamDashboardContainer = div;
            }}
          />
        </div>
        {window.initTeamViz(this.teamDashboardContainer, this.options)}
      </Page>
    );
  }
}
