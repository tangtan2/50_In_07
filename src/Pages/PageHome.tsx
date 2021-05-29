import React from "react";
import Card from "../Shared/Card";
import Page from "../Shared/Page";

type Props = {};
type State = {};

export default class PageHome extends React.Component<Props, State> {
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
            title="test"
            defaultTab="tab"
            tabs={[
              { tabName: "tab", body: "test description" },
              { tabName: "tab2", body: "test description2" },
            ]}
          />
        </div>
      </Page>
    );
  }
}
