import pyspark
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.pipeline import Pipeline
from pyspark.ml.feature import OneHotEncoderEstimator, StringIndexer, VectorAssembler
from pyspark.ml.evaluation import BinaryClassificationEvaluator
from src.io.get_from_db import get_psp_data_per_player, get_player_ids
from src.io.connections import start_spark, close_spark


# create prototype logistic regression classification model to get probability that a player wins a play
def create_proto_model(psp_data: pyspark.sql.DataFrame, dump_folder: str, date: str, eval_log, player: int):
    print('[INFO] creating logistic regression classification model for play success probability prediction')
    print('count of training data entries: ' + str(psp_data.count()))
    # split data into training and test data
    train, test = psp_data.randomSplit([0.7, 0.3],
                                       seed=2020)
    # create pipeline
    print('assembling pipeline...')
    stages = []
    string_categories = ['event', 'period_type', 'rink_side']
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
                                  elasticNetParam=0.8,
                                  regParam=0.3)]
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
    evaluator = BinaryClassificationEvaluator()
    eval_log.write(f'Current Player: {player}\n')
    eval_log.write(f'ROC Area: {evaluator.evaluate(predictions)}\n\n')
    # save predictions and model
    print('writing test prediction to log file...')
    predictions.write.json(f'{dump_folder}/{date}_01_psp_logr_test_preds_json')
    print('saving pipeline...')
    pipeline_model.save(f'{dump_folder}/{date}_01_psp_logr_pipeline')
    print(f'model creation complete for player {player}')


if __name__ == '__main__':
    dump_loc = '../../dumps'
    curr_date = '052820'
    spark = start_spark('hockey')
    ids = get_player_ids(spark)
    print(f'[INFO] there are {ids.count()} players in the NHL, a model need to be created for each player')
    log = open(f'{dump_loc}/{curr_date}_01_psp_logr_evaluations.txt', 'w')
    for player_id in ids.select('player_id').collect():
        psp = get_psp_data_per_player(spark, player_id[0])
        if psp.count() > 500:
            create_proto_model(get_psp_data_per_player(spark, player_id[0]),
                               dump_loc,
                               curr_date + '_' + str(player_id[0]),
                               log,
                               player_id[0])
        else:
            log.write(f'[WARN] Player {player_id[0]} does not have sufficient data to train model\n\n')
    log.close()
    close_spark(spark)
