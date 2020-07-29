import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const addTeamStatsDB = (data: JSON, pool: Pool) => {
  pool
    .query(
      `INSERT INTO team_stats_single_season (season_id, team_id, games_played, 
                   wins, losses, overtime, points, point_percentage, goals_per_game, 
                   goals_against_per_game, ev_gga_ratio, power_play_percentage, 
                   power_play_goals, power_play_goal_against, power_play_opportunities, 
                   penalty_kill_percentage, shots_per_game, shots_allowed, 
                   win_score_first, win_opp_score_first, win_lead_first_per, 
                   win_lead_second_per, win_outshoot_opp, win_shot_by_opp, 
                   faceoffs_won, faceoffs_lost, faceoffs_taken, shooting_percentage, 
                   save_percentage)
            VALUES ()`
    )
    .then((_) => {
      console.log("Success, added team stats for given season to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addTeamStatsFromNHLAPI = async (
  teamID: number,
  seasonID: string,
  pool: Pool
): Promise<any> => {
  nhlAPIObject
    .getStatsSingleSeasonByTeamIDAndSeasonID({
      teamID: teamID,
      seasonID: seasonID,
    })
    .then((statsJSON) => {
      addTeamStatsDB(statsJSON, pool);
    });
};

export default (pool: Pool) => {
  return (req: express.Request, res: express.Response) => {
    addTeamStatsFromNHLAPI(
      parseInt(req.params["teamID"]),
      req.params["seasonID"],
      pool
    ).then(() =>
      res.send(
        `Team ${req.params["teamID"]} stats updated for season ${req.params["seasonID"]}`
      )
    );
  };
};
