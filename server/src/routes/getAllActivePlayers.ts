import { Pool } from "pg";

const getAllActivePlayers = async (
  pool: Pool
): Promise<
  {
    players: Player;
    teamName: string;
    teamAbbreviation: string;
  }[]
> => {
  const { rows: playersData } = await pool.query<{
    players: Player;
    teamName: string;
    teamAbbreviation: string;
  }>(
    `SELECT row_to_json(players.*) AS players
          , teams.name AS teamName
          , teams.abbreviation AS teamAbbreviation
       FROM players
       LEFT JOIN teams on players.current_team_id = teams.id
      WHERE players.active = true`
  );
  return playersData;
};

export default getAllActivePlayers;
