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
  fullName: string;
  primaryPosition: string;
  opposingTeam: string;
  periodType: string;
  xCoordinate: number;
  yCoordinate: number;
  goalRatio: number;
};

export type ClassificationPrediction = {};

export type PostRegressionType = {
  gameType: string;
  opposingTeam: string;
  homeOrAway: string;
  fullName: string;
  primaryPosition: string;
};

export type RegressionPrediction = {};
