import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const addPlayerDB = (data: JSON, pool: Pool) => {
  const feet = data["people"][0]["height"].substring(0, 1);
  const inches = data["people"][0]["height"].substring(
    data["people"][0]["height"].search(" ") + 1,
    data["people"][0]["height"].search('"')
  );
  const height = (feet * 0.3048 + inches * 0.0254).toFixed(4);
  const weight = (data["people"][0]["weight"] * 0.453592).toFixed(4);
  pool
    .query(
      `INSERT INTO players (player_id, name, nationality, primary_position, 
                   birth_date, current_team_id, height, weight, rookie, captain, 
                   alternate_captain, shoot_catch, jersey_number, active)
            VALUES (${data["people"][0]["id"]}, 
                    '${data["people"][0]["fullName"]}'::text, 
                    '${data["people"][0]["nationality"]}'::text, 
                    '${data["people"][0]["primaryPosition"]["abbreviation"]}'::text, 
                    '${data["people"][0]["birthDate"]}'::date, 
                    ${data["people"][0]["currentTeam"]["id"]}, 
                    ${height}, 
                    ${weight}, 
                    ${data["people"][0]["rookie"]}, 
                    ${data["people"][0]["captsin"]}, 
                    ${data["people"][0]["alternateCaptain"]}, 
                    '${data["people"][0]["shootsCatches"]}'::text, 
                    ${data["people"][0]["primaryNumber"]}, 
                    ${data["people"][0]["active"]})`
    )
    .then(() => {
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
