import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PageHome from "./Pages/PageHome";
import "./index.css";
import Page404 from "./Pages/Page404";
import PagePlayLocationAnalysis from "./Pages/PagePlayLocationAnalysis";
import PagePlayerAnalysis from "./Pages/PagePlayerAnalysis";
import PageGoalieAnalysis from "./Pages/PageGoalieAnalysis";
import PageTeamAnalysis from "./Pages/PageTeamAnalysis";
import PagePredict from "./Pages/PagePredict";

export default class App extends React.Component {
  render = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={PageHome} />
          <Route
            exact
            path="/analysis/play-location"
            component={PagePlayLocationAnalysis}
          />
          <Route exact path="/analysis/player" component={PagePlayerAnalysis} />
          <Route exact path="/analysis/goalie" component={PageGoalieAnalysis} />
          <Route exact path="/analysis/team" component={PageTeamAnalysis} />
          <Route exact path="/predict" component={PagePredict} />
          <Route component={Page404} />
        </Switch>
      </BrowserRouter>
    );
  };
}
