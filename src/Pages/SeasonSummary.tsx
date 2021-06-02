import Spacer from "../Shared/Spacer";
import { SeasonSummaryType } from "../types";

type Props = {
  seasonStats: SeasonSummaryType;
};

const SeasonSummary = (props: Props) => {
  if (props.seasonStats !== null) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            fontWeight: "lighter",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Years:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.season}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Number of Games Played:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.gamesPlayed}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Total Wins:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.wins}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Total Losses:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.losses}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Total Overtime Games:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.overtime}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Total Points:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.points}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Average Goals per Game:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.goalsPerGame}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Average Goals Against per Game:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.goalsAgainstPerGame}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>EV-GGA Ratio:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.evGGARatio}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Power Play Percentage:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.powerPlayPercentage}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Total Power Play Goals:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.powerPlayGoals}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Total Power Play Goals Against:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.powerPlayGoalsAgainst}</div>
          </div>
        </div>
        <Spacer type="column" size="medium" />
        <div
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            fontWeight: "lighter",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Total Power Play Opportunities:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.powerPlayOpportunities}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Penalty Kill Percentage:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.penaltyKillPercentage}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Average Shots per Game:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.shotsPerGame}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Average Shots Allowed per Game:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.shotsAllowedPerGame}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Number of Wins (Scored First):</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.winScoreFirst}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Number of Wins (Opponent Scored First):</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.winOppScoreFirst}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Number of Wins (First Period Lead):</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.winLeadFirstPer}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Number of Wins (Second Period Lead):</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.winLeadSecondPer}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Number of Wins (Outshot Opponent):</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.winOutshootOpp}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Number of Wins (Outshot By Opponent):</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.winOutshotByOpp}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Number of Faceoffs Won:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.faceoffsWon}</div>
          </div>
          <Spacer type="row" size="small" />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>Number of Faceoffs Lost:</div>
            <Spacer type="column" size="small" />
            <div>{props.seasonStats.faceoffsLost}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

export default SeasonSummary;
