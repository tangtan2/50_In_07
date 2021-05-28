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
    existing_players = execute_sql_with_return(connection,
                                               "SELECT row_to_json(players.*)"
                                               "  FROM players")
    existing_player_ids = list(map(lambda x: x[0]['id'], existing_players))
    sql_bulk_insert_scripts = []
    for existing_game in existing_games:
        game_data = requests.get(config["api_url"] + f"/game/{existing_game[0]['id']}/feed/live")
        if game_data.status_code == 200:
            game_data = game_data.json()
            for play_data in game_data['liveData']['plays']['allPlays']:
                if 'players' in play_data:
                    for player_data in play_data['players']:
                        if int(player_data['player']['id']) in existing_player_ids:
                            sql_bulk_insert_scripts.append("INSERT INTO game_play_players"
                                                           f"    VALUES ({existing_game[0]['id']}"
                                                           f"         , {play_data['about']['eventIdx']}"
                                                           f"         , {player_data['player']['id']}"
                                                           f"         , '{player_data['playerType']}')")
    execute_bulk_insert_sql(connection, sql_bulk_insert_scripts)
    close_and_commit_connection(connection)
