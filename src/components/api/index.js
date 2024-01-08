const headers = new Headers();
headers.append("Content-Type", "application/json");

// Send request to the Underpass API
const API = (url) => {
  const API_URL =
    url ||
    process.env.REACT_APP_UNDERPASS_API ||
    "https://underpass.hotosm.org:8000";
  return {

    raw: async (
      area,
      tags,
      hashtag,
      dateFrom,
      dateTo,
      status,
      featureType,
      options = {},
    ) => {
      fetch(`${API_URL}/raw/features`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          area,
          tags,
          hashtag,
          dateFrom,
          dateTo,
          status,
          featureType,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then(
          (result) => {
            if (result.features == null) {
              result.features = [];
            }
            options.onSuccess && options.onSuccess(result);
          },
          (error) => {
            options.onError && options.onError(error);
          },
        );
    },

    rawList: async (
      area,
      tags,
      hashtag,
      dateFrom,
      dateTo,
      status,
      featureType,
      page,
      orderBy,
      options = {},
    ) => {
      fetch(API_URL + "/raw/list", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          area,
          tags,
          hashtag,
          dateFrom,
          dateTo,
          status,
          featureType,
          page,
          orderBy,
        }),
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
    },

    statsCount: async (
      area,
      tags,
      hashtag,
      dateFrom,
      dateTo,
      status,
      featureType,
      options = {},
    ) => {
      fetch(API_URL + "/stats/count", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          area,
          tags,
          hashtag,
          dateFrom,
          dateTo,
          status,
          featureType,
        }),
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
    },

  };
};

export default API;
