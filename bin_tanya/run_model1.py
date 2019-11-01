from config_tanya.header import connect_db, disconnect_db, get_team_players
from config_tanya.scraper_header import import_shortnames
from mysql.connector import Error
from sklearn.exceptions import ConvergenceWarning
import sklearn.linear_model as sk
import warnings
import numpy as np

# Get training data
baseurl = 'https://www.hockey-reference.com'
mydb, mycursor = connect_db('50_In_07')
mycursor.execute("""SHOW TABLES LIKE '%_%'""")
player_tables = []
for line in mycursor.fetchall():
    player_tables.append(line[0])

# Close database
disconnect_db(mydb, mycursor)

# Ignore convergence warning
warnings.filterwarnings(action='ignore', category=ConvergenceWarning)

# Stochastic gradient descent
