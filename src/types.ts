export type PlayerSummaryType = {
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  birthDate: string;
  nationality: string;
  height: string;
  weight: number;
  isAlternateCaptain: boolean;
  isCaptain: boolean;
  isRookie: boolean;
  shootsCatches: string;
  primaryPosition: string;
  imageLink: string;
} | null;

export type SeasonSummaryType = {
  season: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  overtime: number;
  points: number;
  goalsPerGame: number;
  goalsAgainstPerGame: number;
  evGGARatio: number;
  powerPlayPercentage: number;
  powerPlayGoals: number;
  powerPlayGoalsAgainst: number;
  powerPlayOpportunities: number;
  penaltyKillPercentage: number;
  shotsPerGame: number;
  shotsAllowedPerGame: number;
  winScoreFirst: number;
  winOppScoreFirst: number;
  winLeadFirstPer: number;
  winLeadSecondPer: number;
  winOutshootOpp: number;
  winOutshotByOpp: number;
  faceoffsTaken: number;
  faceoffsLost: number;
  faceoffsWon: number;
} | null;

export type PostClassificationType = {
  full_name: string;
  height: number;
  weight: number;
  primary_position: string;
  opposing_team: string;
  period_type: string;
  x_coordinate: number;
  y_coordinate: number;
  goal_ratio: number;
};

export type ClassificationPrediction = {
  playerType: "Scorer" | "Shooter";
};

export type PostRegressionType = {
  game_type: string;
  height: number;
  weight: number;
  opposing_team: string;
  home_or_away: string;
  full_name: string;
  primary_position: string;
};

export type RegressionPrediction = {
  goals: number;
};
