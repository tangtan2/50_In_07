import React from "react";

class App extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      teamData: [],
      divisionData: [],
      conferenceData: [],
    };
  }

  callAPITeams() {
    fetch("http://localhost:9000/api/update_teams")
      .then((res) => res.json())
      .then((data) => {
        let teamData = data.map((team) => {
          return (
            <div key={team.id}>
              <p>
                Team ID: {team.id}
                <br></br>
                Team Name: {team.name}
              </p>
            </div>
          );
        });
        this.setState({ teamData: teamData });
      })
      .catch(console.log);
  }

  handleClickTeams = () => {
    this.callAPITeams();
  };

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">NHL Information</h1>
        </header>
        <div>
          <button onClick={this.handleClickTeams}>Click to Update Teams</button>
        </div>
        <div>{this.state.teamData}</div>
      </div>
    );
  }
}

export default App;
