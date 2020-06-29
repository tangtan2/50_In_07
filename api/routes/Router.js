const util = require("./ExternalAPI");
const pgPool = require("pg").Pool;
const pool = new pgPool({
  user: "tanyatang",
  host: "localhost",
  database: "50_in_07",
  password: "",
  port: 5432,
});

module.exports = (app, express) => {
  var api = express.Router();

  api.get("/", (req, res) => {
    res.send("Access NHL API data.");
    console.log("API calls root page");
  });

  api.get("/update_teams", (req, res) => {
    util.getTeams((err, response, data) => {
      if (!err) {
        dataJSON = JSON.parse(data);
        dataJSON = dataJSON["teams"];
        message = "Teams updated.";
        dataJSON.map((teamJSON) => {
          pool.query(
            `INSERT INTO teams (team_id, team_name, team_abbv, 
                                active, year_established, 
                                current_conference_id, current_division_id) 
                  VALUES (${teamJSON["id"]}::integer, 
                          '${teamJSON["name"]}'::text, 
                          '${teamJSON["abbreviation"]}'::text, 
                          ${teamJSON["active"]}::bool, 
                          ${teamJSON["firstYearOfPlay"]}::integer, 
                          ${teamJSON["conference"]["id"]}::integer, 
                          ${teamJSON["division"]["id"]}::integer)`,
            (error, results) => {
              if (error) {
                console.log(error["detail"]);
              } else {
                console.log(results.rows);
              }
            }
          );
        });
      }
      res.send("Teams updated.");
    });
  });

  api.get("/update_players_per_team", (req, res) => {
    pool.query(
      `SELECT team_id 
         FROM teams`,
      (error, result) => {
        if (!error) {
          result.rows.map((row) =>
            util.getPlayersPerTeam((err, response, data, teamID) => {
              if (!err) {
                dataJSON = JSON.parse(data);
                dataJSON = dataJSON["roster"];
                message = "Players updated for team " + teamID;
                dataJSON.forEach((playerJSON) => {
                  pool.query(
                    `INSERT INTO players (player_id, name, jersey_number, primary_position)
                          VALUES (${playerJSON["person"]["id"]}::integer,
                                 '${playerJSON["person"]["fullName"]}'::text, 
                                 ${playerJSON["jerseyNumber"]}::integer, 
                                 '${playerJSON["position"]["abbreviation"]}'::text)`,
                    (error, results) => {
                      if (error) {
                        console.log(error["detail"]);
                      } else {
                        console.log(message);
                      }
                    }
                  );
                });
              }
            }, row["team_id"])
          );
        }
      }
    );
    res.send("Players updated per team");
  });

  api.get("/update_players", (req, res) => {
    pool.query(
      `SELECT player_id 
         FROM players`,
      (error, result) => {
        if (!error) {
          result.rows.map((row) =>
            util.getPlayer((err, response, data, playerID) => {
              if (!err) {
                dataJSON = JSON.parse(data);
                dataJSON = dataJSON["people"];
                message = "Player " + playerID + " updated";
                dataJSON.forEach((playerJSON) => {
                  feet = playerJSON["height"].substring(0, 1);
                  inches = playerJSON["height"].substring(
                    playerJSON["height"].search(" ") + 1,
                    playerJSON["height"].search('"')
                  );
                  height = feet * 0.3048 + inches * 0.0254;
                  height = height.toFixed(4);
                  weight = playerJSON["weight"] * 0.453592;
                  weight = weight.toFixed(4);
                  pool.query(
                    `UPDATE players 
                        SET nationality = '${playerJSON["birthCountry"]}'::text, 
                            birth_date = '${playerJSON["birthDate"]}'::date, 
                            current_team_id = ${playerJSON["currentTeam"]["id"]}::integer, 
                            height = ${height}, 
                            weight = ${weight}, 
                            rookie = ${playerJSON["rookie"]}::boolean, 
                            captain = ${playerJSON["captain"]}::boolean, 
                            alternate_captain = ${playerJSON["alternateCaptain"]}::boolean, 
                            shoot_catch = '${playerJSON["shootsCatches"]}' 
                      WHERE player_id = ${playerID}`,
                    (error1, results1) => {
                      if (error) {
                        console.log(error1["detail"]);
                      }
                    }
                  );
                });
              }
            }, row["player_id"])
          );
        }
      }
    );
    res.send("Players updated.");
  });

  api.get("/update_seasons", (req, res) => {
    util.getSeasons((err, response, data) => {
      if (!err) {
        dataJSON = JSON.parse(data);
        dataJSON = dataJSON["seasons"];
        dataJSON.map((seasonJSON) => {
          if (parseInt(seasonJSON["seasonId"]) > 19801981) {
            pool.query(
              `INSERT INTO seasons (season_id, regular_season_start_date, 
                                  regular_season_end_date, season_end_date, 
                                  num_games)
                  VALUES (${seasonJSON["seasonId"]}::text, 
                          '${seasonJSON["regularSeasonStartDate"]}'::date, 
                          '${seasonJSON["regularSeasonEndDate"]}'::date, 
                          '${seasonJSON["seasonEndDate"]}'::date, 
                          ${seasonJSON["numberOfGames"]}::integer)`,
              (error, results) => {
                if (error) {
                  console.log(error["detail"]);
                }
              }
            );
          }
        });
      }
    });
    res.send("Seasons updated.");
  });

  api.get("/update_season_winners", (req, res) => {
    pool.query(
      `SELECT season_id
         FROM seasons`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getSeasonWinner((err, response, data, seasonID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["rounds"].slice(-1)[0];
                  dataJSON = dataJSON["series"][0]["matchupTeams"];
                  winner = null;
                  if (
                    dataJSON[0]["seriesRecord"]["wins"] >
                    dataJSON[0]["seriesRecord"]["losses"]
                  ) {
                    winner = dataJSON[0]["team"]["id"];
                  } else {
                    winner = dataJSON[1]["team"]["id"];
                  }
                  pool.query(
                    `UPDATE seasons 
                        SET winning_team_id = ${winner} 
                      WHERE season_id = '${seasonID}'`,
                    (error1, results1) => {
                      if (error1) {
                        console.log(error1["detail"]);
                      }
                    }
                  );
                } catch {
                  console.log(seasonID + " not updated.");
                }
              }
            }, row["season_id"]);
          });
        }
      }
    );
    res.send("Season winners updated.");
  });

  api.get("/update_games_per_season", (req, res) => {
    pool.query(
      `SELECT season_id 
         FROM seasons`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getGamesPerSeason((err, response, data, seasonID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["dates"];
                  dataJSON.map((dateJSON) => {
                    dateJSON = dateJSON["games"];
                    dateJSON.map((gameJSON) => {
                      pool.query(
                        `INSERT INTO games (game_id, season_id, category_id, 
                                            date_time_GMT, away_team_id, 
                                            home_team_id, away_goals, home_goals) 
                              VALUES (${gameJSON["gamePk"]}::integer, 
                                      '${gameJSON["season"]}'::text, 
                                      '${gameJSON["gameType"]}'::text, 
                                      '${gameJSON["gameDate"]}'::timestamp, 
                                      ${gameJSON["teams"]["away"]["team"]["id"]}, 
                                      ${gameJSON["teams"]["home"]["team"]["id"]}, 
                                      ${gameJSON["teams"]["away"]["score"]}, 
                                      ${gameJSON["teams"]["home"]["score"]})`,
                        (error1, results1) => {
                          if (error1) {
                            console.log(error["detail"]);
                          }
                        }
                      );
                    });
                  });
                } catch {
                  console.log(seasonID + " not updated");
                }
              }
            }, row["season_id"]);
          });
        }
      }
    );
    res.send("Games updated per season.");
  });

  return api;
};
