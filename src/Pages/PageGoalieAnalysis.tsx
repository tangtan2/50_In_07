import React from "react";
import Page from "../Shared/Page";

export default class PageGoalieAnalysis extends React.Component {
  goalieDashboardContainer: any;
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
              this.goalieDashboardContainer = div;
            }}
          />
        </div>
        {window.initGoalieViz(this.goalieDashboardContainer, this.options)}
      </Page>
    );
  }
}
