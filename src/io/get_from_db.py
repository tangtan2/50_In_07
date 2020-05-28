import pyspark


# Loading required data for play success probability prediction using JDBC
def get_psp_data(spark: pyspark.sql.SparkSession) -> pyspark.sql.DataFrame:
    # Get all events from plays table with a win/lose outcome and join with player info for each play
    query = "SELECT CAST (b.player_id AS TEXT), b.player_type, a.team_id_for, a.team_id_against, a.event, " \
            "a.secondary_type, a.x, a.y, a.period, a.period_type, a.period_time, a.st_x, a.st_y, a.rink_side " \
            "FROM " \
            "(SELECT * " \
            "FROM game_play " \
            "WHERE event = 'Hit' OR " \
            "event = 'Faceoff' OR " \
            "event = 'Goal' OR " \
            "event = 'Assist' OR " \
            "event = 'Blocked Shot' OR " \
            "event = 'Missed Shot' OR " \
            "event = 'Shot' OR " \
            "event = 'Takeaway' OR " \
            "event = 'Giveaway') AS a " \
            "JOIN " \
            "(SELECT * "\
            "FROM game_player_play) AS b " \
            "ON a.play_id = b.play_id"
    return spark.read.jdbc(url='jdbc:postgresql://localhost/50_in_07',
                           table=query, 
                           properties={'user': 'tanyatang', 'password': ''})
