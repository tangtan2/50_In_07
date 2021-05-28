import requests
from connect_to_db import create_connection, close_and_commit_connection, execute_sql
from config import get_config

if __name__ == "__main__":
    config = get_config()
    conference_data = requests.get(config["api_url"] + "/conferences")
    if conference_data.status_code == 200:
        conference_data = conference_data.json()
        connection = create_connection()
        for conference in conference_data['conferences']:
            execute_sql(connection,
                        "INSERT INTO conferences"
                        f"    VALUES ({conference['id']}"
                        f"         , '{conference['name']}'"
                        f"         , '{conference['abbreviation']}'"
                        f"         , {conference['active']})")
        close_and_commit_connection(connection)
