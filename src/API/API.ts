import {
  ClassificationPrediction,
  PlayerSummaryType,
  PostClassificationType,
  PostRegressionType,
  RegressionPrediction,
  SeasonSummaryType,
} from "../types";

export default class API {
  private _getEndpoint = async (endpoint: string): Promise<any> => {
    const baseURL = process.env.REACT_APP_API_URL;
    const fullURL = baseURL + endpoint;
    const response = await fetch(fullURL, {
      method: "GET",
    });
    if (response.status !== 200) {
      const json = await response.json();
      throw json;
    }
    const json = await response.json();
    return json;
  };

  private _postEndpoint = async (
    endpoint: string,
    body: object
  ): Promise<any> => {
    const baseURL = process.env.REACT_APP_API_URL;
    const fullURL = baseURL + endpoint;
    const response = await fetch(fullURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.status !== 200) {
      const json = await response.json();
      throw json;
    }
    return await response.json();
  };

  public getPlayers = (): Promise<PlayerSummaryType[]> => {
    return this._getEndpoint("/players");
  };

  public getSeasonStats = (): Promise<SeasonSummaryType[]> => {
    return this._getEndpoint("/season-stats");
  };

  public postClassificationSVM = (
    data: PostClassificationType
  ): Promise<ClassificationPrediction> => {
    return this._postEndpoint("/classification-svm", data);
  };

  public postClassificationRF = (
    data: PostClassificationType
  ): Promise<ClassificationPrediction> => {
    return this._postEndpoint("/classification-rf", data);
  };

  public postRegressionEN = (
    data: PostRegressionType
  ): Promise<RegressionPrediction> => {
    return this._postEndpoint("/regression-en", data);
  };

  public postRegressionMLP = (
    data: PostRegressionType
  ): Promise<RegressionPrediction> => {
    return this._postEndpoint("/regression-mlp", data);
  };
}
