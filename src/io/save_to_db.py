import pyspark
import findspark
import os
from connections import startSpark, closeSpark


# Save player info using JDBC
def save_player(spark: pyspark.sql.SparkSession, player_file: str):
    df = spark.read.csv(player_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    table_schema = """
                   VARCHAR(50) player_id,
                   VARCHAR(50) first_name,
                   VARCHAR(50) last_name,
                   CHAR(3) nationality,
                   VARCHAR(50) birth_city,
                   VARCHAR(5) primary_position,
                   DATE birth_date,
                   VARCHAR(50) link
                   """
    df.write.option('createTableColumnTypes',
                    table_schema) \
                        .jdbc('jdbc:postgresql://localhost:5432/50_in_07', 
                              'player', 
                              properties={'user': 'postgre', 'password': ''})


# Save team info using JDBC
def save_team(spark: pyspark.sql.SparkSession, team_file: str):
    df = spark.read.csv(team_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    table_schema = """
                   VARCHAR(50) team_id,
                   VARCHAR(50) franchise_id,
                   VARCHAR(50) short_name,
                   VARCHAR(50) team_name,
                   CHAR(3) abbreviation,
                   VARCHAR(50) link
                   """
    df.write.option('createTableColumnTypes',
                    table_schema) \
                        .jdbc('jdbc:postgresql://localhost:5432/50_in_07', 
                              'team', 
                              properties={'user': 'postgre', 'password': ''})


# Save game info using JDBC
def save_game(spark: pyspark.sql.SparkSession, game_file: str):
    df = spark.read.csv(game_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    table_schema = """
                   VARCHAR(50) game_id,
                   VARCHAR(50) season,
                   CHAR(1) type,
                   DATE date_time,
                   TIMESTAMP date_time_GMT,
                   VARCHAR(5) away_team_id,
                   VARCHAR(5) home_team_id,
                   SMALLINT away_goals,
                   SMALLINT home_goals,
                   VARCHAR(50) outcome,
                   VARCHAR(10) home_rink_side_start,
                   VARCHAR(100) venue,
                   VARCHAR(50) venue_link,
                   VARCHAR(50) venue_time_zone_id,
                   SMALLINT venue_time_zone_offset,
                   VARCHAR(5) venue_time_zone_tz
                   """
    df.write.option('createTableColumnTypes',
                    table_schema) \
                        .jdbc('jdbc:postgresql://localhost:5432/50_in_07', 
                              'game_goalie', 
                              properties={'user': 'postgre', 'password': ''})


# Save game_goalie info using JDBC
def save_game_goalie(spark: pyspark.sql.SparkSession, game_goalie_file: str):
    df = spark.read.csv(game_goalie_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    table_schema = """
                   VARCHAR(50) game_id,
                   VARCHAR(50) player_id,
                   VARCHAR(5) team_id,
                   SMALLINT time_on_ice,
                   SMALLINT assists,
                   SMALLINT goals,
                   SMALLINT pim,
                   SMALLINT shots,
                   SMALLINT saves,
                   SMALLINT power_play_saves,
                   SMALLINT short_handed_saves,
                   SMALLINT even_saves,
                   SMALLINT short_handed_shots_against,
                   SMALLINT even_shots_against,
                   SMALLINT power_play_shots_against,
                   VARCHAR(5) decision,
                   REAL save_percentage,
                   REAL power_play_save_percentage,
                   REAL even_strength_save_percentage
                   """
    df.write.option('createTableColumnTypes',
                    table_schema) \
                        .jdbc('jdbc:postgresql://localhost:5432/50_in_07', 
                              'game_goalie', 
                              properties={'user': 'postgre', 'password': ''})


# Save game_player_play info using JDBC
def save_game_player_play(spark: pyspark.sql.SparkSession, game_player_play_file: str):
    df = spark.read.csv(game_player_play_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    table_schema = """
                   VARCHAR(50) play_id,
                   VARCHAR(50) game_id,
                   SMALLINT play_num,
                   VARCHAR(50) player_id,
                   VARCHAR(50) player_type
                   """
    df.write.option('createTableColumnTypes',
                    table_schema) \
                        .jdbc('jdbc:postgresql://localhost:5432/50_in_07', 
                              'game_player_play', 
                              properties={'user': 'postgre', 'password': ''})


# Save game_play info using JDBC
def save_game_play(spark: pyspark.sql.SparkSession, game_play_file: str):
    df = spark.read.csv(game_play_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    table_schema = """
                   VARCHAR(50) play_id,
                   VARCHAR(50) game_id,
                   SMALLINT play_num,
                   VARCHAR(5) team_id_for,
                   VARCHAR(5) team_id_against,
                   VARCHAR(100) event,
                   VARCHAR(100) secondary_type,
                   SMALLINT x,
                   SMALLINT y,
                   SMALLINT period,
                   VARCHAR(50) period_type,
                   SMALLINT period_time,
                   SMALLINT period_time_remaining,
                   TIMESTAMP date_time,
                   SMALLINT goals_away,
                   SMALLINT goals_home,
                   TEXT description,
                   SMALLINT st_x,
                   SMALLINT st_y,
                   VARCHAR(50) rink_side
                   """
    df.write.option('createTableColumnTypes',
                    table_schema) \
                        .jdbc('jdbc:postgresql://localhost:5432/50_in_07', 
                              'game_play', 
                              properties={'user': 'postgre', 'password': ''})


# Save game_shift info using JDBC
def save_game_shift(spark: pyspark.sql.SparkSession, game_shift_file: str):
    df = spark.read.csv(game_shift_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    table_schema = """
                   VARCHAR(50) game_id,
                   VARCHAR(50) player_id,
                   SMALLINT period,
                   SMALLINT shift_start,
                   SMALLINT shift_end
                   """
    df.write.option('createTableColumnTypes',
                    table_schema) \
                        .jdbc('jdbc:postgresql://localhost:5432/50_in_07', 
                              'game_shift', 
                              properties={'user': 'postgre', 'password': ''})


# Save game_skater info using JDBC
def save_game_skater(spark: pyspark.sql.SparkSession, game_skater_file: str):
    df = spark.read.csv(game_skater_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    table_schema = """
                   VARCHAR(50) game_id,
                   VARCHAR(50) player_id,
                   VARCHAR(5) team_id,
                   SMALLINT time_on_ice,
                   SMALLINT assists,
                   SMALLINT goals,
                   SMALLINT shots,
                   SMALLINT hits,
                   SMALLINT power_play_goals,
                   SMALLINT power_play_assists,
                   SMALLINT penalty_minutes,
                   SMALLINT faceoff_wins,
                   SMALLINT faceoff_taken,
                   SMALLINT takeaways,
                   SMALLINT giveaways,
                   SMALLINT short_handed_goals,
                   SMALLINT short_handed_assists,
                   SMALLINT blocked,
                   SMALLINT plus_minus,
                   SMALLINT even_time_on_ice,
                   SMALLINT short_handed_time_on_ice,
                   SMALLINT power_play_time_on_ice
                   """
    df.write.option('createTableColumnTypes',
                    table_schema) \
                        .jdbc('jdbc:postgresql://localhost:5432/50_in_07', 
                              'game_skater', 
                              properties={'user': 'postgre', 'password': ''})


# Save game_team info using JDBC
def save_game_team(spark: pyspark.sql.SparkSession, game_team_file: str):
    df = spark.read.csv(game_team_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    table_schema = """
                   VARCHAR(50) game_id,
                   VARCHAR(3) team_id,
                   VARCHAR(5) HoA,
                   BOOLEAN won,
                   VARCHAR(5) settled_in,
                   VARCHAR(50) head_coach,
                   SMALLINT goals,
                   SMALLINT shots,
                   SMALLINT hits,
                   SMALLINT pim,
                   SMALLINT power_play_opportunities,
                   SMALLINT power_play_goals,
                   REAL faceoff_win_percentage,
                   SMALLINT giveaways,
                   SMALLINT takeaways
                   """
    df.write.option('createTableColumnTypes',
                    table_schema) \
                        .jdbc('jdbc:postgresql://localhost:5432/50_in_07', 
                              'game_team', 
                              properties={'user': 'postgre', 'password': ''})
