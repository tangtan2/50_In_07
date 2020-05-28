import pyspark
import pyspark.sql.types as types


# Save player info using JDBC
def save_player(spark: pyspark.sql.SparkSession, player_file: str):
    print('[INFO] reading from csv (player)...')
    df = spark.read.csv(player_file, 
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    df = df.withColumn('birth_date', df['birth_date'].cast(types.DateType()))
    print('writing to database...')
    df.write.jdbc('jdbc:postgresql://localhost/50_in_07',
                  'player',
                  properties={'user': 'tanyatang',
                              'password': '',
                              'driver': 'org.postgresql.Driver'})
    print('done!')


# Save team info using JDBC
def save_team(spark: pyspark.sql.SparkSession, team_file: str):
    print('[INFO] reading from csv (team)...')
    df = spark.read.csv(team_file,
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    print('writing to database...')
    df.write.jdbc('jdbc:postgresql://localhost/50_in_07',
                  'team',
                  properties={'user': 'tanyatang',
                              'password': '',
                              'driver': 'org.postgresql.Driver'})
    print('done!')


# Save game info using JDBC
def save_game(spark: pyspark.sql.SparkSession, game_file: str):
    print('[INFO] reading from csv (game)...')
    df = spark.read.csv(game_file,
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    df = df.withColumn('date_time', df['date_time'].cast(types.DateType()))
    df = df.withColumn('date_time_GMT', df['date_time_GMT'].cast(types.TimestampType()))
    print('writing to database...')
    df.write.jdbc('jdbc:postgresql://localhost/50_in_07',
                  'game',
                  properties={'user': 'tanyatang',
                              'password': '',
                              'driver': 'org.postgresql.Driver'})
    print('done!')


# Save game_goalie info using JDBC
def save_game_goalie(spark: pyspark.sql.SparkSession, game_goalie_file: str):
    print('[INFO] reading from csv (game goalie)...')
    df = spark.read.csv(game_goalie_file,
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    df = df.withColumn('save_percentage', df['save_percentage'].cast(types.DoubleType()))
    df = df.withColumn('power_play_save_percentage', df['power_play_save_percentage'].cast(types.DoubleType()))
    df = df.withColumn('even_strength_save_percentage', df['even_strength_save_percentage'].cast(types.DoubleType()))
    print('writing to database...')
    df.write.jdbc('jdbc:postgresql://localhost/50_in_07',
                  'game_goalie',
                  properties={'user': 'tanyatang',
                              'password': '',
                              'driver': 'org.postgresql.Driver'})
    print('done!')


# Save game_player_play info using JDBC
def save_game_player_play(spark: pyspark.sql.SparkSession, game_player_play_file: str):
    print('[INFO] reading from csv (game player play)...')
    df = spark.read.csv(game_player_play_file,
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    print('writing to database...')
    df.write.jdbc('jdbc:postgresql://localhost/50_in_07',
                  'game_player_play',
                  properties={'user': 'tanyatang',
                              'password': '',
                              'driver': 'org.postgresql.Driver'})
    print('done!')


# Save game_play info using JDBC
def save_game_play(spark: pyspark.sql.SparkSession, game_play_file: str):
    print('[INFO] reading from csv (game play)...')
    df = spark.read.csv(game_play_file,
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    df = df.withColumn('date_time', df['date_time'].cast(types.TimestampType()))
    print('writing to database...')
    df.write.jdbc('jdbc:postgresql://localhost/50_in_07',
                  'game_play',
                  properties={'user': 'tanyatang',
                              'password': '',
                              'driver': 'org.postgresql.Driver'})
    print('done!')


# Save game_shift info using JDBC
def save_game_shift(spark: pyspark.sql.SparkSession, game_shift_file: str):
    print('[INFO] reading from csv (game shift)...')
    df = spark.read.csv(game_shift_file,
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    print('writing to database...')
    df.write.jdbc('jdbc:postgresql://localhost/50_in_07',
                  'game_shift',
                  properties={'user': 'tanyatang',
                              'password': '',
                              'driver': 'org.postgresql.Driver'})
    print('done!')


# Save game_skater info using JDBC
def save_game_skater(spark: pyspark.sql.SparkSession, game_skater_file: str):
    print('[INFO] reading from csv (game skater)...')
    df = spark.read.csv(game_skater_file,
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    print('writing to database...')
    df.write.jdbc('jdbc:postgresql://localhost/50_in_07',
                  'game_skater',
                  properties={'user': 'tanyatang',
                              'password': '',
                              'driver': 'org.postgresql.Driver'})
    print('done!')


# Save game_team info using JDBC
def save_game_team(spark: pyspark.sql.SparkSession, game_team_file: str):
    print('[INFO] reading from csv (game team)...')
    df = spark.read.csv(game_team_file,
                        sep=',', 
                        header=True, 
                        inferSchema=True)
    df = df.withColumn('won', df['won'].cast(types.BooleanType()))
    df = df.withColumn('faceoff_win_percentage', df['faceoff_win_percentage'].cast(types.DoubleType()))
    print('writing to database...')
    df.write.jdbc('jdbc:postgresql://localhost/50_in_07',
                  'game_team',
                  properties={'user': 'tanyatang',
                              'password': '',
                              'driver': 'org.postgresql.Driver'})
    print('done!')
