import os
import pyspark
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.pipeline import Pipeline
from pyspark.ml.feature import OneHotEncoderEstimator, StringIndexer, VectorAssembler
from pyspark.ml.evaluation import MulticlassClassificationEvaluator
from src.io.connections import start_spark, close_spark


# load all player ids using JDBC
def get_player_ids(spark_session: pyspark.sql.SparkSession) -> pyspark.sql.DataFrame:
    query = "(SELECT player_id " \
            "FROM player) AS player_ids"
    return spark_session.read.jdbc(url='jdbc:postgresql://localhost/50_in_07',
                                   table=query,
                                   properties={'user': 'tanyatang',
                                               'password': '',
                                               'driver': 'org.postgresql.Driver'})


# load required data for play success probability prediction using JDBC
def get_psp_data_per_player(spark_session: pyspark.sql.SparkSession, player: int) -> pyspark.sql.DataFrame:
    # Get all events from plays table with a win/lose outcome and join with player info for each play
    query = "(SELECT b.player_id::text, b.winner, a.team_id_for, a.team_id_against, " \
            "b.event, a.x, a.y, a.period, a.period_type, a.period_time, a.rink_side " \
            "FROM " \
            "(SELECT * " \
            "FROM game_play " \
            "WHERE event = 'Goal' OR " \
            "event = 'Missed Shot' OR " \
            "event = 'Blocked Shot' OR " \
            "event = 'Shot') AS a " \
            "JOIN " \
            "(SELECT * " \
            "FROM game_player_play " \
            f"WHERE player_id = {player}) AS b " \
            "ON a.play_id = b.play_id) as psp_data"
    return spark_session.read.jdbc(url='jdbc:postgresql://localhost/50_in_07',
                                   table=query,
                                   properties={'user': 'tanyatang',
                                               'password': '',
                                               'driver': 'org.postgresql.Driver'})


# create prototype logistic regression classification model to get probability that a player completes a shot
def create_proto_model(psp_data: pyspark.sql.DataFrame, dump_folder: str, date: str, eval_log, player: int):

    print('[INFO] creating logistic regression classification model for shot success probability prediction')
    print('count of training data entries: ' + str(psp_data.count()))

    # split data into training and test data
    train, test = psp_data.randomSplit([0.7, 0.3],
                                       seed=2020)

    # create pipeline
    print('assembling pipeline...')
    stages = []
    string_categories = ['period_type', 'rink_side']
    for cat in string_categories:
        string_ind = StringIndexer(inputCol=cat,
                                   outputCol=cat + 'Index').setHandleInvalid('keep')
        encoder = OneHotEncoderEstimator(inputCols=[string_ind.getOutputCol()],
                                         outputCols=[cat + 'Vector']).setHandleInvalid('keep')
        stages += [string_ind, encoder]
    int_categories = ['team_id_for', 'team_id_against', 'period']
    for cat in int_categories:
        encoder = OneHotEncoderEstimator(inputCols=[cat],
                                         outputCols=[cat + 'Vector']).setHandleInvalid('keep')
        stages += [encoder]
    numeric = ['x', 'y', 'period_time']

    assembler_inputs = [c + 'Vector' for c in string_categories] + \
                       [c + 'Vector' for c in int_categories] + numeric
    stages += [VectorAssembler(inputCols=assembler_inputs,
                               outputCol='features').setHandleInvalid('keep')]
    stages += [StringIndexer(inputCol='winner',
                             outputCol='label').setHandleInvalid('keep')]
    stages += [LogisticRegression(featuresCol='features',
                                  labelCol='label',
                                  elasticNetParam=0.5,
                                  regParam=0.0)]
    pipeline = Pipeline(stages=stages)

    print('starting training...')
    pipeline_model = pipeline.fit(train)
    print('pipeline assembled and model trained')

    # make predictions using test data
    print('making predictions...')
    predictions = pipeline_model.transform(test)
    predictions = predictions.select('player_id', 'winner', 'team_id_for', 'team_id_against', 'event',
                                     'x', 'y', 'period', 'period_type', 'period_time', 'rink_side',
                                     'label', 'rawPrediction', 'prediction', 'probability')

    # evaluate predictions
    evaluator = MulticlassClassificationEvaluator()
    eval_log.write(f'Current Player: {player}\n')
    eval_log.write(f'Precision: {evaluator.evaluate(predictions, {evaluator.metricName: "weightedPrecision"})}\n')
    eval_log.write(f'Recall: {evaluator.evaluate(predictions, {evaluator.metricName: "weightedRecall"})}\n')
    eval_log.write(f'F1 Measure: {evaluator.evaluate(predictions, {evaluator.metricName: "f1"})}\n\n')

    # save predictions
    print('writing test prediction to log file...')
    predictions.write.json(f'{dump_folder}/{date}_01_psp_logr_test_preds_json')
    print(f'model creation complete for player {player}')


if __name__ == '__main__':
    curr_date = '052820'
    dump_loc = '../../dumps/' + curr_date
    if not os.path.exists(dump_loc):
        os.mkdir(dump_loc)
    spark = start_spark('hockey')
    ids = get_player_ids(spark)
    print(f'[INFO] there are {ids.count()} players in the NHL')
    print(f'sample 1% of the total players and create prototype models for each player')
    log = open(f'{dump_loc}/{curr_date}_01_psp_logr_evaluations.txt', 'w')
    for player_id in ids.select('player_id').sample(withReplacement=False,
                                                    fraction=0.01,
                                                    seed=2020).collect():
        psp = get_psp_data_per_player(spark, player_id[0])
        if psp.count() > 1000:
            create_proto_model(get_psp_data_per_player(spark, player_id[0]),
                               dump_loc,
                               curr_date + '_' + str(player_id[0]),
                               log,
                               player_id[0])
        else:
            log.write(f'[WARN] Player {player_id[0]} does not have sufficient data to train model\n\n')
    log.close()
    close_spark(spark)
