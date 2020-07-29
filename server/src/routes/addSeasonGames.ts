import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const getSeasonsWithoutGames = async (pool: Pool): Promise<Array<string>> => {
  return pool
    .query(
      `SELECT season_id 
         FROM seasons 
        WHERE season_id NOT IN 
              (SELECT DISTINCT season_id 
                          FROM games)`
    )
    .then((queryRes) => {
      console.log("Success, got all seasons without games in database");
      return queryRes.rows;
    })
    .catch((queryErr) => {
      console.log(queryErr);
      return undefined;
    });
};

const addSeasonGameDB = (data: JSON, pool: Pool) => {
  pool
    .query(
      `INSERT INTO games (game_id, season_id, category_id, date_time, 
                   away_time_id, home_team_id)
            VALUES (${data["gamePk"]}, 
                    '${data["season"]}'::text, 
                    '${data["gameType"]}'::text, 
                    '${data["gameDate"]}'::timestamp, 
                    ${data["teams"]["away"]["team"]["id"]}, 
                    ${data["teams"]["home"]["team"]["id"]})`
    )
    .then((_) => {
      console.log(
        "Success, added games basic information to seasons without games to database"
      );
    })
    .catch((queryErr) => {
      console.log(queryErr);
    });
};

const addSeasonGamesFromNHLAPI = (seasonID: string, pool: Pool) => {
  nhlAPIObject
    .getGamesBySeasonID({ seasonID: seasonID })
    .then((allGameJSONs) => {
      allGameJSONs["dates"].map((dateJSON: JSON) => {
        dateJSON["games"].map((gameJSON: JSON) => {
          addSeasonGameDB(gameJSON, pool);
        });
      });
    });
};

export default (pool: Pool) => {
  return (_: express.Request, res: express.Response) => {
    getSeasonsWithoutGames(pool)
      .then((seasons) => {
        seasons.map((seasonID) => {
          addSeasonGamesFromNHLAPI(seasonID, pool);
        });
      })
      .then(() => res.send("Games for seasons without games added"))
      .catch((err) => {
        console.log(err);
      });
  };
};
