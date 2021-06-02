import Spacer from "../Shared/Spacer";
import { PlayerSummaryType } from "../types";

type Props = {
  playerStats: PlayerSummaryType;
};

const PlayerSummary = (props: Props) => {
  if (props.playerStats !== null) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              padding: "10px",
            }}
          >
            <img
              style={{
                borderRadius: "5px",
                boxShadow: "2px 2px 1px 0.5px #1b4f72",
              }}
              width="230px"
              src={props.playerStats.imageLink}
              alt="Player"
            />
          </div>
          <Spacer type="column" size="large" />
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
              <div>First Name:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.firstName}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Last Name:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.lastName}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Jersey Number:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.jerseyNumber}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Primary Position:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.primaryPosition}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Shoots/Catches:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.shootsCatches}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Birth Date:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.birthDate}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Nationality:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.nationality}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Height:</div>
              <Spacer type="column" size="small" />
              <div>
                {props.playerStats.height.split("-")[0] +
                  "' " +
                  props.playerStats.height.split("-")[1] +
                  '"'}
              </div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Weight (lbs):</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.weight}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Is Captain:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.isCaptain.toString()}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Is Alternate Captain:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.isAlternateCaptain.toString()}</div>
            </div>
            <Spacer type="row" size="small" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div>Is Rookie:</div>
              <Spacer type="column" size="small" />
              <div>{props.playerStats.isRookie.toString()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

export default PlayerSummary;
