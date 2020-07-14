import config from "../config/baseConfig";

const getTeams = (): Promise<JSON> =>
  fetch(config.baseURL + "teams/")
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));

const getRosterByTeamID = (params: { teamID: number }): Promise<JSON> =>
  fetch(config.baseURL + "teams/" + params.teamID + "/roster")
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));

const getPlayerByID = (params: { playerID: number }): Promise<JSON> =>
  fetch(config.baseURL + "people/" + params.playerID)
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));

const getSeasons = (): Promise<JSON> =>
  fetch(config.baseURL + "seasons")
    .then((response) => response.json())
    .catch((error) => console.log(error));

const getPlayoffGamesBySeasonID = (params: {
  seasonID: number;
}): Promise<JSON> =>
  fetch(
    config.baseURL +
      "tournaments/playoffs?expand=round.series,schedule.game.seriesSummary&season=" +
      params.seasonID
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));

const getGamesBySeasonID = (params: { seasonID: number }): Promise<JSON> =>
  fetch(config.baseURL + "schedule?season=" + params.seasonID)
    .then((response) => response.json())
    .catch((error) => console.log(error));

const getRosterByTeamIDAndSeasonID = (params: {
  teamID: number;
  seasonID: number;
}): Promise<JSON> =>
  fetch(
    config.baseURL +
      "teams/" +
      params.teamID +
      "?expand=team.roster&season=" +
      params.seasonID
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));

const getStatsSingleSeasonByPlayerIDAndSeasonID = (params: {
  playerID: number;
  seasonID: number;
}): Promise<JSON> =>
  fetch(
    config.baseURL +
      "people/" +
      params.playerID +
      "/stats?stats=statsSingleSeason&season=" +
      params.seasonID
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));

const getStatsSingleSeasonByTeamIDAndSeasonID = (params: {
  teamID: number;
  seasonID: number;
}): Promise<JSON> =>
  fetch(
    config.baseURL +
      "teams/" +
      params.teamID +
      "/stats?stats=statsSingleSeason&season=" +
      params.seasonID
  )
    .then((response) => response.json())
    .catch((error) => console.log(error));

const getFeedByGameID = (params: { gameID: number }): Promise<JSON> =>
  fetch(config.baseURL + "game/" + params.gameID + "/feed/live")
    .then((response) => response.json())
    .catch((error) => console.log(error));

const getBoxscoreByGameID = (params: { gameID: number }): Promise<JSON> =>
  fetch(config.baseURL + "game/" + params.gameID + "/boxscore")
    .then((response) => response.json())
    .catch((error) => console.log(error));

const getLinescoreByGameID = (params: { gameID: number }): Promise<JSON> =>
  fetch(config.baseURL + "game/" + params.gameID + "/linescore")
    .then((response) => response.json())
    .catch((error) => console.log(error));

const nhlAPIObject = {
  getTeams: getTeams,
  getRosterByTeamID: getRosterByTeamID,
  getPlayerByID: getPlayerByID,
  getSeasons: getSeasons,
  getPlayoffGamesBySeasonID: getPlayoffGamesBySeasonID,
  getGamesBySeasonID: getGamesBySeasonID,
  getRosterByTeamIDAndSeasonID: getRosterByTeamIDAndSeasonID,
  getStatsSingleSeasonByPlayerIDAndSeasonID: getStatsSingleSeasonByPlayerIDAndSeasonID,
  getStatsSingleSeasonByTeamIDAndSeasonID: getStatsSingleSeasonByTeamIDAndSeasonID,
  getLinescoreByGameID: getLinescoreByGameID,
  getFeedByGameID: getFeedByGameID,
  getBoxscoreByGameID: getBoxscoreByGameID,
};

export default nhlAPIObject;
