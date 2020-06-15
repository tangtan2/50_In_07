var request = require('request');
var config = require('../config/base_config');

var getTeams = function getTeams(cb) {
    var url = config.baseURL + 'teams';
    request(url, function(error, response, body) {
        cb(error, response, body);
    });
}

var getDivisions = function getTeams(cb) {
    var url = config.baseURL + 'divisions';
    request(url, function(error, response, body) {
        cb(error, response, body);
    });
}

var getConferences = function getTeams(cb) {
    var url = config.baseURL + 'conferences';
    request(url, function(error, response, body) {
        cb(error, response, body);
    });
}

var nhlAPIObject = {
    'getTeams': getTeams,
    'getDivisions': getDivisions,
    'getConferences': getConferences
}

module.exports = nhlAPIObject;