import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const addPlayerStatsDB = (data: JSON, pool: Pool) => {
  pool
    .query(
      `INSERT INTO player_stats_single_season (season_id, player_id, time_on_ice, 
                   assists, goals, shots, hits, games, penalty_minutes, 
                   power_play_goals, power_play_points, power_play_time_on_ice, 
                   even_time_on_ice, short_goals, short_points, short_time_on_ice, 
                   faceoff_win_percentage, game_winning_goals, overtime_goals, 
                   blocked, plus_minus, points, shifts)
            VALUES ()`
    )
    .then((_) => {
      console.log("Success, added player stats for given season to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addPlayerStatsFromNHLAPI = async (
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
      addPlayerStatsDB(statsJSON, pool);
    });
};

export default (pool: Pool) => {
  return (req: express.Request, res: express.Response) => {
    addPlayerStatsFromNHLAPI(
      parseInt(req.params["playerID"]),
      req.params["seasonID"],
      pool
    ).then(() =>
      res.send(
        `Player ${req.params["playerID"]} stats updated for season ${req.params["seasonID"]}`
      )
    );
  };
};
