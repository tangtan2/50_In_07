from config_tanya.header import connect_db, disconnect_db
from mysql.connector import Error
from sklearn.exceptions import ConvergenceWarning
import sklearn.linear_model as sk
import warnings
from config_tanya.header import import_shortnames, get_team_players
import numpy as np

# Get training data
baseurl = 'https://www.hockey-reference.com'
mydb, mycursor = connect_db('50_In_07')
team_id = {}  # Mapping team names to an integer id value
names = import_shortnames(baseurl)
for i, name in enumerate(names):
    team_id[name] = i + 1
mycursor.execute("""SHOW TABLES LIKE '%games'""")
player_tables = []
for line in mycursor.fetchall():
    player_tables.append(line[0])
print('Got table names')
player_names = {}  # Mapping actual player names to their ids
mycursor.execute("""SELECT * FROM player_id""")
results = mycursor.fetchall()
for line in results:
    player_names[line[1]] = line[0]
print('Got player id to name mappings')
player_features = {}  # Hold training features
player_goals = {}  # Hold predicted variable
player_pom = {}  # Hold predicted variable
goalie_goals_against = {}  # Hold predicted variable
for player in player_tables:
    player_id = player[0:-6]
    features = []
    mycursor.execute(f"""SELECT player_team, opposing_team, year FROM {player}""")
    results = mycursor.fetchall()
    for line in results:
        features.append([team_id[line[0]], team_id[line[1]], line[2]])
    player_features[player_id] = features
    mycursor.execute(f"""SHOW COLUMNS FROM {player} LIKE 'goals'""")
    if mycursor.fetchone():
        try:
            goals = []
            pom = []
            mycursor.execute(f"""SELECT goals FROM {player}""")
            results = mycursor.fetchall()
            for line in results:
                goals.append(line[0])
            player_goals[player_id] = goals
            mycursor.execute(f"""SELECT penalties_in_min FROM {player}""")
            results = mycursor.fetchall()
            for line in results:
                pom.append(line[0])
            player_pom[player_id] = pom
        except Exception as e:
            print(e)
    else:
        try:
            goals_against = []
            pom = []
            mycursor.execute(f"""SELECT goals_against FROM {player}""")
            results = mycursor.fetchall()
            for line in results:
                goals_against.append(line[0])
            goalie_goals_against[player_id] = goals_against
            mycursor.execute(f"""SELECT penalties_in_min FROM {player}""")
            results = mycursor.fetchall()
            for line in results:
                pom.append(line[0])
            player_pom[player_id] = pom
        except Exception as e2:
            print(e2)
print('Got player training data')

# Close database
disconnect_db(mydb, mycursor)

# Ignore convergence warning
warnings.filterwarnings(action='ignore', category=ConvergenceWarning)

# Stochastic gradient descent
models = {}
for player in player_tables:
    player_id = player[0:-6]
    if len(player_features[player_id]) > 20 and player_id in player_goals:
        if len(np.unique(player_goals[player_id])) > 1:
            try:
                model = sk.SGDClassifier()
                model.fit(player_features[player_id], player_goals[player_id])
                models[player_id] = model
            except Error as e:
                print(e)
print('Models trained')

# Test model prediction
print('Sample prediction...')
test_player = input('Enter test player: ')
test_id = ''
test_year = 2019
players_by_team, goalies_by_team = get_team_players(baseurl, test_year)
for player_id in player_names:
    if player_names[player_id] == test_player:
        test_id = player_id
        break
if test_id in models:
    test_team = ''
    for team in players_by_team:
        if test_id in players_by_team[team]:
            test_team = team
            break
    test_opponent = input('Enter test opposing team: ')
    prediction = models[test_id].predict(np.array([team_id[test_team], team_id[test_opponent],
                                                   test_year]).reshape(1, -1))
    print(f'{player_names[test_id]} is predicted to score {prediction[0]} goals in 2019 on'
          f' {test_team} against {test_opponent}')
else:
    print(f'{player_names[test_id]} does not have adequate training data to fit a model')
