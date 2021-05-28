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
                description = play_data['result']['description'].replace("'", " ")
                sql_bulk_insert_scripts.append("INSERT INTO game_plays"
                                               f"    VALUES ({existing_game[0]['id']}"
                                               f"         , {play_data['about']['eventIdx']}"
                                               f"         , '{play_data['result']['event']}'"
                                               f"         , '{description}'"
                                               f"         , {play_data['about']['period']}"
                                               f"         , '{play_data['about']['periodType']}'"
                                               f"         , '{play_data['about']['periodTime']}'"
                                               f"         , '{play_data['about']['periodTimeRemaining']}'"
                                               f"         , '{play_data['about']['dateTime']}'"
                                               f"         , {play_data['about']['goals']['away']}"
                                               f"         , {play_data['about']['goals']['home']}"
                                               f"         , NULL"
                                               f"         , NULL)")
    execute_bulk_insert_sql(connection, sql_bulk_insert_scripts)
    close_and_commit_connection(connection)
