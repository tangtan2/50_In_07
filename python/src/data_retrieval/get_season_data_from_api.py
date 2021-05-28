import requests
from connect_to_db import create_connection, close_and_commit_connection, execute_sql
from config import get_config

if __name__ == "__main__":
    config = get_config()
    season_data = requests.get(config["api_url"] + "/seasons")
    if season_data.status_code == 200:
        season_data = season_data.json()
        connection = create_connection()
        for season in season_data['seasons']:
            if int(season['seasonId'][0:4]) >= 2012:
                execute_sql(connection,
                            "INSERT INTO seasons"
                            f"    VALUES ('{season['seasonId']}'"
                            f"         , '{season['regularSeasonStartDate']}'"
                            f"         , '{season['regularSeasonEndDate']}'"
                            f"         , '{season['seasonEndDate']}'"
                            f"         , {season['numberOfGames']}"
                            f"         , {season['tiesInUse']}"
                            f"         , {season['olympicsParticipation']}"
                            f"         , {season['conferencesInUse']}"
                            f"         , {season['divisionsInUse']}"
                            f"         , {season['wildCardInUse']})")
        close_and_commit_connection(connection)
