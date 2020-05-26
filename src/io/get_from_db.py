import pyspark
import findspark
import os
from connections import startSpark, closeSpark


# Loading required data for hits prediction using JDBC
def getHitData(spark: pyspark.sql.SparkSession) -> pyspark.sql.DataFrame:
    # Get all hit events from plays table and join with player info for each play
    query = """
            SELECT a.play_id, a.game_id, b.player_id, b.player_type, a.team_id_for, a.team_id_against, a.event, a.secondary_type, a.x, a.y, a.period, a.period_type, a.period_time, a.period_time_remaining, a.date_time, a.goals_away, a.goals_home, a.description, a.st_x, a.st_y, a.rink_side
            FROM
            (SELECT *
            FROM game_play
            WHERE event = "Hit") AS a
            JOIN
            (SELECT *
            FROM game_player_play) AS b
            ON a.play_id = b.play_id
            """
    return spark.read.jdbc(url='jdbc:postgresql://localhost:5432/50_in_07', 
                           table=query, 
                           properties={'user': 'postgres', 'password': ''})
