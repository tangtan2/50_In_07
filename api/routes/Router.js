const util = require("./ExternalAPI");
const pgPool = require("pg").Pool;
const pool = new pgPool({
  user: "tanyatang",
  host: "localhost",
  database: "50_in_07",
  password: "",
  port: 5432,
});

module.exports = (app, express) => {
  var api = express.Router();

  api.get("/", (req, res) => {
    res.send("Access NHL API data.");
    console.log("API calls root page");
  });

  api.get("/update_teams", (req, res) => {
    util.getTeams((err, response, data) => {
      if (!err) {
        dataJSON = JSON.parse(data);
        dataJSON = dataJSON["teams"];
        message = "Teams updated.";
        dataJSON.forEach((teamJSON) => {
          pool.query(
            `INSERT INTO teams (team_id, team_name, team_abbv, 
                                active, year_established, 
                                current_conference_id, current_division_id) 
                  VALUES (${teamJSON["id"]}::integer, '${teamJSON["name"]}'::text, 
                          '${teamJSON["abbreviation"]}'::text, ${teamJSON["active"]}::bool, 
                          ${teamJSON["firstYearOfPlay"]}::integer, 
                          ${teamJSON["conference"]["id"]}::integer, 
                          ${teamJSON["division"]["id"]}::integer)`,
            (error, results) => {
              if (error) {
                console.log(error["detail"]);
              } else {
                console.log(results.rows);
              }
            }
          );
        });
        res.send(dataJSON);
      } else {
        res.send("NHL API could not be reached.");
      }
    });
  });

  api.get("/update_coaches", (req, res) => {
    util.getCoaches((err, response, date) => {
      if (!err) {
        res.send();
      } else {
        res.send("NHL API could not be reached.");
      }
    });
  });

  return api;
};
