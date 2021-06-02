import numpy as np
from flask import Flask, request
import pickle
import psycopg2
from configparser import ConfigParser

app = Flask(__name__)


def select_data(command, filename='database.ini', section='postgresql'):
    parser = ConfigParser()
    parser.read(filename)
    db = {}
    connection = None
    results = []
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception(f'Section {section} not found in the {filename} file')
    print('Connecting to PSQL database...')
    try:
        connection = psycopg2.connect(**db)
        print('Successfully connected!')
        cursor = connection.cursor()
        cursor.execute(command)
        results = list(map(lambda x: x[0], cursor.fetchall()))
        print('Command executed!')
        cursor.close()
        print('Database connection closed!')
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if connection is not None:
            connection.close()
            print('Database connection closed!')
        return results


@app.route('/', methods=['GET'])
def home():
    return 'You have reached the API!'


@app.route('/classification_svm', methods=['POST'])
def post_classification_svm():
    feature_values = [np.array(request.form['feature_values'])]
    prediction = classification_svm.predict(feature_values)
    return prediction


@app.route('/classification_rf', methods=['POST'])
def post_classification_rf():
    feature_values = [np.array(request.form['feature_values'])]
    prediction = classification_rf.predict(feature_values)
    return prediction


@app.route('/regression_en', methods=['POST'])
def post_regression_en():
    feature_values = [np.array(request.form['feature_values'])]
    prediction = regression_en.predict(feature_values)
    return prediction


@app.route('/regression_mlp', methods=['POST'])
def post_regression_mlp():
    feature_values = [np.array(request.form['feature_values'])]
    prediction = regression_mlp.predict(feature_values)
    return prediction


@app.route('/players', methods=['GET'])
def get_players():
    command = """
    SELECT row_to_json(players.*)
      FROM players
    """
    players = select_data(command)
    return players


@app.route('/season_stats', methods=['GET'])
def get_season_stats():
    command = """
    SELECT row_to_json(season_stats.*)
      FROM season_stats
    """
    season_stats = select_data(command)
    return season_stats


if __name__ == '__main__':
    classification_svm = pickle.load(open('models/classification_pipeline_svm.pkl', 'rb'))
    classification_rf = pickle.load(open('models/classification_pipeline_rf.pkl', 'rb'))
    regression_en = pickle.load(open('models/regression_pipeline_en.pkl', 'rb'))
    regression_mlp = pickle.load(open('models/regression_pipeline_mlp.pkl', 'rb'))
    app.run(debug=True)
