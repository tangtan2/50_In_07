import express from "express";
import bodyParser from "body-parser";
import config from "./config/baseConfig";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.send();
  console.log("Server started...");
});

app.use("/externalAPI", require("./routes/router").default);

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server listening on port " + config.port);
  }
});
