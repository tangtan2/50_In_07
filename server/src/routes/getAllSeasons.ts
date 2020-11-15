import { Pool } from "pg";

const getAllSeasons = async (pool: Pool): Promise<{ seasons: JSON }[]> => {
  const { rows: seasonsData } = await pool.query<{
    seasons: JSON;
  }>(
    `SELECT row_to_json(seasons.*) AS seasons
       FROM seasons`
  );
  return seasonsData;
};

export default getAllSeasons;
