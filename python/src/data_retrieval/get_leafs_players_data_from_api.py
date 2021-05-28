import requests
from connect_to_db import create_connection, close_and_commit_connection, execute_sql
from config import get_config

if __name__ == "__main__":
    config = get_config()
    roster_data = requests.get(config["api_url"] + "/teams/10/roster")
    if roster_data.status_code == 200:
        roster_data = roster_data.json()
        connection = create_connection()
        for player in roster_data["roster"]:
            player_data = requests.get(config["api_url"] + f"/people/{player['person']['id']}")
            if player_data.status_code == 200:
                player_data = player_data.json()["people"][0]
                execute_sql(connection,
                            "INSERT INTO players"
                            f"    VALUES ({player_data['id']}"
                            f"         , '{player_data['firstName']}'"
                            f"         , '{player_data['lastName']}'"
                            f"         , {player_data['primaryNumber']}"
                            f"         , '{player_data['birthDate']}'"
                            f"         , {player_data['currentAge']}"
                            f"         , '{player_data['nationality']}'"
                            f"         , '{player_data['height'][0] + '-' + player_data['height'][2:-1]}'"
                            f"         , {player_data['weight']}"
                            f"         , {player_data['currentTeam']['id']}"
                            f"         , {player_data['alternateCaptain']}"
                            f"         , {player_data['captain']}"
                            f"         , {player_data['rookie']}"
                            f"         , '{player_data['shootsCatches']}'"
                            f"         , '{player_data['primaryPosition']['name']}'"
                            f"         , {player_data['active']})")
        close_and_commit_connection(connection)
