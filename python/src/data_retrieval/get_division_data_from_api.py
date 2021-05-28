import requests
from connect_to_db import create_connection, close_and_commit_connection, execute_sql
from config import get_config

if __name__ == "__main__":
    config = get_config()
    division_data = requests.get(config["api_url"] + "/divisions")
    if division_data.status_code == 200:
        division_data = division_data.json()
        connection = create_connection()
        for division in division_data['divisions']:
            execute_sql(connection,
                        "INSERT INTO divisions"
                        f"    VALUES ({division['id']}"
                        f"         , '{division['name']}'"
                        f"         , '{division['abbreviation']}'"
                        f"         , {division['active']})")
        close_and_commit_connection(connection)
