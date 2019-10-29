import pandas as pd
from config_tanya.config import ScraperConfig
import config_tanya.scraper_header as header
import config_tanya.header

# Set config object
baseurl = 'https://www.hockey-reference.com'
date = '082419'
config1 = ScraperConfig()
config1.setconfig(baseurl, date)

# Get team names
teams_short = header.import_shortnames(config1)

# Connect to MySQL
mydb, mycursor = config_tanya.header.connect_db()

# Create dictionary to hold team players
team_players = {}

# Create tables for each team
team_folder = f'/Users/tanyatang/Documents/Code/Python/50_In_07/data_tanya/data_raw/{date}/'
for team in teams_short:
    filename = team_folder + team + ".xlsx"

    # Parse data using pandas
    summarydata = pd.read_excel(filename, sheet_name='overall_info')
    rosterdata = pd.read_excel(filename, sheet_name='current_roster')
    team_players[team] = [rosterdata['Player'][i] for i in range(len(rosterdata['Player']))]

    # Create table in SQL

# Create tables for each player
player_folder = team_folder + "/players/"
for team in teams_short:
    for player in team_players[team]:
        filename = player_folder + player + ".xlsx"

        # Parse data using pandas

        # Create table in SQL

# Diconnect from MySQL
config_tanya.header.disconnect_db(mydb, mycursor)
