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
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["people"];
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
                            captain = ${playerJSON["captain"]}::boolean, 
                            alternate_captain = ${playerJSON["alternateCaptain"]}::boolean, 
                            active = '${playerJSON["active"]}'::boolean 
                      WHERE player_id = ${playerID}`,
                      (error1, results1) => {
                        if (error) {
                          console.log(error1["detail"]);
                        }
                      }
                    );
                  });
                } catch {
                  console.log("Player " + playerID + " not updated.");
                }
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
                                            date_time, away_team_id, 
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
                            console.log(error1["detail"]);
                          }
                        }
                      );
                    });
                  });
                } catch {
                  console.log(seasonID + " not updated.");
                }
              }
            }, row["season_id"]);
          });
        }
      }
    );
    res.send("Games updated per season.");
  });

  api.get("/update_inactive_players_per_team_per_season", (req, res) => {
    pool.query(
      `SELECT a.team_id, b.season_id
         FROM teams AS a
   CROSS JOIN seasons AS b`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getInactivePlayersPerTeamPerSeason(
              (err, response, data, teamID, seasonID) => {
                if (!err) {
                  try {
                    dataJSON = JSON.parse(data);
                    dataJSON = dataJSON["teams"][0]["roster"]["roster"];
                    dataJSON.map((playerJSON) => {
                      pool.query(
                        `INSERT INTO players (player_id, name, primary_position, active)
                              VALUES (${playerJSON["person"]["id"]}::integer, 
                                      $$${playerJSON["person"]["fullName"]}$$::text, 
                                      '${playerJSON["position"]["abbreviation"]}'::text, 
                                      'False')`,
                        (error1, results1) => {
                          if (error1) {
                            console.log(error1["detail"]);
                          }
                        }
                      );
                    });
                  } catch {
                    console.log(
                      "Players in season " +
                        seasonID +
                        " for team " +
                        teamID +
                        " not updated."
                    );
                  }
                }
              },
              row["team_id"],
              row["season_id"]
            );
          });
        }
      }
    );
    res.send("Inactive players updated per team per season.");
  });

  api.get("/update_player_stats_single_season", (req, res) => {
    pool.query(
      `SELECT a.player_id, b.season_id 
         FROM players AS a 
   CROSS JOIN seasons AS b 
        WHERE (b.season_id = '19841988' 
           OR b.season_id = '19831984' 
           OR b.season_id = '19821983' 
           OR b.season_id = '19811982') 
          AND a.primary_position != 'G'`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getPlayerStatsSingleSeason(
              (err, response, data, playerID, seasonID) => {
                if (!err) {
                  try {
                    dataJSON = JSON.parse(data);
                    dataJSON = dataJSON["stats"][0]["splits"][0];
                    pool.query(
                      `INSERT INTO player_stats_single_season (season_id, player_id, 
                                   assists, goals, shots, games, penalty_minutes, 
                                   power_play_goals, power_play_points, short_goals, 
                                   short_points, game_winning_goals, 
                                   overtime_goals, plus_minus, points) 
                            VALUES ('${dataJSON["season"]}'::text, 
                                    ${playerID}::integer,
                                    ${dataJSON["stat"]["assists"]}::integer, 
                                    ${dataJSON["stat"]["goals"]}::integer, 
                                    ${dataJSON["stat"]["shots"]}::integer, 
                                    ${dataJSON["stat"]["games"]}::integer, 
                                    ${dataJSON["stat"]["penaltyMinutes"]}::integer, 
                                    ${dataJSON["stat"]["powerPlayGoals"]}::integer, 
                                    ${dataJSON["stat"]["powerPlayPoints"]}::integer, 
                                    ${dataJSON["stat"]["shortHandedGoals"]}::integer, 
                                    ${dataJSON["stat"]["shortHandedPoints"]}::integer, 
                                    ${dataJSON["stat"]["gameWinningGoals"]}::integer, 
                                    ${dataJSON["stat"]["overTimeGoals"]}::integer, 
                                    ${dataJSON["stat"]["plusMinus"]}::integer, 
                                    ${dataJSON["stat"]["points"]}::integer)`,
                      (error1, results1) => {
                        if (error1) {
                          console.log(error1);
                          console.log(playerID);
                        }
                      }
                    );
                  } catch {
                    console.log(
                      "Player " +
                        playerID +
                        " not updated for season " +
                        seasonID +
                        "."
                    );
                  }
                }
              },
              row["player_id"],
              row["season_id"]
            );
          });
        }
      }
    );
    res.send("Player stats updated (single season).");
  });

  api.get("/update_goalie_stats_single_season", (req, res) => {
    pool.query(
      `SELECT a.player_id, b.season_id
         FROM players AS a
   CROSS JOIN seasons AS b
        WHERE (b.season_id = '20182019' 
           OR b.season_id = '20172018') 
          AND a.primary_position = 'G'`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getPlayerStatsSingleSeason(
              (err, response, data, playerID, seasonID) => {
                if (!err) {
                  try {
                    dataJSON = JSON.parse(data);
                    dataJSON = dataJSON["stats"][0]["splits"][0];
                    pool.query(
                      `INSERT INTO goalie_stats_single_season (season_id, player_id, 
                                   overtime, shutouts, wins, losses, saves, 
                                   power_play_saves, power_play_shots, short_saves, short_shots, 
                                   even_saves, even_shots, save_percentage, goals_against_average, 
                                   games, games_started, shots_against, goals_against, time_on_ice) 
                            VALUES ('${dataJSON["season"]}'::text, 
                                    ${playerID}::integer,
                                    ${dataJSON["stat"]["ot"]}::integer, 
                                    ${dataJSON["stat"]["shutouts"]}::integer, 
                                    ${dataJSON["stat"]["wins"]}::integer, 
                                    ${dataJSON["stat"]["losses"]}::integer, 
                                    ${dataJSON["stat"]["saves"]}::integer, 
                                    ${dataJSON["stat"]["powerPlaySaves"]}::integer, 
                                    ${dataJSON["stat"]["powerPlayShots"]}::integer, 
                                    ${dataJSON["stat"]["shortHandedSaves"]}::integer, 
                                    ${dataJSON["stat"]["shortHandedShots"]}, 
                                    ${dataJSON["stat"]["evenSaves"]}::integer, 
                                    ${dataJSON["stat"]["evenShots"]}::integer, 
                                    ${dataJSON["stat"]["savePercentage"]}::double precision, 
                                    ${dataJSON["stat"]["goalAgainstAverage"]}::double precision, 
                                    ${dataJSON["stat"]["games"]}::integer, 
                                    ${dataJSON["stat"]["gamesStarted"]}::integer, 
                                    ${dataJSON["stat"]["shotsAgainst"]}::integer, 
                                    ${dataJSON["stat"]["goalsAgainst"]}::integer, 
                                    '${dataJSON["stat"]["timeOnIce"]}'::interval minute)`,
                      (error1, results1) => {
                        if (error1) {
                          console.log(error1);
                        }
                      }
                    );
                  } catch {
                    console.log(
                      "Player " +
                        playerID +
                        " not updated for season " +
                        seasonID +
                        "."
                    );
                  }
                }
              },
              row["player_id"],
              row["season_id"]
            );
          });
        }
      }
    );
    res.send("Goalie stats updated (single season).");
  });

  api.get("/update_team_stats_single_season", (req, res) => {
    pool.query(
      `SELECT a.team_id, b.season_id
         FROM teams AS a
   CROSS JOIN seasons AS b`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getTeamStatsSingleSeason(
              (err, response, data, teamID, seasonID) => {
                if (!err) {
                  try {
                    dataJSON = JSON.parse(data);
                    dataJSON = dataJSON["stats"][0]["splits"][0];
                    pool.query(
                      `INSERT INTO team_stats_single_season (season_id, team_id, 
                                   games_played, wins, losses, overtime, points, 
                                   point_percentage, goals_per_game, goals_against_per_game, 
                                   ev_gga_ratio, power_play_percentage, power_play_goals, 
                                   power_play_goals_against, power_play_opportunities, 
                                   penalty_kill_percentage, shots_per_game, shots_allowed, 
                                   win_score_first, win_opp_score_first, win_lead_first_per, 
                                   win_lead_second_per, win_outshoot_opp, win_outshot_by_opp, 
                                   faceoffs_won, faceoffs_lost, faceoffs_taken, 
                                   shooting_percentage, save_percentage) 
                            VALUES ('${seasonID}'::text, 
                                    ${dataJSON["team"]["id"]}::integer, 
                                    ${dataJSON["stat"]["gamesPlayed"]}::integer, 
                                    ${dataJSON["stat"]["wins"]}::integer, 
                                    ${dataJSON["stat"]["losses"]}::integer, 
                                    ${dataJSON["stat"]["ot"]}::integer, 
                                    ${dataJSON["stat"]["pts"]}::integer, 
                                    ${dataJSON["stat"]["ptPctg"]}, 
                                    ${dataJSON["stat"]["goalsPerGame"]}, 
                                    ${dataJSON["stat"]["goalsAgainstPerGame"]}, 
                                    ${dataJSON["stat"]["evGGARatio"]}, 
                                    ${dataJSON["stat"]["powerPlayPercentage"]}, 
                                    ${dataJSON["stat"]["powerPlayGoals"]}::integer, 
                                    ${dataJSON["stat"]["powerPlayGoalsAgainst"]}::integer, 
                                    ${dataJSON["stat"]["powerPlayOpportunities"]}::integer, 
                                    ${dataJSON["stat"]["penaltyKillPercentage"]}, 
                                    ${dataJSON["stat"]["shotsPerGame"]}, 
                                    ${dataJSON["stat"]["shotsAllowed"]}, 
                                    ${dataJSON["stat"]["winScoreFirst"]}, 
                                    ${dataJSON["stat"]["winOppScoreFirst"]}, 
                                    ${dataJSON["stat"]["winLeadFirstPer"]}, 
                                    ${dataJSON["stat"]["winLeadSecondPer"]}, 
                                    ${dataJSON["stat"]["winOutshootOpp"]}, 
                                    ${dataJSON["stat"]["winOutshotByOpp"]}, 
                                    ${dataJSON["stat"]["faceOffsWon"]}::integer, 
                                    ${dataJSON["stat"]["faceOffsLost"]}::integer, 
                                    ${dataJSON["stat"]["faceOffsTaken"]}::integer, 
                                    ${dataJSON["stat"]["shootingPctg"]}, 
                                    ${dataJSON["stat"]["savePctg"]})`,
                      (error1, results1) => {
                        if (error1) {
                          console.log(error1["detail"]);
                          console.log(teamID);
                          console.log(seasonID);
                        }
                      }
                    );
                  } catch (err) {
                    console.log(
                      "Team " + teamID + " not updated for season " + seasonID
                    );
                  }
                }
              },
              row["team_id"],
              row["season_id"]
            );
          });
        }
      }
    );
    res.send("Team stats updated (single season).");
  });

  api.get("/update_games_aux", (req, res) => {
    pool.query(
      `SELECT game_id 
         FROM games 
        WHERE settled_in_period_ordinal IS NULL`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getGames((err, response, data, gameID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  pool.query(
                    `UPDATE games 
                        SET settled_in_period_ordinal = '${dataJSON["currentPeriodOrdinal"]}'::text 
                      WHERE game_id = ${gameID}`,
                    (error1, results1) => {
                      if (error1) {
                        console.log(error1);
                        console.log(gameID);
                      } else {
                        console.log("Game " + gameID + " updated");
                      }
                    }
                  );
                } catch (err) {
                  console.log(err);
                  console.log("Game " + gameID + " not updated.");
                }
              }
            }, row["game_id"]);
          });
        }
      }
    );
    res.send("Game auxiliary information updated.");
  });

  return api;
};
