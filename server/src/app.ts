import express from "express";
import bodyParser from "body-parser";
import config from "./config/TestConfig";
import router from "./routes";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", (_, res) => {
  res.send();
  console.log("Server started...");
});

app.use("/externalAPI", router);

app.listen(config.apiport, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server listening on port " + config.apiport);
  }
});
