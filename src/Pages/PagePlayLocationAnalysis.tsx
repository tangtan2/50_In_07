import React from "react";
import Page from "../Shared/Page";

export default class PagePlayLocationAnalysis extends React.Component {
  playLocationDashboardContainer: any;
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
              this.playLocationDashboardContainer = div;
            }}
          />
        </div>
        {window.initPlayLocationViz(
          this.playLocationDashboardContainer,
          this.options
        )}
      </Page>
    );
  }
}
