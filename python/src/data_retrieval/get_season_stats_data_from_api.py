import requests
from connect_to_db import create_connection, close_and_commit_connection, execute_sql, execute_sql_with_return
from config import get_config

if __name__ == "__main__":
    config = get_config()
    connection = create_connection()
    existing_seasons = execute_sql_with_return(connection,
                                               "SELECT row_to_json(seasons.*)"
                                               "  FROM seasons")
    season_ids = list(map(lambda x: x[0]['id'], existing_seasons))
    for season in season_ids:
        season_data = requests.get(config["api_url"] + f"/teams/10/stats?season={season}")
        if season_data.status_code == 200:
            season_data = season_data.json()['stats'][0]['splits'][0]['stat']
            execute_sql(connection,
                        "INSERT INTO season_stats"
                        f"    VALUES ({season}"
                        f"         , {season_data['gamesPlayed']}"
                        f"         , {season_data['wins']}"
                        f"         , {season_data['losses']}"
                        f"         , {season_data['ot']}"
                        f"         , {season_data['pts']}"
                        f"         , {season_data['goalsPerGame']}"
                        f"         , {season_data['goalsAgainstPerGame']}"
                        f"         , {season_data['evGGARatio']}"
                        f"         , {season_data['powerPlayPercentage']}"
                        f"         , {season_data['powerPlayGoals']}"
                        f"         , {season_data['powerPlayGoalsAgainst']}"
                        f"         , {season_data['powerPlayOpportunities']}"
                        f"         , {season_data['penaltyKillPercentage']}"
                        f"         , {season_data['shotsPerGame']}"
                        f"         , {season_data['shotsAllowed']}"
                        f"         , {season_data['winScoreFirst']}"
                        f"         , {season_data['winOppScoreFirst']}"
                        f"         , {season_data['winLeadFirstPer']}"
                        f"         , {season_data['winLeadSecondPer']}"
                        f"         , {season_data['winOutshootOpp']}"
                        f"         , {season_data['winOutshotByOpp']}"
                        f"         , {season_data['faceOffsTaken']}"
                        f"         , {season_data['faceOffsLost']}"
                        f"         , {season_data['faceOffsWon']})")
    close_and_commit_connection(connection)
