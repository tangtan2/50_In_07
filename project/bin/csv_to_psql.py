from pyspark.sql.utils import CapturedException
from py4j.protocol import Py4JJavaError
import project.common.save_to_db as save
from project.common.connections import start_spark, close_spark

# make filepaths for all relevant tables
filepaths = []
for file in ['game_goalie_stats.csv',
             'game_plays_players.csv',
             'game_plays.csv',
             'game_shifts.csv',
             'game_skater_stats.csv',
             'game_teams_stats.csv',
             'game.csv',
             'player_info.csv',
             'team_info.csv']:
    filepaths.append(f'/Users/tanyatang/Downloads/{file}')

# start spark
spark = start_spark('hockey')

# try to save csv files to db, if error then close spark session
try:
    save.save_game_goalie(spark, filepaths[0])
    save.save_game_player_play(spark, filepaths[1])
    save.save_game_play(spark, filepaths[2])
    save.save_game_shift(spark, filepaths[3])
    save.save_game_skater(spark, filepaths[4])
    save.save_game_team(spark, filepaths[5])
    save.save_game(spark, filepaths[6])
    save.save_player(spark, filepaths[7])
    save.save_team(spark, filepaths[8])
except (CapturedException, Py4JJavaError) as e:
    print(e)
    print('[ERROR] error occurred when trying to save csv to db')
    close_spark(spark)
