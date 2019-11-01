import mysql.connector
import pandas as pd
from config_tanya.scraper_header import import_shortnames


# Connect to MySQL
def connect_db(database):
    mydb = mysql.connector.connect(host='Tanyas-MacBook-Pro.local',
                                   user='root',
                                   password='56819230',
                                   database=database,
                                   auth_plugin='mysql_native_password')
    mycursor = mydb.cursor(buffered=True)
    return mydb, mycursor


# Disconnect from MySQL
def disconnect_db(mydb, mycursor):
    mydb.commit()
    mycursor.close()
    mydb.close()


# Get team players
def get_team_players(baseurl, date):
    team_names = import_shortnames(baseurl)
    team_players = {}
    goalies = {}
    team_folder = f'/Users/tanyatang/Documents/Code/Python/50_In_07/data_tanya/data_raw/{date}/'
    for team in team_names:
        filename = team_folder + team + ".xlsx"
        rosterdata = pd.read_excel(filename, sheet_name='current_roster')
        team_players[team] = [rosterdata['Player'][i].replace(' ', '_').replace('-', '_').replace('.', '').replace("'", '') for i in range(len(rosterdata['Player']))]
        goalies[team] = []
        for i in range(len(rosterdata['Pos'])):
            if rosterdata['Pos'][i] == 'G':
                goalies[team].append(rosterdata['Player'][i].replace(' ', '_').replace('-', '_').replace('.', '').replace("'", ''))
    return team_players, goalies
