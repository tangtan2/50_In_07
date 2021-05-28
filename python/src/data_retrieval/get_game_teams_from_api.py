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
        game_data = requests.get(config["api_url"] + f"/game/{existing_game[0]['id']}/boxscore")
        if game_data.status_code == 200:
            game_data = game_data.json()
            game_data = game_data['teams']
            head_coach = ""
            for coach in game_data['away']['coaches']:
                if coach['position']['code'] == 'HC':
                    head_coach = coach['person']['fullName'].replace("'", " ")
                    break
            sql_bulk_insert_scripts.append("INSERT INTO game_teams"
                                           f"    VALUES ({existing_game[0]['id']}"
                                           f"         , {game_data['away']['team']['id']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['goals']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['shots']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['pim']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['powerPlayPercentage']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['powerPlayGoals']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['powerPlayOpportunities']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['blocked']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['takeaways']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['giveaways']}"
                                           f"         , {game_data['away']['teamStats']['teamSkaterStats']['hits']}"
                                           f"         , '{head_coach}')")
            for coach in game_data['home']['coaches']:
                if coach['position']['code'] == 'HC':
                    head_coach = coach['person']['fullName'].replace("'", " ")
                    break
            sql_bulk_insert_scripts.append("INSERT INTO game_teams"
                                           f"    VALUES ({existing_game[0]['id']}"
                                           f"         , {game_data['home']['team']['id']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['goals']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['shots']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['pim']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['powerPlayPercentage']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['powerPlayGoals']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['powerPlayOpportunities']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['blocked']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['takeaways']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['giveaways']}"
                                           f"         , {game_data['home']['teamStats']['teamSkaterStats']['hits']}"
                                           f"         , '{head_coach}')")
    execute_bulk_insert_sql(connection, sql_bulk_insert_scripts)
    close_and_commit_connection(connection)
