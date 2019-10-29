from config_tanya.config import ScraperConfig
import config_tanya.scraper_header as header
from config_tanya.scraper import scrape1
import os

# Set config object
baseurl = 'https://www.hockey-reference.com'
date = '101219'
config1 = ScraperConfig()
config1.setconfig(baseurl, date)

# Get team names
teams_short = header.import_shortnames(config1)
teams_long = header.import_longnames(config1)

# Create team urls
teams_url = []
for team in teams_short:
    url = baseurl + '/teams/' + team + '/history.html'
    teams_url.append(url)

# Get team info
os.mkdir(config1.dest)
os.mkdir(config1.dest + 'players/')
for url, name in zip(teams_url, teams_short):
    scrape1(config1, url, name)
