import express from "express";
import { Pool } from "pg";
import { nhlAPIObject } from "./index";

export default (pool: Pool) => {
  return function (_: express.Request, res: express.Response) {
    nhlAPIObject.getSeasons().then((json) => {
      res.send(json);
    });
  };
};
