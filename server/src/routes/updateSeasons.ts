import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const getMostRecentSeason = async (pool: Pool): Promise<string> => {
  return pool
    .query(
      `SELECT season_id 
         FROM seasons 
     ORDER BY regular_season_start_date DESC 
        LIMIT 1`
    )
    .then((queryRes) => {
      console.log("Success, got most recent season from database");
      return queryRes.rows[0];
    })
    .catch((queryErr) => {
      console.log(queryErr);
      return undefined;
    });
};

const addSeasonDB = (data: JSON, pool: Pool) => {
  pool
    .query(
      `INSERT INTO seasons ()
            VALUES ()`
    )
    .then((_) => {
      console.log("Success, added new season to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const updateSeasonFromNHLAPI = (seasonID: string, pool: Pool) => {
  nhlAPIObject.getSeasons().then((allSeasonJSONs) => {
    allSeasonJSONs["seasons"].reduceRight((_: JSON, seasonJSON: JSON) => {
      if (seasonJSON["seasonID"] > seasonID) {
        addSeasonDB(seasonJSON, pool);
      }
    });
  });
};

export default (pool: Pool) => {
  return function (_: express.Request, res: express.Response) {
    getMostRecentSeason(pool)
      .then((seasonID) => {
        updateSeasonFromNHLAPI(seasonID, pool);
      })
      .then(() => res.send("New seasons added"))
      .catch((err) => {
        console.log(err);
      });
  };
};
