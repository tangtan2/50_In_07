import express from "express";
import bodyParser from "body-parser";
import config from "./config/baseConfig";
import { Pool } from "pg";

const pool: Pool = new Pool({
  user: "tanyatang",
  host: "localhost",
  database: "50_in_07",
  password: "",
  port: 5432,
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.send();
  console.log("Server started...");
});

app.use("/externalAPI", require("./routes/router")(pool));

app.listen(config.port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server listening on port " + config.port);
  }
});
