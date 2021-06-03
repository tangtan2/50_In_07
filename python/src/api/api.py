import pandas as pd
from flask import Flask, request
from flask_cors import CORS
import pickle
import psycopg2
from configparser import ConfigParser
import json

app = Flask(__name__)
CORS(app)


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


@app.route('/classification-svm', methods=['POST'])
def post_classification_svm():
    feature_values = pd.json_normalize([json.loads(request.form['feature_values'])])
    prediction = classification_svm.predict(feature_values)
    return prediction


@app.route('/classification-rf', methods=['POST'])
def post_classification_rf():
    feature_values = pd.json_normalize([json.loads(request.form['feature_values'])])
    prediction = classification_rf.predict(feature_values)
    return prediction


@app.route('/regression-en', methods=['POST'])
def post_regression_en():
    feature_values = pd.json_normalize([json.loads(request.form['feature_values'])])
    prediction = regression_en.predict(feature_values)
    return prediction


@app.route('/regression-mlp', methods=['POST'])
def post_regression_mlp():
    feature_values = pd.json_normalize([json.loads(request.form['feature_values'])])
    prediction = regression_mlp.predict(feature_values)
    return prediction


@app.route('/players', methods=['GET'])
def get_players():
    command = """
    SELECT row_to_json(players.*)
      FROM players
     ORDER BY players.last_name
    """
    players_raw = select_data(command)
    players = []
    for player in players_raw:
        players.append({
            'firstName': player['first_name'],
            'lastName': player['last_name'],
            'jerseyNumber': player['primary_number'],
            'birthDate': player['birth_date'],
            'nationality': player['nationality'],
            'height': player['height'],
            'weight': player['weight'],
            'isAlternateCaptain': player['is_alternate_captain'],
            'isCaptain': player['is_captain'],
            'isRookie': player['is_rookie'],
            'shootsCatches': player['shoots_catches'],
            'primaryPosition': player['primary_position'],
            'imageLink': player['image_link']
        })
    return json.dumps(players)


@app.route('/season-stats', methods=['GET'])
def get_season_stats():
    command = """
    SELECT row_to_json(season_stats.*)
      FROM season_stats
     ORDER BY season_stats.season_id
    """
    season_stats_raw = select_data(command)
    season_stats = []
    for season in season_stats_raw:
        season_stats.append({
            'season': season['season_id'],
            'gamesPlayed': season['games_played'],
            'wins': season['wins'],
            'losses': season['losses'],
            'overtime': season['overtime'],
            'points': season['points'],
            'goalsPerGame': season['goals_per_game'],
            'goalsAgainstPerGame': season['goals_against_per_game'],
            'evGGARatio': season['ev_gga_ratio'],
            'powerPlayPercentage': season['power_play_percentage'],
            'powerPlayGoals': season['power_play_goals'],
            'powerPlayGoalsAgainst': season['power_play_goals_against'],
            'powerPlayOpportunities': season['power_play_opportunities'],
            'penaltyKillPercentage': season['penalty_kill_percentage'],
            'shotsPerGame': season['shots_per_game'],
            'shotsAllowedPerGame': season['shots_allowed_per_game'],
            'winScoreFirst': season['win_score_first'],
            'winOppScoreFirst': season['win_opp_score_first'],
            'winLeadFirstPer': season['win_lead_first_per'],
            'winLeadSecondPer': season['win_lead_second_per'],
            'winOutshootOpp': season['win_outshoot_opp'],
            'winOutshotByOpp': season['win_outshot_by_opp'],
            'faceoffsTaken': season['faceoffs_taken'],
            'faceoffsLost': season['faceoffs_lost'],
            'faceoffsWon': season['faceoffs_won'],
        })
    return json.dumps(season_stats)


if __name__ == '__main__':
    classification_svm = pickle.load(open('models/classification_pipeline_svm.pkl', 'rb'))
    classification_rf = pickle.load(open('models/classification_pipeline_rf.pkl', 'rb'))
    regression_en = pickle.load(open('models/regression_pipeline_en.pkl', 'rb'))
    regression_mlp = pickle.load(open('models/regression_pipeline_mlp.pkl', 'rb'))
    app.run(debug=True)
