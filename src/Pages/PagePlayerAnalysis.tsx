import React from "react";
import Page from "../Shared/Page";

export default class PagePlayerAnalysis extends React.Component {
  playerDashboardViz: any;
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
              this.playerDashboardViz = div;
            }}
          />
        </div>
        {window.initPlayerViz(this.playerDashboardViz, this.options)}
      </Page>
    );
  }
}
