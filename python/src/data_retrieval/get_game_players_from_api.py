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
            for goalie_id in game_data['liveData']['boxscore']['teams']['away']['goalies']:
                if str(goalie_id)[0:2] == 'ID':
                    goalie_id = int(str(goalie_id)[2:])
                game_player_data = game_data['liveData']['boxscore']['teams']['away']['players']['ID' + str(goalie_id)]
                if goalie_id in existing_player_ids and 'goalieStats' in game_player_data['stats']:
                    sql_bulk_insert_scripts.append("INSERT INTO game_goalies"
                                                   f"    VALUES ({existing_game[0]['id']}"
                                                   f"         , {goalie_id}"
                                                   f"         , {game_data['liveData']['boxscore']['teams']['away']['team']['id']}"
                                                   f"         , '{game_player_data['stats']['goalieStats']['timeOnIce']}'"
                                                   f"         , {game_player_data['stats']['goalieStats']['assists']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['goals']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['pim']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['shots']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['saves']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['powerPlaySaves']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['shortHandedSaves']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['evenSaves']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['shortHandedShotsAgainst']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['evenShotsAgainst']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['powerPlayShotsAgainst']})")
            for player_id in game_data['liveData']['boxscore']['teams']['away']['players']:
                if str(player_id)[0:2] == 'ID':
                    player_id = int(str(player_id)[2:])
                game_player_data = game_data['liveData']['boxscore']['teams']['away']['players']['ID' + str(player_id)]
                if player_id in existing_player_ids and 'skaterStats' in game_player_data['stats']:
                    penalty_minutes = 'NULL'
                    if 'penaltyMinutes' in game_player_data['stats']['skaterStats']:
                        penalty_minutes = game_player_data['stats']['skaterStats']['penaltyMinutes']
                    plus_minus = 'NULL'
                    if 'plusMinus' in game_player_data['stats']['skaterStats']:
                        plus_minus = game_player_data['stats']['skaterStats']['plusMinus']
                    sql_bulk_insert_scripts.append("INSERT INTO game_players"
                                                   f"    VALUES ({existing_game[0]['id']}"
                                                   f"         , {player_id}"
                                                   f"         , {game_data['liveData']['boxscore']['teams']['away']['team']['id']}"
                                                   f"         , '{game_player_data['stats']['skaterStats']['timeOnIce']}'"
                                                   f"         , {game_player_data['stats']['skaterStats']['assists']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['goals']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['shots']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['hits']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['powerPlayGoals']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['powerPlayAssists']}"
                                                   f"         , {penalty_minutes}"
                                                   f"         , {game_player_data['stats']['skaterStats']['faceOffWins']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['faceoffTaken']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['takeaways']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['giveaways']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['shortHandedGoals']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['shortHandedAssists']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['blocked']}"
                                                   f"         , {plus_minus}"
                                                   f"         , '{game_player_data['stats']['skaterStats']['evenTimeOnIce']}'"
                                                   f"         , '{game_player_data['stats']['skaterStats']['powerPlayTimeOnIce']}'"
                                                   f"         , '{game_player_data['stats']['skaterStats']['shortHandedTimeOnIce']}')")
            for goalie_id in game_data['liveData']['boxscore']['teams']['home']['goalies']:
                if str(goalie_id)[0:2] == 'ID':
                    goalie_id = int(str(goalie_id)[2:])
                game_player_data = game_data['liveData']['boxscore']['teams']['home']['players']['ID' + str(goalie_id)]
                if goalie_id in existing_player_ids and 'goalieStats' in game_player_data['stats']:
                    sql_bulk_insert_scripts.append("INSERT INTO game_goalies"
                                                   f"    VALUES ({existing_game[0]['id']}"
                                                   f"         , {goalie_id}"
                                                   f"         , {game_data['liveData']['boxscore']['teams']['home']['team']['id']}"
                                                   f"         , '{game_player_data['stats']['goalieStats']['timeOnIce']}'"
                                                   f"         , {game_player_data['stats']['goalieStats']['assists']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['goals']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['pim']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['shots']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['saves']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['powerPlaySaves']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['shortHandedSaves']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['evenSaves']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['shortHandedShotsAgainst']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['evenShotsAgainst']}"
                                                   f"         , {game_player_data['stats']['goalieStats']['powerPlayShotsAgainst']})")
            for player_id in game_data['liveData']['boxscore']['teams']['home']['players']:
                if str(player_id)[0:2] == 'ID':
                    player_id = int(str(player_id)[2:])
                game_player_data = game_data['liveData']['boxscore']['teams']['home']['players']['ID' + str(player_id)]
                if player_id in existing_player_ids and 'skaterStats' in game_player_data['stats']:
                    penalty_minutes = 'NULL'
                    if 'penaltyMinutes' in game_player_data['stats']['skaterStats']:
                        penalty_minutes = game_player_data['stats']['skaterStats']['penaltyMinutes']
                    plus_minus = 'NULL'
                    if 'plusMinus' in game_player_data['stats']['skaterStats']:
                        plus_minus = game_player_data['stats']['skaterStats']['plusMinus']
                    sql_bulk_insert_scripts.append("INSERT INTO game_players"
                                                   f"    VALUES ({existing_game[0]['id']}"
                                                   f"         , {player_id}"
                                                   f"         , {game_data['liveData']['boxscore']['teams']['home']['team']['id']}"
                                                   f"         , '{game_player_data['stats']['skaterStats']['timeOnIce']}'"
                                                   f"         , {game_player_data['stats']['skaterStats']['assists']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['goals']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['shots']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['hits']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['powerPlayGoals']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['powerPlayAssists']}"
                                                   f"         , {penalty_minutes}"
                                                   f"         , {game_player_data['stats']['skaterStats']['faceOffWins']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['faceoffTaken']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['takeaways']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['giveaways']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['shortHandedGoals']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['shortHandedAssists']}"
                                                   f"         , {game_player_data['stats']['skaterStats']['blocked']}"
                                                   f"         , {plus_minus}"
                                                   f"         , '{game_player_data['stats']['skaterStats']['evenTimeOnIce']}'"
                                                   f"         , '{game_player_data['stats']['skaterStats']['powerPlayTimeOnIce']}'"
                                                   f"         , '{game_player_data['stats']['skaterStats']['shortHandedTimeOnIce']}')")
    execute_bulk_insert_sql(connection, sql_bulk_insert_scripts)
    close_and_commit_connection(connection)
