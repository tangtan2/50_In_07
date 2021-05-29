import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PageHome from "./Pages/PageHome";
import "./index.css";

export default class App extends React.Component {
  render = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={PageHome} />
        </Switch>
      </BrowserRouter>
    );
  };
}
