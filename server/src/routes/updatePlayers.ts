import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const getActivePlayers = async (pool: Pool): Promise<Array<any>> => {
  return pool
    .query(
      `SELECT * 
       FROM players 
      WHERE active = True`
    )
    .then((queryRes) => {
      console.log("Success!");
      return queryRes.rows;
    })
    .catch((queryErr) => {
      console.log(queryErr);
      return undefined;
    });
};

const updateDBPlayer = (data: JSON, pool: Pool) => {
  pool
    .query(
      `UPDATE players
          SET ()`
    )
    .then((queryRes) => {
      console.log("Success!");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

export default (pool: Pool) => {
  return (_: express.Request, res: express.Response) => {
    nhlAPIObject.getTeams().then((json) => {
      res.send(json);
    });
  };
};
