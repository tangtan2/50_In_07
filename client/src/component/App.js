import React from 'react';

class App extends React.Component {

    constructor(prop) {
        super(prop);
        this.state = {
            teamData: [],
            divisionData: [],
            conferenceData: []
        };
    }

    callAPITeams() {
        fetch('http://localhost:9000/api/teams')
            .then(res => res.json())
            .then(data => {
                let teamData = data.teams.map((team) => {
                    return (
                        <div key={team.id}>
                            <p>{team.teamName}</p>
                        </div>
                    )
                })
                this.setState({teamData: teamData});
            })
            .catch(console.log);
    }

    callAPIDivions() {
        fetch('http://localhost:9000/api/divisions')
            .then(res => res.json())
            .then(res => this.setState({divisionData: res.divisions}))
            .catch(console.log);
    }

    callAPIConferences() {
        fetch('http://localhost:9000/api/conferences')
            .then(res => res.json())
            .then(res => this.setState({conferenceData: res.conferences}))
            .catch(console.log);
    }

    handleClickTeams = () => {
        this.callAPITeams();
    }
    
    render() {
        return (
            <div className='app'>
                <header className='app-header'>
                    <h1 className='app-title'>NHL Information</h1>
                </header>
                <div>
                    <button onClick={this.handleClickTeams}>Click to Get Teams</button>
                </div>
                <div>
                    {this.state.teamData}
                </div>
                <div>
                    <button>Click to Get Divisions</button>
                </div>
                <div>
                    <button>Click to Get Conferences</button>
                </div>
            </div>
        )
    }

}

export default App;