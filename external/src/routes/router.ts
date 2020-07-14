import express from "express";
import { Pool } from "pg";

exports = (pool: Pool) => {
  const router = express.Router();
  router.get("/", (req, res) => {
    res.send("Access NHL API data.");
    console.log("Root page...");
  });
  router.get("/update_players", require("./updatePlayers")(pool));
};
