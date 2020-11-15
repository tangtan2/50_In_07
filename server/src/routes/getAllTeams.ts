import { Pool } from "pg";

const getAllTeams = async (
  pool: Pool
): Promise<{ teams: JSON; roster: JSON }[]> => {
  const { rows: teamsData } = await pool.query<{ teams: JSON; roster: JSON }>(
    `WITH players_per_team AS 
          (SELECT players.current_team_id AS team_id
                , json_agg(row_to_json(players.*)) AS roster_data
             FROM players
            WHERE players.active = true
            GROUP BY team_id)
   SELECT row_to_json
          (SELECT all_rows 
             FROM (SELECT teams.*
                        , conferences.name
                        , divisions.name) AS all_rows) AS teams
        , players_per_team.roster_data AS roster
     FROM teams
     LEFT JOIN conferences ON teams.conference_id = conferences.id
     LEFT JOIN divisions ON teams.division_id = divisions.id
     LEFT JOIN players_per_team ON teams.id = players_per_team.team_id
    WHERE teams.active = true`
  );
  return teamsData;
};

export default getAllTeams;
