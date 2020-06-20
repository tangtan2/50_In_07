var request = require("request");
var config = require("../config/BaseConfig");

var getTeams = (cb) => {
  var url = config.baseURL + "teams";
  request(url, (error, response, body) => {
    cb(error, response, body);
  });
};

var getCoaches = (cb) => {
  var url = config.baseURL + "teams";
  request(url, (error, response, body) => {
    cb(error, response, body);
  });
};

var nhlAPIObject = {
  getTeams: getTeams,
  getCoaches: getCoaches,
};

module.exports = nhlAPIObject;
