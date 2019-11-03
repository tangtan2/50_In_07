import mysql.connector
import urllib.request
from bs4 import BeautifulSoup


# Get short form names
def import_shortnames(baseurl):
    teamnames = []
    url = baseurl + '/teams/'
    page = urllib.request.urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    franchisetable = soup.find('table', {'class': 'sortable stats_table'}, id='active_franchises')
    for row in franchisetable.findAll('tr'):
        columns = row.findAll('th')
        for item in columns:
            if item.find(text=True) and item['class'][0] == 'left':
                teamnames.append(item.find(href=True)['href'][7:10])
    teamnames.remove('PHX')
    teamnames.append('ARI')
    return teamnames


# Get long form names
def import_longnames(baseurl):
    teamnames = []
    url = baseurl + '/teams/'
    page = urllib.request.urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    franchisetable = soup.find('table', {'class': 'sortable stats_table'}, id='active_franchises')
    for row in franchisetable.findAll('tr'):
        columns = row.findAll('th')
        for item in columns:
            if item.find(text=True) and item['class'][0] == 'left':
                teamnames.append(item.find(text=True))
    return teamnames


# Get team players
def get_team_players(baseurl, currentyear):
    team_names = import_shortnames(baseurl)
    team_players = {}
    goalies = {}
    for team in team_names:
        url = baseurl + f'/teams/{team}/{currentyear}.html'
        page = urllib.request.urlopen(url)
        soup = BeautifulSoup(page, 'html.parser')
        rostertable = soup.find('table', {'class': 'sortable stats_table'}, id='roster')
        team_players[team] = []
        goalies[team] = []
        for line in rostertable.findAll('tr'):
            try:
                name = line.findAll('td')[0].get('data-append-csv').replace('.', '')
                team_players[team].append(name)
                if line.findAll('td')[2].find(text=True) == 'G':
                    goalies[team].append(name)
            except:
                pass
    return team_players, goalies


# Connect to MySQL
def connect_db(database):
    print('Connecting to SQL database...')
    mydb = mysql.connector.connect(user='root',
                                   password='56819230',
                                   database=database,
                                   auth_plugin='mysql_native_password')
    mycursor = mydb.cursor(buffered=True)
    print('Connected to SQL database')
    return mydb, mycursor


# Disconnect from MySQL
def disconnect_db(mydb, mycursor):
    print('Committing database changes...')
    mydb.commit()
    print('Disconnecting from SQL database...')
    mycursor.close()
    mydb.close()
    print('Disconnected from SQL database')
