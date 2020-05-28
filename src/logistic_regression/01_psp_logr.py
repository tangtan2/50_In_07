import pyspark
import pickle
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.pipeline import Pipeline
from pyspark.ml.feature import OneHotEncoderEstimator, StringIndexer, VectorAssembler
from pyspark.ml.evaluation import BinaryClassificationEvaluator
from src.io.get_from_db import get_psp_data
from src.io.connections import start_spark, close_spark


# create prototype logistic regression classification model to get probability that a player wins a play
def create_proto_model(psp_data: pyspark.sql.DataFrame, dump_folder: str, date: str):
    print('[INFO] creating logistic regression classification model for play success probability prediction')
    print('dataframe schema:')
    psp_data.printSchema()
    # create pipeline
    print('assembling pipeline')
    stages = []
    string_categories = ['player_id', 'event', 'secondary_type', 'period_type', 'rink_side']
    int_categories = ['team_id_for', 'team_id_against', 'period']
    for cat in string_categories:
        string_ind = StringIndexer(inputCol=cat, outputCol=cat + 'Index')
        encoder = OneHotEncoderEstimator(inputCols=[string_ind.getOutputCol()],
                                         outputCols=[cat + 'Vector'])
        stages += [string_ind, encoder]
    for cat in int_categories:
        encoder = OneHotEncoderEstimator(inputCols=[cat],
                                         outputCols=[cat + 'Vector'])
        stages += [encoder]
    numeric = ['x', 'y', 'st_x', 'st_y', 'period_time']
    assembler_inputs = [c + 'Vector' for c in string_categories] + \
                       [c + 'Vector' for c in int_categories] + numeric
    stages += [VectorAssembler(inputCols=assembler_inputs, outputCol='features')]
    stages += [StringIndexer(inputCol='player_type', outputCol='label')]
    pipeline = Pipeline(stage=stages)
    # transform data using pipeline
    pipeline_model = pipeline.fit(psp_data)
    psp_data = pipeline_model.transform(psp_data)
    print('model pipeline created and data transformed')
    # split data into training and test data
    train, test = psp_data.randomSplit([0.7, 0.3], seed=2020)
    # fit and train model
    lr = LogisticRegression(featuresCol='features', labelCol='label', maxIter=10)
    lr_model = lr.fit(train)
    print('model trained, summary of training:')
    print(lr_model.summary)
    # make predictions using test data
    predictions = lr_model.transform(test)
    print('summary of test predictions:')
    print(predictions.summary())
    print('sample test predictions:')
    predictions.select('player_id', 'event', 'secondary_type', 'player_type',
                       'rawPrediction', 'prediction', 'probability').show(10)
    # evaluate predictions
    evaluator = BinaryClassificationEvaluator()
    print('test area under ROC:', evaluator.evaluate(predictions))
    # save predictions and model
    print('write test prediction to log file')
    predictions.write.csv(f'{dump_folder}/{date}_01_psp_logr_test_preds.csv')
    print('pickle model')
    pickle.dump(lr_model, open(f'{dump_folder}/{date}_01_psp_logr_model.pkl', 'w'))
    print('model creation complete')


if __name__ == '__main__':
    dump_loc = '../../dumps'
    curr_date = '052820'
    spark = start_spark('hockey')
    create_proto_model(get_psp_data(spark), dump_loc, curr_date)
    close_spark(spark)
