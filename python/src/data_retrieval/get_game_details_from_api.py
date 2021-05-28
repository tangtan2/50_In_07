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
            first_star = 'NULL'
            if 'firstStar' in game_data['liveData']['decisions'] and \
                    game_data['liveData']['decisions']['firstStar']['id'] in existing_player_ids:
                first_star = game_data['liveData']['decisions']['firstStar']['id']
            second_star = 'NULL'
            if 'secondStar' in game_data['liveData']['decisions'] and \
                    game_data['liveData']['decisions']['secondStar']['id'] in existing_player_ids:
                second_star = game_data['liveData']['decisions']['secondStar']['id']
            third_star = 'NULL'
            if 'thirdStar' in game_data['liveData']['decisions'] and \
                    game_data['liveData']['decisions']['thirdStar']['id'] in existing_player_ids:
                first_star = game_data['liveData']['decisions']['thirdStar']['id']
            sql_bulk_insert_scripts.append("INSERT INTO game_details"
                                           f"    VALUES ({existing_game[0]['id']}"
                                           f"         , '{game_data['gameData']['datetime']['dateTime']}'"
                                           f"         , '{game_data['gameData']['datetime']['dateTime']}'"
                                           f"         , '{game_data['liveData']['linescore']['powerPlayStrength']}'"
                                           f"         , {game_data['liveData']['linescore']['hasShootout']}"
                                           f"         , {first_star}"
                                           f"         , {second_star}"
                                           f"         , {third_star})")
    execute_bulk_insert_sql(connection, sql_bulk_insert_scripts)
    close_and_commit_connection(connection)
