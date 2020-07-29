import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

const addGameResultsDB = (data: JSON, pool: Pool) => {};

const addGameGoalieResultsDB = (data: JSON, pool: Pool) => {};

const addGamePlayerResultsDB = (data: JSON, pool: Pool) => {};

const addGameTeamResultsDB = (data: JSON, pool: Pool) => {};

const addGamePlaysDB = (data: JSON, pool: Pool) => {};

const addGamePlayPlayersDB = (data: JSON, pool: Pool) => {};

const addGameResultsFromNHLAPI = async (
  gameID: number,
  pool: Pool
): Promise<any> => {
  nhlAPIObject
    .getFeedByGameID({ gameID: gameID })
    .then((gameFeedJSON) => {})
    .catch((err) => console.log(err));
};

export default (pool: Pool) => {
  return (req: express.Request, res: express.Response) => {
    addGameResultsFromNHLAPI(parseInt(req.params["gameID"]), pool).then(() =>
      res.send(`Results for game ${req.params["gameID"]} updated`)
    );
  };
};
