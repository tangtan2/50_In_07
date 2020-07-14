import { Pool } from "pg";
const nhlAPI = require("./index").default;

exports = (pool: Pool) => {
  nhlAPI.getRosterByTeamIDAndSeasonID();
};
