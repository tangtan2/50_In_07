var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var cors = require("cors");
var config = require("./config/BaseConfig");

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.send();
  console.log("server started");
});

var api = require("./routes/Router")(app, express);
app.use("/api", api);

app.listen(config.port, function (err) {
  if (err) {
    console.log("error");
  } else {
    console.log("server listening on port " + config.port);
  }
});
