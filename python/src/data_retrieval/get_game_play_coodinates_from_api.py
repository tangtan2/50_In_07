import requests
from connect_to_db import create_connection, close_and_commit_connection, execute_bulk_insert_sql, \
    execute_sql_with_return
from config import get_config

if __name__ == "__main__":
    config = get_config()
    connection = create_connection()
    existing_games = execute_sql_with_return(connection,
                                             "SELECT row_to_json(games.*)"
                                             "  FROM games")
    sql_bulk_insert_scripts = []
    for existing_game in existing_games:
        game_data = requests.get(config["api_url"] + f"/game/{existing_game[0]['id']}/feed/live")
        if game_data.status_code == 200:
            game_data = game_data.json()
            for play_data in game_data['liveData']['plays']['allPlays']:
                x_coordinate = 'NULL'
                if 'coordinates' in play_data and 'x' in play_data['coordinates']:
                    x_coordinate = play_data['coordinates']['x']
                y_coordinate = 'NULL'
                if 'coordinates' in play_data and 'y' in play_data['coordinates']:
                    y_coordinate = play_data['coordinates']['y']
                description = play_data['result']['description'].replace("'", " ")
                sql_bulk_insert_scripts.append(" UPDATE game_plays"
                                               f"   SET x_coordinate = {x_coordinate}"
                                               f"     , y_coordinate = {y_coordinate}"
                                               f" WHERE game_id = {existing_game[0]['id']}"
                                               f"   AND play_num = {play_data['about']['eventIdx']}")
    execute_bulk_insert_sql(connection, sql_bulk_insert_scripts)
    close_and_commit_connection(connection)
