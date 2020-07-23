import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

export default (pool: Pool) => {
  return function (req: express.Request, res: express.Response) {
    nhlAPIObject.getTeams().then((json) => {
      res.send(json);
    });
  };
};
