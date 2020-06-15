var util = require('./nhl_api');

module.exports = function(app, express) {

    var api = express.Router();

    api.get('/', function(req, res) {
        console.log('API calls root page');
        res.send();
    })

    api.get('/teams', function(req, res) {
        util.getTeams(function(err, response, data) {
            if (!err) {
                res.send(data);
            }
        });
    });

    api.get('/divisions', function(req, res) {
        util.getDivisions(function(err, response, data) {
            if (!err) {
                res.send(data);
            }
        });
    });

    api.get('/conferences', function(req, res) {
        util.getConferences(function(err, response, data) {
            if (!err) {
                res.send(data);
            }
        });
    });

    return api;

}
