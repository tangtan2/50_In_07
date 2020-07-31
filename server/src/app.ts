import express from "express";
import bodyParser from "body-parser";
import config from "./config/baseConfig";
import { router } from "./routes/router";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", (_, res) => {
  res.send();
  console.log("Server started...");
});

app.use("/externalAPI", router);

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server listening on port " + config.port);
  }
});
