import requests
from connect_to_db import create_connection, close_and_commit_connection, execute_sql
from config import get_config

if __name__ == "__main__":
    config = get_config()
    team_data = requests.get(config["api_url"] + "/teams")
    if team_data.status_code == 200:
        team_data = team_data.json()
        connection = create_connection()
        for team in team_data['teams']:
            execute_sql(connection,
                        "INSERT INTO teams"
                        f"    VALUES ({team['id']}"
                        f"         , '{team['name']}'"
                        f"         , '{team['abbreviation']}'"
                        f"         , '{team['locationName']}'"
                        f"         , '{team['firstYearOfPlay']}'"
                        f"         , {team['division']['id']}"
                        f"         , {team['conference']['id']}"
                        f"         , {team['active']})")
        close_and_commit_connection(connection)
