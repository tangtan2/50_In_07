import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const addGameResultsDB = (data: JSON, pool: Pool) => {
  const winner_id = data["teams"]["away"]["team"]["id"]
    ? data["teams"]["away"]["goals"] > data["teams"]["home"]["goals"]
    : data["teams"]["home"]["team"]["id"];
  pool
    .query(
      `UPDATE games
          SET away_goals = ${data["teams"]["away"]["goals"]}, 
              home_goals = ${data["teams"]["home"]["goals"]}, 
              home_rink_side_start = '${data["periods"][0]["home"]["rinkSide"]}'::text, 
              settled_in_period_id = ${data["currentPeriod"]}, 
              settled_in_period_ordinal = '${data["currentPeriodOrdinal"]}'::text, 
              winning_team_id = ${winner_id}`
    )
    .then(() => {
      console.log("Success, added game results to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addGameGoalieStatsDB = (
  gameID: number,
  teamID: number,
  data: JSON,
  pool: Pool
) => {
  pool
    .query(
      `INSERT INTO goalies_per_game (game_id, player_id, team_id, assists, goals, 
                   penalty_minutes, saves, power_play_saves, even_saves, 
                   short_saves, shots_against, power_play_shots_against, 
                   even_shots_against, short_shots_against, time_on_ice)
            VALUES (${gameID}, 
                    ${data["person"]["id"]}, 
                    ${teamID}, 
                    ${data["stats"]["goalieStats"]["assists"]}, 
                    ${data["stats"]["goalieStats"]["goals"]}, 
                    ${data["stats"]["goalieStats"]["pim"]}, 
                    ${data["stats"]["goalieStats"]["saves"]}, 
                    ${data["stats"]["goalieStats"]["powerPlaySaves"]}, 
                    ${data["stats"]["goalieStats"]["evenSaves"]}, 
                    ${data["stats"]["goalieStats"]["shortHandedSaves"]}, 
                    ${data["stats"]["goalieStats"]["shots"]}, 
                    ${data["stats"]["goalieStats"]["powerPlayShotsAgainst"]}, 
                    ${data["stats"]["goalieStats"]["evenShotsAgainst"]}, 
                    ${data["stats"]["goalieStats"]["shortHandedShotsAgainst"]}, 
                    '${data["stats"]["goalieStats"]["timeOnIce"]}'::interval minutes)`
    )
    .then(() => {
      console.log("Success, added game goalie stats to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addGamePlayerStatsDB = (
  gameID: number,
  teamID: number,
  data: JSON,
  pool: Pool
) => {
  pool
    .query(
      `INSERT INTO players_per_game (game_id, player_id, team_id, time_on_ice, 
                   assists, goals, shots, hits, power_play_assists, power_play_goals, 
                   short_assists, short_goals, penalty_minutes, faceoffs_won, 
                   faceoffs_taken, takeaways, giveaways, blocked, plus_minus, 
                   power_play_time_on_ice, even_time_on_ice, short_time_on_ice)
            VALUES (${gameID}, 
                    ${data["person"]["id"]}, 
                    ${teamID}, 
                    '${data["stats"]["skaterStats"]["timeOnIce"]}'::interval minutes, 
                    ${data["stats"]["skaterStats"]["assists"]}, 
                    ${data["stats"]["skaterStats"]["goals"]}, 
                    ${data["stats"]["skaterStats"]["shots"]}, 
                    ${data["stats"]["skaterStats"]["hits"]}, 
                    ${data["stats"]["skaterStats"]["powerPlayAssists"]}, 
                    ${data["stats"]["skaterStats"]["powerPlayGoals"]}, 
                    ${data["stats"]["skaterStats"]["shortHandedAssists"]}, 
                    ${data["stats"]["skaterStats"]["shortHandedGoals"]}, 
                    ${data["stats"]["skaterStats"]["penaltyMinutes"]}, 
                    ${data["stats"]["skaterStats"]["faceOffWins"]}, 
                    ${data["stats"]["skaterStats"]["faceoffTaken"]}, 
                    ${data["stats"]["skaterStats"]["takeaways"]}, 
                    ${data["stats"]["skaterStats"]["giveaways"]}, 
                    ${data["stats"]["skaterStats"]["blocked"]}, 
                    ${data["stats"]["skaterStats"]["plusMinus"]}, 
                    '${data["stats"]["skaterStats"]["powerPlayTimeOnIce"]}'::interval minutes, 
                    '${data["stats"]["skaterStats"]["evenTimeOnIce"]}'::interval minutes, 
                    '${data["stats"]["skaterStats"]["shortHandedTimeOnIce"]}'::interval minutes)`
    )
    .then(() => {
      console.log("Success, added game player stats to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addGameTeamStatsDB = (
  gameID: number,
  homeOrAway: string,
  won: boolean,
  goaliePulled: boolean,
  data: JSON,
  pool: Pool
) => {
  pool
    .query(
      `INSERT INTO teams_per_game (game_id, team_id, home_or_away, won, goals, 
                   shots, hits, penalty_minutes, power_play_opportunities, 
                   power_play_goals, faceoff_win_percentage, takeaways, giveaways, 
                   goalie_pulled) 
            VALUES (${gameID}, 
                    ${data["team"]["id"]}, 
                    '${homeOrAway}'::text, 
                    ${won}, 
                    ${data["teamStats"]["teamSkaterStats"]["goals"]}, 
                    ${data["teamStats"]["teamSkaterStats"]["shots"]}, 
                    ${data["teamStats"]["teamSkaterStats"]["hits"]}, 
                    ${data["teamStats"]["teamSkaterStats"]["pim"]}, 
                    ${data["teamStats"]["teamSkaterStats"]["powerPlayOpportunities"]}, 
                    ${data["teamStats"]["teamSkaterStats"]["powerPlayGoals"]}, 
                    ${data["teamStats"]["teamSkaterStats"]["faceOffWinPercentage"]}, 
                    ${data["teamStats"]["teamSkaterStats"]["takeaways"]}, 
                    ${data["teamStats"]["teamSkaterStats"]["giveaways"]}, 
                    ${goaliePulled})`
    )
    .then(() => {
      console.log("Success, added game team stats to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addGamePlayDB = (
  gameID: number,
  teamIDAgainst: number,
  homeTeamID: number,
  awayTeamID: number,
  data: JSON,
  pool: Pool
) => {
  pool
    .query(
      `INSERT INTO plays (play_id, game_id, play_num, team_id_for, team_id_against, 
                   event_id, x, y, period_ordinal, period_id, period_time, 
                   period_time_remaining, date_time, goals_aways, goals_home, 
                   home_team_id, away_team_id) 
            VALUES ('${gameID}_${data["about"]["eventIdx"]}'::text, 
                    ${gameID}, 
                    ${data["about"]["eventIdx"]}, 
                    ${data["team"]["id"]}, 
                    ${teamIDAgainst}, 
                    '${data["result"]["eventTypeID"]}'::text, 
                    ${data["coordinates"]["x"]}, 
                    ${data["coordinates"]["y"]}, 
                    '${data["about"]["ordinalNum"]}'::text, 
                    ${data["about"]["period"]}, 
                    '${data["about"]["periodTime"]}'::interval minutes, 
                    '${data["about"]["periodTimeRemaining"]}'::interval minutes, 
                    '${data["about"]["dateTime"]}'::timestamp, 
                    ${data["about"]["goals"]["away"]}, 
                    ${data["about"]["goals"]["home"]}, 
                    ${homeTeamID}, 
                    ${awayTeamID})`
    )
    .then(() => {
      console.log("Success, added game play to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addGameGoalAuxInfoDB = (data: JSON, pool: Pool) => {
  pool
    .query(
      `UPDATE plays 
          SET secondary_type = '${data["secondaryType"]}'::text, 
              strength = '${data["strength"]["code"]}'::text, 
              empty_net = ${data["emptyNet"]}, 
              game_winning_goal = ${data["gameWinningGoal"]}`
    )
    .then(() => {
      console.log(
        "Success, added auxiliary information for goal play to database"
      );
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addGameShotOrPenaltyAuxInfoDB = (secondaryType: string, pool: Pool) => {
  pool
    .query(
      `UPDATE plays 
          SET secondary_type = '${secondaryType}'::text`
    )
    .then(() => {
      console.log(
        "Success, added auxiliary information for shot or penalty play to database"
      );
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addGamePlayPlayerDB = (
  playID: string,
  gameID: number,
  data: JSON,
  pool: Pool
) => {
  pool
    .query(
      `INSERT INTO players_per_play (play_id, player_id, player_type, game_id) 
            VALUES (${playID}, 
                    ${data["player"]["id"]}, 
                    '${data["playerType"]}'::text, 
                    ${gameID})`
    )
    .then(() => {
      console.log("Success, added game play player to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addGameResultsFromNHLAPI = async (
  gameID: number,
  pool: Pool
): Promise<any> => {
  nhlAPIObject
    .getFeedByGameID({ gameID: gameID })
    .then((gameFeedJSON) => {
      // call functions
    })
    .catch((err) => console.log(err));
};

export default (pool: Pool) => {
  return (req: express.Request, res: express.Response) => {
    addGameResultsFromNHLAPI(parseInt(req.params["gameID"]), pool).then(() =>
      res.send(`Results for game ${req.params["gameID"]} updated`)
    );
  };
};
