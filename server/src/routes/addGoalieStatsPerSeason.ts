import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const addGoalieStatsDB = (data: JSON, pool: Pool) => {
  pool
    .query(
      `INSERT INTO goalie_stats_single_season (season_id, player_id, overtime, 
                   shutouts, ties, wins, losses, saves, power_play_saves, 
                   power_play_shots, short_saves, short_shots, even_saves, 
                   even_shots, save_percentage, goals_against_average, 
                   games, games_started, shots_against, goals_against, time_on_ice)
            VALUES ()`
    )
    .then((_) => {
      console.log("Success, added goalie stats for given season to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addGoalieStatsFromNHLAPI = async (
  playerID: number,
  seasonID: string,
  pool: Pool
): Promise<any> => {
  nhlAPIObject
    .getStatsSingleSeasonByPlayerIDAndSeasonID({
      playerID: playerID,
      seasonID: seasonID,
    })
    .then((statsJSON) => {
      addGoalieStatsDB(statsJSON, pool);
    });
};

export default (pool: Pool) => {
  return (req: express.Request, res: express.Response) => {
    addGoalieStatsFromNHLAPI(
      parseInt(req.params["playerID"]),
      req.params["seasonID"],
      pool
    ).then(() =>
      res.send(
        `Goalie ${req.params["playerID"]} stats updated for season ${req.params["seasonID"]}`
      )
    );
  };
};
