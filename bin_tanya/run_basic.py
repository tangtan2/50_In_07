from config_tanya.header import connect_db, disconnect_db, get_team_players
from config_tanya.scraper_header import import_shortnames
from mysql.connector import Error
from sklearn.exceptions import ConvergenceWarning
import sklearn.linear_model as sk
import warnings
import numpy as np

# Get training data
baseurl = 'https://www.hockey-reference.com'
date = '082419'
mydb, mycursor = connect_db('50_In_07')
team_names = import_shortnames(baseurl)
team_players, goalies = get_team_players(baseurl, date)
player_years = []
player_goals = []
player_assists = []
player_pom = []
for team in team_names:
    team_years = []
    team_goals = []
    team_assists = []
    team_pom = []
    for player in team_players[team]:
        tempy = []
        tempg = []
        tempa = []
        tempp = []
        try:
            mycursor.execute(f"""SELECT * FROM {player}""")
            results = mycursor.fetchall()
            years = [results[i][0] for i in range(len(results))]
            years = np.unique(years)
            tempy = years
            for year in years:
                g = 0
                a = 0
                p = 0
                for line in results:
                    if line[0] == year:
                        g += line[3]
                        a += line[4]
                        p += line[6]
                tempg.append(g)
                tempa.append(a)
                tempp.append(p)
        except Error as e:
            print(f'{player} has no information available')
        finally:
            team_years.append(tempy)
            team_goals.append(tempg)
            team_assists.append(tempa)
            team_pom.append(tempp)
    player_years.append(team_years)
    player_goals.append(team_goals)
    player_assists.append(team_assists)
    player_pom.append(team_pom)

# Close database
disconnect_db(mydb, mycursor)

# Ignore convergence warning
warnings.filterwarnings(action='ignore', category=ConvergenceWarning)

# Stochastic gradient descent
for i, team in enumerate(team_names):
    for j, player in enumerate(team_players[team]):
        if len(player_years[i][j]) > 1 and len(np.unique(player_goals[i][j])) > 1:
            clf = sk.SGDClassifier(loss='hinge', penalty='l2')
            clf.fit(player_years[i][j].reshape(-1, 1), player_goals[i][j])
            goals_predicted = clf.predict(np.array([2019]).reshape(-1, 1))
            print(f'{player} is predicted to score {goals_predicted[0]} goals in 2019')
            if ConvergenceWarning:
                print(player_years[i][j])
                print(player_goals[i][j])
                print(f'{player} did not converge within 1000 iterations\n')
