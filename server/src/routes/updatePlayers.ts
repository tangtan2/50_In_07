import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const getActivePlayers = async (pool: Pool): Promise<Array<number>> => {
  return pool
    .query(
      `SELECT player_id 
         FROM players 
        WHERE active = True`
    )
    .then((queryRes) => {
      console.log("Success, got all active players from database");
      return queryRes.rows;
    })
    .catch((queryErr) => {
      console.log(queryErr);
      return undefined;
    });
};

const updatePlayerDB = (data: JSON, pool: Pool) => {
  pool
    .query(
      `UPDATE players 
          SET active = ${data["people"][0]["active"]}, 
              alternateCaptain = ${data["people"][0]["alternateCaptain"]}, 
              captain = ${data["people"][0]["captain"]}, 
              rookie = ${data["people"][0]["rookie"]}, 
              current_team_id = ${data["currentTeam"][0]["id"]}`
    )
    .then((_) => {
      console.log("Success, updated existing player in database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const updatePlayerFromNHLAPI = (playerID: number, pool: Pool) => {
  nhlAPIObject.getPlayerByID({ playerID: playerID }).then((playerJSON) => {
    updatePlayerDB(playerJSON, pool);
  });
};

export default (pool: Pool) => {
  return (_: express.Request, res: express.Response) => {
    getActivePlayers(pool)
      .then((playersFromDB) => {
        playersFromDB.map((playerRow) => {
          updatePlayerFromNHLAPI(playerRow["player_id"], pool);
        });
      })
      .then(() => res.send("Active players updated"))
      .catch((err) => {
        console.log(err);
      });
  };
};
