import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const addPlayerDB = (data: JSON, pool: Pool) => {
  pool
    .query(
      `INSERT INTO players (player_id, name, nationality, primary_position, 
                   birth_date, current_team_id, height, weight, rookie, captain, 
                   alternate_captain, shoot_catch, jersey_number, active)
            VALUES ()`
    )
    .then((_) => {
      console.log("Success, added new player to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addPlayerFromNHLAPI = async (
  playerID: number,
  pool: Pool
): Promise<any> => {
  nhlAPIObject.getPlayerByID({ playerID: playerID }).then((playerJSON) => {
    addPlayerDB(playerJSON, pool);
  });
};

export default (pool: Pool) => {
  return (req: express.Request, res: express.Response) => {
    addPlayerFromNHLAPI(parseInt(req.params["playerID"]), pool).then(() =>
      res.send(`New player ${req.params["playerID"]} added.`)
    );
  };
};
