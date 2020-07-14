const util = require("../external/routes").default;
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
         FROM seasons 
        WHERE season_id = '20102011`,
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
            util.getGameLinescore((err, response, data, gameID) => {
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

  api.get("/update_plays_per_game", (req, res) => {
    pool.query(
      `SELECT game_id 
         FROM games 
        WHERE season_id = '20192020' 
          AND (   game_id::text LIKE '201902%' 
               OR game_id::text LIKE '201903%') 
          AND game_id NOT IN (SELECT DISTINCT game_id 
                                         FROM plays)`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getGameFeed((err, response, data, gameID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["liveData"]["plays"]["allPlays"];
                  dataJSON.map((playJSON) => {
                    if (
                      playJSON["result"]["eventTypeId"] == "PENALTY" ||
                      playJSON["result"]["eventTypeId"] == "SHOT"
                    ) {
                      pool.query(
                        `INSERT INTO plays (play_id, game_id, play_num, event_id, x, y, 
                                     period_ordinal, period_id, period_time, secondary_type, 
                                     period_time_remaining, date_time, goals_away, 
                                     goals_home)
                              VALUES ('${gameID}_${playJSON["about"]["eventIdx"]}'::text, 
                                      ${gameID}, 
                                      ${playJSON["about"]["eventIdx"]}, 
                                      '${playJSON["result"]["eventTypeId"]}'::text, 
                                      ${playJSON["coordinates"]["x"]}, 
                                      ${playJSON["coordinates"]["y"]}, 
                                      '${playJSON["about"]["ordinalNum"]}'::text, 
                                      ${playJSON["about"]["period"]}, 
                                      '${playJSON["about"]["periodTime"]}'::interval minute, 
                                      $$${playJSON["result"]["secondaryType"]}$$::text, 
                                      '${playJSON["about"]["periodTimeRemaining"]}'::interval minute, 
                                      '${playJSON["about"]["dateTime"]}'::timestamp, 
                                      ${playJSON["about"]["goals"]["away"]}, 
                                      ${playJSON["about"]["goals"]["home"]})`,
                        (error1, results1) => {
                          if (error1) {
                            console.log(error1["detail"]);
                            console.log(gameID);
                          }
                        }
                      );
                    } else if (playJSON["result"]["eventTypeId"] === "GOAL") {
                      pool.query(
                        `INSERT INTO plays (play_id, game_id, play_num, event_id, x, y, 
                                     period_ordinal, period_id, period_time, secondary_type, 
                                     period_time_remaining, date_time, goals_away, 
                                     goals_home, strength, empty_net, game_winning_goal)
                              VALUES ('${gameID}_${playJSON["about"]["eventIdx"]}'::text, 
                                      ${gameID}, 
                                      ${playJSON["about"]["eventIdx"]}, 
                                      '${playJSON["result"]["eventTypeId"]}'::text, 
                                      ${playJSON["coordinates"]["x"]}, 
                                      ${playJSON["coordinates"]["y"]}, 
                                      '${playJSON["about"]["ordinalNum"]}'::text, 
                                      ${playJSON["about"]["period"]}, 
                                      '${playJSON["about"]["periodTime"]}'::interval minute, 
                                      '${playJSON["result"]["secondaryType"]}'::text, 
                                      '${playJSON["about"]["periodTimeRemaining"]}'::interval minute, 
                                      '${playJSON["about"]["dateTime"]}'::timestamp, 
                                      ${playJSON["about"]["goals"]["away"]}, 
                                      ${playJSON["about"]["goals"]["home"]}, 
                                      '${playJSON["result"]["strength"]["code"]}'::text, 
                                      ${playJSON["result"]["emptyNet"]}::boolean, 
                                      ${playJSON["result"]["gameWinningGoal"]}::boolean)`,
                        (error1, results1) => {
                          if (error1) {
                            console.log(error1["detail"]);
                            console.log(gameID);
                          }
                        }
                      );
                    } else {
                      pool.query(
                        `INSERT INTO plays (play_id, game_id, play_num, event_id, x, y, 
                                     period_ordinal, period_id, period_time, 
                                     period_time_remaining, date_time, goals_away, 
                                     goals_home, team_id_for)
                              VALUES ('${gameID}_${playJSON["about"]["eventIdx"]}'::text, 
                                      ${gameID}, 
                                      ${playJSON["about"]["eventIdx"]}, 
                                      '${playJSON["result"]["eventTypeId"]}'::text, 
                                      ${playJSON["coordinates"]["x"]}, 
                                      ${playJSON["coordinates"]["y"]}, 
                                      '${playJSON["about"]["ordinalNum"]}'::text, 
                                      ${playJSON["about"]["period"]}, 
                                      '${playJSON["about"]["periodTime"]}'::interval minute, 
                                      '${playJSON["about"]["periodTimeRemaining"]}'::interval minute, 
                                      '${playJSON["about"]["dateTime"]}'::timestamp, 
                                      ${playJSON["about"]["goals"]["away"]}, 
                                      ${playJSON["about"]["goals"]["home"]}, 
                                      ${playJSON["team"]["id"]})`,
                        (error1, results1) => {
                          if (error1) {
                            console.log(error1["detail"]);
                            console.log(gameID);
                          }
                        }
                      );
                    }
                  });
                } catch (err) {
                  console.log(err);
                  console.log("Game " + gameID + " plays not updated.");
                }
              }
            }, row["game_id"]);
          });
        }
      }
    );
    res.send("Plays per game updated.");
  });

  api.get("/update_play_teams", (req, res) => {
    pool.query(
      `SELECT DISTINCT game_id 
                  FROM plays 
                  WHERE game_id < 2020000000 
                    AND game_id > 2019000000 
                    AND game_id::text NOT LIKE '____01%' 
                    AND team_id_for IS NULL`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getGameFeed((err, response, data, gameID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["liveData"]["plays"]["allPlays"];
                  dataJSON.map((playJSON) => {
                    if (playJSON["team"] != undefined) {
                      pool.query(
                        `UPDATE plays 
                            SET team_id_for = ${playJSON["team"]["id"]} 
                          WHERE play_id = '${gameID}_${playJSON["about"]["eventIdx"]}'::text`,
                        (error1, results) => {
                          if (error1) {
                            console.log(error1["detail"]);
                          } else {
                            console.log(
                              "Play team for game " + gameID + " updated."
                            );
                          }
                        }
                      );
                    }
                  });
                } catch (err) {
                  console.log(err);
                  console.log("Play for game " + gameID + " not updated.");
                }
              }
            }, row["game_id"]);
          });
        }
      }
    );
    res.send("Play teams updated.");
  });

  api.get("/update_play_players", (req, res) => {
    pool.query(
      `SELECT game_id 
         FROM games 
        WHERE season_id = '20192020' 
          AND game_id::text NOT LIKE '201901%' 
          AND game_id NOT IN (SELECT DISTINCT game_id 
                                         FROM players_per_play)`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getGameFeed((err, response, data, gameID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["liveData"]["plays"]["allPlays"];
                  dataJSON.map((playJSON) => {
                    if (playJSON["players"] != undefined) {
                      playJSON["players"].map((playerJSON) => {
                        pool.query(
                          `INSERT INTO players_per_play (play_id, player_id, player_type, game_id)
                              VALUES ('${gameID}_${playJSON["about"]["eventIdx"]}'::text, 
                                      ${playerJSON["player"]["id"]}, 
                                      '${playerJSON["playerType"]}'::text, 
                                      ${gameID})`,
                          (error1, results1) => {
                            if (error1) {
                              console.log(error1["detail"]);
                            }
                          }
                        );
                      });
                    }
                  });
                } catch (err) {
                  console.log(err);
                  console.log("Game " + gameID + " plays not updated.");
                }
              }
            }, row["game_id"]);
          });
        }
      }
    );
    res.send("Players per play updated.");
  });

  api.get("/update_game_players", (req, res) => {
    pool.query(
      `SELECT game_id 
         FROM games 
        WHERE season_id = '20192020' 
          AND game_id::text LIKE '____02%'`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getGameBoxscore((err, response, data, gameID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["teams"];
                  var teamID = dataJSON["away"]["team"]["id"];
                  for (var playerID in dataJSON["away"]["players"]) {
                    if (
                      dataJSON["away"]["players"][playerID]["position"][
                        "code"
                      ] != "G"
                    ) {
                      if (
                        dataJSON["away"]["players"][playerID]["stats"][
                          "skaterStats"
                        ] != undefined
                      ) {
                        pool.query(
                          `INSERT INTO players_per_game (game_id, player_id, team_id, 
                                       time_on_ice, assists, goals, shots, hits, 
                                       power_play_assists, power_play_goals, short_assists, 
                                       short_goals, penalty_minutes, faceoffs_won, faceoffs_taken, 
                                       takeaways, giveaways, blocked, plus_minus, power_play_time_on_ice, 
                                       even_time_on_ice, short_time_on_ice)
                                VALUES (${gameID}, 
                                        ${dataJSON["away"]["players"][playerID]["person"]["id"]}::integer, 
                                        ${teamID}, 
                                        '${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["timeOnIce"]}'::interval minute, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["assists"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["goals"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["shots"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["hits"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["powerPlayAssists"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["powerPlayGoals"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["shortHandedAssists"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["shortHandedGoals"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["penaltyMinutes"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["faceOffWins"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["faceoffTaken"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["takeaways"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["giveaways"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["blocked"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["plusMinus"]}, 
                                        '${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["powerPlayTimeOnIce"]}'::interval minute, 
                                        '${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["evenTimeOnIce"]}'::interval minute, 
                                        '${dataJSON["away"]["players"][playerID]["stats"]["skaterStats"]["shortHandedTimeOnIce"]}'::interval minute)`,
                          (error1, results1) => {
                            if (error1) {
                              console.log(error1["detail"]);
                            } else {
                              console.log("Player updated for game " + gameID);
                            }
                          }
                        );
                      }
                    }
                  }
                  var teamID = dataJSON["home"]["team"]["id"];
                  for (var playerID in dataJSON["home"]["players"]) {
                    if (
                      dataJSON["home"]["players"][playerID]["position"][
                        "code"
                      ] != "G"
                    ) {
                      if (
                        dataJSON["home"]["players"][playerID]["stats"][
                          "skaterStats"
                        ] != undefined
                      ) {
                        pool.query(
                          `INSERT INTO players_per_game (game_id, player_id, team_id, 
                                       time_on_ice, assists, goals, shots, hits, 
                                       power_play_assists, power_play_goals, short_assists, 
                                       short_goals, penalty_minutes, faceoffs_won, faceoffs_taken, 
                                       takeaways, giveaways, blocked, plus_minus, power_play_time_on_ice, 
                                       even_time_on_ice, short_time_on_ice) 
                                VALUES (${gameID}, 
                                        ${dataJSON["home"]["players"][playerID]["person"]["id"]}, 
                                        ${teamID}, 
                                        '${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["timeOnIce"]}'::interval minute, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["assists"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["goals"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["shots"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["hits"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["powerPlayAssists"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["powerPlayGoals"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["shortHandedAssists"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["shortHandedGoals"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["penaltyMinutes"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["faceOffWins"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["faceoffTaken"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["takeaways"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["giveaways"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["blocked"]}, 
                                        ${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["plusMinus"]}, 
                                        '${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["powerPlayTimeOnIce"]}'::interval minute, 
                                        '${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["evenTimeOnIce"]}'::interval minute, 
                                        '${dataJSON["home"]["players"][playerID]["stats"]["skaterStats"]["shortHandedTimeOnIce"]}'::interval minute)`,
                          (error1, results1) => {
                            if (error1) {
                              console.log(error1["detail"]);
                            } else {
                              console.log("Player updated for game " + gameID);
                            }
                          }
                        );
                      }
                    }
                  }
                } catch (err) {
                  console.log(err);
                  console.log("Game " + gameID + " players not updated.");
                }
              }
            }, row["game_id"]);
          });
        }
      }
    );
    res.send("Players per game updated.");
  });

  api.get("/update_game_goalies", (req, res) => {
    pool.query(
      `SELECT game_id 
         FROM games 
        WHERE season_id = '20192020' 
          AND game_id::text NOT LIKE '____01%' 
          AND game_id::text NOT LIKE '____04%'`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getGameBoxscore((err, response, data, gameID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["teams"];
                  var teamID = dataJSON["away"]["team"]["id"];
                  for (var playerID in dataJSON["away"]["players"]) {
                    if (
                      dataJSON["away"]["players"][playerID]["position"][
                        "code"
                      ] == "G"
                    ) {
                      if (
                        dataJSON["away"]["players"][playerID]["stats"][
                          "goalieStats"
                        ] != undefined
                      ) {
                        pool.query(
                          `INSERT INTO goalies_per_game (game_id, player_id, team_id, 
                                       time_on_ice, assists, goals, penalty_minutes, saves, 
                                       power_play_saves, even_saves, short_saves, shots_against, 
                                       power_play_shots_against, even_shots_against, 
                                       short_shots_against) 
                                VALUES (${gameID}, 
                                        ${dataJSON["away"]["players"][playerID]["person"]["id"]}, 
                                        ${teamID}, 
                                        '${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["timeOnIce"]}'::interval minute, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["assists"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["goals"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["pim"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["saves"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["powerPlaySaves"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["evenSaves"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["shortHandedSaves"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["shots"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["powerPlayShotsAgainst"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["evenShotsAgainst"]}, 
                                        ${dataJSON["away"]["players"][playerID]["stats"]["goalieStats"]["shortHandedShotsAgainst"]})`,
                          (error1, results1) => {
                            if (error1) {
                              console.log(error1["detail"]);
                            } else {
                              console.log(
                                "Goalie for game " + gameID + " updated"
                              );
                            }
                          }
                        );
                      }
                    }
                  }
                  var teamID = dataJSON["home"]["team"]["id"];
                  for (var playerID in dataJSON["home"]["players"]) {
                    if (
                      dataJSON["home"]["players"][playerID]["position"][
                        "code"
                      ] == "G"
                    ) {
                      if (
                        dataJSON["home"]["players"][playerID]["stats"][
                          "goalieStats"
                        ] != undefined
                      ) {
                        pool.query(
                          `INSERT INTO goalies_per_game (game_id, player_id, team_id,
                                       time_on_ice, assists, goals, penalty_minutes, saves,
                                       power_play_saves, even_saves, short_saves, shots_against,
                                       power_play_shots_against, even_shots_against,
                                       short_shots_against)
                                VALUES (${gameID},
                                        ${dataJSON["home"]["players"][playerID]["person"]["id"]},
                                        ${teamID},
                                        '${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["timeOnIce"]}'::interval minute,
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["assists"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["goals"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["pim"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["saves"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["powerPlaySaves"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["evenSaves"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["shortHandedSaves"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["shots"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["powerPlayShotsAgainst"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["evenShotsAgainst"]},
                                        ${dataJSON["home"]["players"][playerID]["stats"]["goalieStats"]["shortHandedShotsAgainst"]})`,
                          (error1, results1) => {
                            if (error1) {
                              console.log(error1["detail"]);
                            } else {
                              console.log(
                                "Goalie for game " + gameID + " updated"
                              );
                            }
                          }
                        );
                      }
                    }
                  }
                } catch (err) {
                  console.log(err);
                  console.log("Goalies for game " + gameID + " not updated");
                }
              }
            }, row["game_id"]);
          });
        }
      }
    );
    res.send("Goalies per game updated.");
  });

  api.get("/update_game_teams", (req, res) => {
    pool.query(
      `SELECT game_id 
         FROM games 
        WHERE season_id = '20192020' 
          AND game_id::text NOT LIKE '____01%' 
          AND game_id::text NOT LIKE '____04%' 
          AND game_id NOT IN (SELECT DISTINCT game_id 
                                         FROM teams_per_game)`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getGameBoxscore((err, response, data, gameID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["teams"];
                  pool.query(
                    `INSERT INTO teams_per_game (game_id, team_id, home_or_away, 
                                   goals, shots, hits, penalty_minutes, 
                                   power_play_opportunities, power_play_goals, 
                                   faceoff_win_percentage, takeaways, giveaways)
                            VALUES (${gameID}, 
                                    ${dataJSON["home"]["team"]["id"]}, 
                                    'H', 
                                    ${dataJSON["home"]["teamStats"]["teamSkaterStats"]["goals"]}, 
                                    ${dataJSON["home"]["teamStats"]["teamSkaterStats"]["shots"]}, 
                                    ${dataJSON["home"]["teamStats"]["teamSkaterStats"]["hits"]}, 
                                    ${dataJSON["home"]["teamStats"]["teamSkaterStats"]["pim"]}, 
                                    ${dataJSON["home"]["teamStats"]["teamSkaterStats"]["powerPlayOpportunities"]}::integer, 
                                    ${dataJSON["home"]["teamStats"]["teamSkaterStats"]["powerPlayGoals"]}::integer, 
                                    ${dataJSON["home"]["teamStats"]["teamSkaterStats"]["faceOffWinPercentage"]}::double precision, 
                                    ${dataJSON["home"]["teamStats"]["teamSkaterStats"]["takeaways"]}, 
                                    ${dataJSON["home"]["teamStats"]["teamSkaterStats"]["giveaways"]})`,
                    (error1, results1) => {
                      if (error1) {
                        console.log(error1["detail"]);
                      } else {
                        console.log("Team for game " + gameID + " updated");
                      }
                    }
                  );
                  pool.query(
                    `INSERT INTO teams_per_game (game_id, team_id, home_or_away, 
                                   goals, shots, hits, penalty_minutes, 
                                   power_play_opportunities, power_play_goals, 
                                   faceoff_win_percentage, takeaways, giveaways)
                            VALUES (${gameID}, 
                                    ${dataJSON["away"]["team"]["id"]}, 
                                    'A', 
                                    ${dataJSON["away"]["teamStats"]["teamSkaterStats"]["goals"]}, 
                                    ${dataJSON["away"]["teamStats"]["teamSkaterStats"]["shots"]}, 
                                    ${dataJSON["away"]["teamStats"]["teamSkaterStats"]["hits"]}, 
                                    ${dataJSON["away"]["teamStats"]["teamSkaterStats"]["pim"]}, 
                                    ${dataJSON["away"]["teamStats"]["teamSkaterStats"]["powerPlayOpportunities"]}::integer, 
                                    ${dataJSON["away"]["teamStats"]["teamSkaterStats"]["powerPlayGoals"]}::integer, 
                                    ${dataJSON["away"]["teamStats"]["teamSkaterStats"]["faceOffWinPercentage"]}::double precision, 
                                    ${dataJSON["away"]["teamStats"]["teamSkaterStats"]["takeaways"]}, 
                                    ${dataJSON["away"]["teamStats"]["teamSkaterStats"]["giveaways"]})`,
                    (error1, results1) => {
                      if (error1) {
                        console.log(error1["detail"]);
                      } else {
                        console.log("Team for game " + gameID + " updated");
                      }
                    }
                  );
                } catch (err) {
                  console.log(err);
                  console.log("Game " + gameID + " teams not updated.");
                }
              }
            }, row["game_id"]);
          });
        }
      }
    );
    res.send("Teams per game updated.");
  });

  api.get("/update_new_players", (req, res) => {
    pool.query(
      `SELECT player_id 
         FROM players 
        WHERE name IS NULL`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getPlayer((err, response, data, playerID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["people"][0];
                  feet = dataJSON["height"].substring(0, 1);
                  inches = dataJSON["height"].substring(
                    dataJSON["height"].search(" ") + 1,
                    dataJSON["height"].search('"')
                  );
                  height = feet * 0.3048 + inches * 0.0254;
                  height = height.toFixed(4);
                  weight = dataJSON["weight"] * 0.453592;
                  weight = weight.toFixed(4);
                  pool.query(
                    `UPDATE players 
                        SET name = $$${dataJSON["fullName"]}$$::text, 
                            nationality = '${dataJSON["nationality"]}'::text, 
                            primary_position = '${dataJSON["primaryPosition"]["abbreviation"]}'::text, 
                            birth_date = '${dataJSON["birthDate"]}'::date, 
                            height = ${height}::double precision, 
                            weight = ${weight}::double precision, 
                            rookie = ${dataJSON["rookie"]}::boolean, 
                            shoot_catch = '${dataJSON["shootsCatches"]}'::text, 
                            active = ${dataJSON["active"]}::boolean 
                      WHERE player_id = ${playerID}`,
                    (error1, results1) => {
                      if (error1) {
                        console.log(error1);
                        console.log(playerID);
                      } else {
                        console.log("Player " + playerID + " updated");
                      }
                    }
                  );
                } catch (err) {
                  console.log(err);
                  console.log("Player " + playerID + " not updated.");
                }
              }
            }, row["player_id"]);
          });
        }
      }
    );
    res.send("New players updated.");
  });

  api.get("/update_goalie_pulled", (req, res) => {
    pool.query(
      `SELECT game_id 
         FROM teams_per_game
        WHERE goalie_pulled IS NULL`,
      (error, results) => {
        if (!error) {
          results.rows.map((row) => {
            util.getGameLinescore((err, response, data, gameID) => {
              if (!err) {
                try {
                  dataJSON = JSON.parse(data);
                  dataJSON = dataJSON["teams"];
                  pool.query(
                    `UPDATE teams_per_game 
                        SET goalie_pulled = ${dataJSON["home"]["goaliePulled"]}::boolean 
                      WHERE team_id = ${dataJSON["home"]["team"]["id"]} 
                        AND game_id = ${gameID}`,
                    (error1, results1) => {
                      if (error1) {
                        console.log(error1);
                      } else {
                        console.log("Game " + gameID + " updated");
                      }
                    }
                  );
                  pool.query(
                    `UPDATE teams_per_game 
                        SET goalie_pulled = ${dataJSON["away"]["goaliePulled"]}::boolean 
                      WHERE team_id = ${dataJSON["away"]["team"]["id"]} 
                        AND game_id = ${gameID}`,
                    (error1, results1) => {
                      if (error1) {
                        console.log(error1);
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
    res.send("Game goalie pulled updated.");
  });

  return api;
};
