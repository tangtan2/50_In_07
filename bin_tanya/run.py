from config_tanya.config import Config
import bin_tanya.header as header
from bin_tanya.hockey_reference_scraper import scrape1
import os

script_name = 'hockey_reference_scraper'
baseurl = 'https://www.hockey-reference.com'
date = '082419'
config1 = Config()
config1.setconfig(script_name, baseurl, date)

# Get team names
teams_short = header.import_shortnames(config1)
teams_long = header.import_longnames(config1)

# Create team urls
teams_url = []
for team in teams_short:
    url = baseurl + '/teams/' + team
    teams_url.append(url)

# Get team info
os.mkdir(config1.dest)
os.mkdir(config1.dest + 'players/')
for url, name in zip(teams_url, teams_short):
    if config1.script_name == 'hockey_reference_scraper':
        scrape1(config1, url, name)
