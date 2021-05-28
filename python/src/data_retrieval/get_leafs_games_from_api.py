import requests
from connect_to_db import create_connection, close_and_commit_connection, execute_bulk_insert_sql, \
    execute_sql_with_return, execute_sql
from config import get_config

if __name__ == "__main__":
    config = get_config()
    connection = create_connection()
    existing_seasons = execute_sql_with_return(connection,
                                               "SELECT row_to_json(seasons.*)"
                                               "  FROM seasons")
    sql_bulk_insert_scripts = []
    for season in existing_seasons:
        if season[0]['id'] == 20162017:
            game_ids = []
            for i in range(1, 107):
                game_ids.append('201601' + '0' * (4 - len(str(i))) + str(i))
            for i in range(1, 1231):
                game_ids.append('201602' + '0' * (4 - len(str(i))) + str(i))
            game_ids.append(['2016030111', '2016030112', '2016030113', '2016030114', '2016030115', '2016030116'])
            game_ids.append(['2016030121', '2016030122', '2016030123', '2016030124', '2016030125', '2016030126'])
            game_ids.append(['2016030131', '2016030132', '2016030133', '2016030134', '2016030135', '2016030136'])
            game_ids.append(['2016030141', '2016030142', '2016030143', '2016030144', '2016030145'])
            game_ids.append(['2016030151', '2016030152', '2016030153', '2016030154'])
            game_ids.append(['2016030161', '2016030162', '2016030163', '2016030164', '2016030165'])
            game_ids.append(['2016030171', '2016030172', '2016030173', '2016030174'])
            game_ids.append(['2016030181', '2016030182', '2016030183', '2016030184', '2016030185', '2016030186'])
            game_ids.append(['2016030211', '2016030212', '2016030213', '2016030214', '2016030215', '2016030216'])
            game_ids.append(['2016030221', '2016030222', '2016030223', '2016030224', '2016030225', '2016030226',
                             '2016030227'])
            game_ids.append(['2016030231', '2016030232', '2016030233', '2016030234', '2016030235', '2016030236'])
            game_ids.append(['2016030241', '2016030242', '2016030243', '2016030244', '2016030245', '2016030246',
                             '2016030247'])
            game_ids.append(['2016030311', '2016030312', '2016030313', '2016030314', '2016030315', '2016030316',
                             '2016030317'])
            game_ids.append(['2016030321', '2016030322', '2016030323', '2016030324', '2016030325', '2016030326'])
            game_ids.append(['2016030411', '2016030412', '2016030413', '2016030414', '2016030415', '2016030416'])
            for game_id in game_ids:
                game_data = requests.get(config["api_url"] + f"/game/{game_id}/feed/live")
                if game_data.status_code == 200:
                    game_data = game_data.json()
                    execute_sql(connection,
                                "INSERT INTO games"
                                f"    VALUES ({game_data['gameData']['game']['pk']}"
                                f"         , '{game_data['gameData']['game']['type']}'"
                                f"         , 20162017"
                                f"         , '{game_data['gameData']['datetime']['dateTime']}'"
                                f"         , {game_data['gameData']['teams']['away']['id']}"
                                f"         , {game_data['liveData']['linescore']['teams']['away']['goals']}"
                                f"         , {game_data['gameData']['teams']['home']['id']}"
                                f"         , {game_data['liveData']['linescore']['teams']['home']['goals']})")
        else:
            game_data = requests.get(config["api_url"] + f"/schedule?teamId=10&season={season[0]['id']}")
            if game_data.status_code == 200:
                game_data = game_data.json()
                for date in game_data["dates"]:
                    for game in date["games"]:
                        sql_bulk_insert_scripts.append("INSERT INTO games"
                                                       f"    VALUES ({game['gamePk']}"
                                                       f"         , '{game['gameType']}'"
                                                       f"         , {season[0]['id']}"
                                                       f"         , '{game['gameDate']}'"
                                                       f"         , {game['teams']['away']['team']['id']}"
                                                       f"         , {game['teams']['away']['score']}"
                                                       f"         , {game['teams']['home']['team']['id']}"
                                                       f"         , {game['teams']['home']['score']})")
    execute_bulk_insert_sql(connection, sql_bulk_insert_scripts)
    close_and_commit_connection(connection)
