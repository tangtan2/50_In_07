import pandas as pd
import config_tanya.scraper_header as header
import config_tanya.header

# Get team names
baseurl = 'https://www.hockey-reference.com'
date = '082419'
teams_short = header.import_shortnames(baseurl)

# Connect to MySQL
mydb, mycursor = config_tanya.header.connect_db('50_In_07')

# Create tables for each team
team_folder = f'/Users/tanyatang/Documents/Code/Python/50_In_07/data_tanya/data_raw/{date}/'
for team in teams_short:

    # Parse data using pandas
    filename = team_folder + team + ".xlsx"
    summarydata = pd.read_excel(filename, sheet_name='overall_info')
    rosterdata = pd.read_excel(filename, sheet_name='current_roster')

    # Create table in SQL
    mycursor.execute(f"""
    CREATE TABLE {team} (
    season_start YEAR NOT NULL,
    games_played INT NOT NULL,
    wins INT,
    losses INT,
    ties INT,
    overtime_losses INT,
    points INT NOT NULL,
    points_percentage DECIMAL(10, 3) NOT NULL,
    simple_rating_system DECIMAL(10, 2) NOT NULL,
    strength_of_schedule DECIMAL(10, 2) NOT NULL,
    finish VARCHAR(15))
    """)

    # Iterate through each season and add entry to table
    for i, season in enumerate(summarydata['Season']):
        currentseason = int(season[0:4])
        if currentseason < 2010:
            break
        if not summarydata.isna()['GP'][i]:
            wins = summarydata['W'][i] if not summarydata.isna()['W'][i] else 0
            losses = summarydata['L'][i] if not summarydata.isna()['L'][i] else 0
            ties = summarydata['T'][i] if not summarydata.isna()['T'][i] else 0
            otlosses = summarydata['OL'][i] if not summarydata.isna()['OL'][i] else 0
            mycursor.execute(f"""
            INSERT INTO {team} VALUES ({currentseason},
            {summarydata['GP'][i]},
            {wins},
            {losses},
            {ties},
            {otlosses},
            {summarydata['PTS'][i]},
            {summarydata['PTS%'][i]},
            {summarydata['SRS'][i]},
            {summarydata['SOS'][i]},
            '{summarydata['Finish'][i]}')
            """)

    # Print completion message
    print(f'{team} completed')

# Create tables for each player
team_players, goalies = config_tanya.header.get_team_players(baseurl, date)
player_folder = team_folder + "/players/"
for team in teams_short:
    for player in team_players[team]:

        # Parse data using pandas
        filename = player_folder + player + ".xlsx"

        if player not in goalies[team]:
            try:
                standard_data = pd.read_excel(filename, sheet_name='standard', skiprows=1, mangle_dupe_cols=True)
                standard_data.fillna(0, inplace=True)

                # Create table in SQL
                mycursor.execute(f"""
                CREATE TABLE {player} (
                season_start YEAR NOT NULL,
                team CHAR(3) NOT NULL,
                games_played INT NOT NULL,
                goals INT,
                assists INT,
                points INT,
                penalties_in_min INT,
                even_strength_goals INT,
                power_play_goals INT,
                short_handed_goals INT,
                even_strength_assists INT,
                power_play_assists INT,
                short_handed_assists INT,
                shots_on_goal INT,
                shooting_percent DECIMAL(5, 1),
                shots_attempted INT,
                time_on_ice INT,
                avg_time_on_ice TIME(0),
                faceoff_wins INT,
                faceoff_losses INT,
                blocks_even_strength INT,
                hits_even_strength INT,
                takeaways INT,
                giveaways INT)
                """)

                # Iterate through each season and add entry to table
                i = 0
                while True:
                    if int(standard_data['Season'][i][0:4]) < 2010:
                        i += 1
                        continue
                    else:
                        year = standard_data['Season'][i][0:4]
                        mycursor.execute(f"""INSERT INTO {player} VALUES ({year},
                                        '{standard_data['Tm'][i]}',
                                        {standard_data['GP'][i]},
                                        {standard_data['G'][i]},
                                        {standard_data['A'][i]},
                                        {standard_data['PTS'][i]},
                                        {standard_data['PIM'][i]},
                                        {standard_data['EV'][i]},
                                        {standard_data['PP'][i]},
                                        {standard_data['SH'][i]},
                                        {standard_data['EV.1'][i]},
                                        {standard_data['PP.1'][i]},
                                        {standard_data['SH.1'][i]},
                                        {standard_data['S'][i]},
                                        {standard_data['S%'][i]},
                                        {standard_data['TSA'][i]},
                                        {standard_data['TOI'][i]},
                                        '{standard_data['ATOI'][i] + ':00'}',
                                        {standard_data['FOW'][i]},
                                        {standard_data['FOL'][i]},
                                        {standard_data['BLK'][i]},
                                        {standard_data['HIT'][i]},
                                        {standard_data['TK'][i]},
                                        {standard_data['GV'][i]})
                                        """)
                        i += 1
                    if int(standard_data['Age'][i]) == 0:
                        print(f'{player} completed')
                        break

            except Exception as e:
                print(e)
        else:
            try:
                standard_data = pd.read_excel(filename, sheet_name='standard', skiprows=1, mangle_dupe_cols=True)
                standard_data.fillna(0, inplace=True)

                # Create table in SQL
                mycursor.execute(f"""
                    CREATE TABLE {player} (
                    season_start YEAR NOT NULL,
                    team CHAR(3) NOT NULL,
                    games_played INT NOT NULL,
                    games_started INT,
                    wins INT,
                    losses INT,
                    ties_and_ot_and_shootout INT,
                    goals_against INT,
                    shots_against INT,
                    saves INT,
                    save_percent DECIMAL(10, 3),
                    goals_against_avg DECIMAL(10, 2),
                    shutouts INT,
                    minutes INT,
                    quality_starts INT,
                    quality_start_percent DECIMAL(10, 3),
                    really_bad_starts INT,
                    goals_against_percent INT,
                    goals_saved_above_avg DECIMAL(10, 2),
                    adjusted_goals_against_avg DECIMAL(10, 2),
                    goalie_point_shares DECIMAL(10, 2),
                    goals INT,
                    assists INT,
                    points INT,
                    penalties_in_min INT)
                    """)

                # Iterate through each season and add entry to table
                i = 0
                while True:
                    if int(standard_data['Season'][i][0:4]) < 2010:
                        i += 1
                        continue
                    else:
                        year = standard_data['Season'][i][0:4]
                        mycursor.execute(f"""INSERT INTO {player} VALUES ({year},
                                            '{standard_data['Tm'][i]}',
                                            {standard_data['GP'][i]},
                                            {standard_data['GS'][i]},
                                            {standard_data['W'][i]},
                                            {standard_data['L'][i]},
                                            {standard_data['T/O'][i]},
                                            {standard_data['GA'][i]},
                                            {standard_data['SA'][i]},
                                            {standard_data['SV'][i]},
                                            {standard_data['SV%'][i]},
                                            {standard_data['GAA'][i]},
                                            {standard_data['SO'][i]},
                                            {standard_data['MIN'][i]},
                                            {standard_data['QS'][i]},
                                            {standard_data['QS%'][i]},
                                            {standard_data['RBS'][i]},
                                            {standard_data['GA%-'][i]},
                                            {standard_data['GSAA'][i]},
                                            {standard_data['GAA.1'][i]},
                                            {standard_data['GPS'][i]},
                                            {standard_data['G'][i]},
                                            {standard_data['A'][i]},
                                            {standard_data['PTS'][i]},
                                            {standard_data['PIM'][i]})
                                            """)
                        i += 1
                    if int(standard_data['Age'][i]) == 0:
                        print(f'{player} completed')
                        break

            except Exception as e:
                print(e)

# Diconnect from MySQL
config_tanya.header.disconnect_db(mydb, mycursor)
