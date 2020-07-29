import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const getMostRecentSeason = async (pool: Pool): Promise<string> => {
  return pool
    .query(
      `SELECT season_id 
         FROM seasons 
     ORDER BY regular_season_start_date DESC .t
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
      `INSERT INTO seasons (season_id, regular_season_start_date, 
                   regular_season_end_date, season_end_date, num_games)
            VALUES ('${data["seasonID"]}'::text, 
                    '${data["regularSeasonStartDate"]}'::date, 
                    '${data["regularSeasonEndDate"]}'::date, 
                    '${data["seasonEndDate"]}'::date, 
                    ${data["numberOfGames"]})`
    )
    .then((_) => {
      console.log("Success, added new season to database");
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addSeasonFromNHLAPI = (seasonID: string, pool: Pool) => {
  nhlAPIObject.getSeasons().then((allSeasonJSONs) => {
    allSeasonJSONs["seasons"].reduceRight((_: JSON, seasonJSON: JSON) => {
      if (seasonJSON["seasonID"] > seasonID) {
        addSeasonDB(seasonJSON, pool);
      }
    });
  });
};

export default (pool: Pool) => {
  return (_: express.Request, res: express.Response) => {
    getMostRecentSeason(pool)
      .then((seasonID) => {
        addSeasonFromNHLAPI(seasonID, pool);
      })
      .then(() => res.send("New seasons added"))
      .catch((err) => {
        console.log(err);
      });
  };
};
