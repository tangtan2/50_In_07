import pyspark


# load all player ids using JDBC
def get_player_ids(spark: pyspark.sql.SparkSession) -> pyspark.sql.DataFrame:
    query = "(SELECT player_id " \
            "FROM player) AS player_ids"
    return spark.read.jdbc(url='jdbc:postgresql://localhost/50_in_07',
                           table=query,
                           properties={'user': 'tanyatang',
                                       'password': '',
                                       'driver': 'org.postgresql.Driver'})


# load required data for play success probability prediction using JDBC
def get_psp_data_per_player(spark: pyspark.sql.SparkSession, player_id: int) -> pyspark.sql.DataFrame:
    # Get all events from plays table with a win/lose outcome and join with player info for each play
    query = "(SELECT b.player_id::text, b.winner, a.team_id_for, a.team_id_against, " \
            "b.event, a.x, a.y, a.period, a.period_type, a.period_time, a.rink_side " \
            "FROM " \
            "(SELECT * " \
            "FROM game_play " \
            "WHERE event = 'Hit' OR " \
            "event = 'Turnover' OR " \
            "event = 'Shot Attempt' OR " \
            "event = 'Faceoff') AS a " \
            "JOIN " \
            "(SELECT * " \
            "FROM game_player_play " \
            f"WHERE player_id = {player_id}) AS b " \
            "ON a.play_id = b.play_id) as psp_data"
    return spark.read.jdbc(url='jdbc:postgresql://localhost/50_in_07',
                           table=query,
                           properties={'user': 'tanyatang',
                                       'password': '',
                                       'driver': 'org.postgresql.Driver'})
