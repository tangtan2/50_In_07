var request = require("request");
var config = require("../config/BaseConfig");

var getTeams = (cb) => {
  var url = config.baseURL + "teams";
  request(url, (error, response, body) => {
    cb(error, response, body);
  });
};

var getPlayersPerTeam = (cb, teamID) => {
  var url = config.baseURL + "teams/" + teamID + "/roster";
  request(url, (error, response, body) => {
    cb(error, response, body, teamID);
  });
};

var getPlayer = (cb, playerID) => {
  var url = config.baseURL + "people/" + playerID;
  request(url, (error, response, body) => {
    cb(error, response, body, playerID);
  });
};

var getSeasons = (cb) => {
  var url = config.baseURL + "seasons";
  request(url, (error, response, body) => {
    cb(error, response, body);
  });
};

var getSeasonWinner = (cb, seasonID) => {
  var url =
    config.baseURL +
    "tournaments/playoffs?expand=round.series,schedule.game.seriesSummary&season=" +
    seasonID;
  request(url, (error, response, body) => {
    cb(error, response, body, seasonID);
  });
};

var nhlAPIObject = {
  getTeams: getTeams,
  getPlayersPerTeam: getPlayersPerTeam,
  getPlayer: getPlayer,
  getSeasons: getSeasons,
  getSeasonWinner: getSeasonWinner,
};

module.exports = nhlAPIObject;
