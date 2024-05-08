import {
  RawRequest,
  RawListRequest,
  RawValidationRequest,
  RawValidationListRequest,
  RawValidationStatsRequest,
  StatsRequest,
} from "./models";

const headers = new Headers();
headers.append("Content-Type", "application/json");

const request = (url, method, model) => {
  return async (params, options = {}) => {
    fetch(url, {
      method: method,
      headers,
      body: new model(params).toJSON(),
    })
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          options.onSuccess && options.onSuccess(result);
        },
        (error) => {
          options.onError && options.onError(error);
        },
      );
  };
};

const API = (url) => {
  const API_URL =
    url || process.env.REACT_APP_UNDERPASS_API || "http://localhost:8000";
  return {
    raw: {
      polygons: request(`${API_URL}/raw/polygons`, "POST", RawRequest),
      nodes: request(`${API_URL}/raw/nodes`, "POST", RawRequest),
      lines: request(`${API_URL}/raw/lines`, "POST", RawRequest),
      features: request(`${API_URL}/raw/features`, "POST", RawRequest),
      list: request(`${API_URL}/raw/list`, "POST", RawListRequest),
      polygonsList: request(
        `${API_URL}/raw/polygons/list`,
        "POST",
        RawListRequest,
      ),
      nodesList: request(`${API_URL}/raw/nodes/list`, "POST", RawListRequest),
      linesList: request(`${API_URL}/raw/lines/list`, "POST", RawListRequest),
    },

    rawValidation: {
      polygons: request(
        `${API_URL}/raw-validation/polygons`,
        "POST",
        RawValidationRequest,
      ),
      nodes: request(
        `${API_URL}/raw-validation/nodes`,
        "POST",
        RawValidationRequest,
      ),
      lines: request(
        `${API_URL}/raw-validation/lines`,
        "POST",
        RawValidationRequest,
      ),
      features: request(
        `${API_URL}/raw-validation/features`,
        "POST",
        RawValidationRequest,
      ),
      list: request(
        `${API_URL}/raw-validation/list`,
        "POST",
        RawValidationListRequest,
      ),
      polygonsList: request(
        `${API_URL}/raw-validation/polygons/list`,
        "POST",
        RawValidationListRequest,
      ),
      nodesList: request(
        `${API_URL}/raw-validation/nodes/list`,
        "POST",
        RawValidationListRequest,
      ),
      linesList: request(
        `${API_URL}/raw-validation/lines/list`,
        "POST",
        RawValidationListRequest,
      ),
      stats: request(
        `${API_URL}/raw-validation/stats`,
        "POST",
        RawValidationStatsRequest,
      ),
      statsNodes: request(
        `${API_URL}/raw-validation/stats/nodes`,
        "POST",
        RawValidationStatsRequest,
      ),
      statsPolygons: request(
        `${API_URL}/raw-validation/stats/polygons`,
        "POST",
        RawValidationStatsRequest,
      ),
      statsLines: request(
        `${API_URL}/raw-validation/stats/lines`,
        "POST",
        RawValidationStatsRequest,
      ),
    },

    stats: {
      polygons: request(`${API_URL}/stats/polygons`, "POST", StatsRequest),
      nodes: request(`${API_URL}/stats/nodes`, "POST", StatsRequest),
      lines: request(`${API_URL}/stats/lines`, "POST", StatsRequest),
      features: request(`${API_URL}/stats/features`, "POST", StatsRequest),
    },
  };
};

export default API;
