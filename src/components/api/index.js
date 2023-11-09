const headers = new Headers();
headers.append("Content-Type", "application/json");

// Send request to the Underpass API
const API = (url) => {
  const API_URL =
    url ||
    process.env.REACT_APP_UNDERPASS_API ||
    "https://underpass.hotosm.org:8000";
  return {
    reportDataQualityTag: async (
      fromDate,
      toDate,
      hashtags,
      page = 0,
      options = {},
    ) => {
      fetch(`${API_URL}/report/dataQualityTag`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fromDate,
          toDate,
          hashtags,
          page,
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

    reportDataQualityTagCSV: async (
      fromDate,
      toDate,
      hashtags = [],
      page = 0,
      options = {},
    ) => {
      fetch(`${API_URL}/report/dataQualityTag/csv`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fromDate,
          toDate,
          hashtags,
          page,
        }),
      })
        .then((res) => {
          return res.text();
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

    reportDataQualityGeo: async (
      fromDate,
      toDate,
      hashtags = [],
      page = 0,
      options = {},
    ) => {
      fetch(`${API_URL}/report/dataQualityGeo`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fromDate,
          toDate,
          hashtags,
          page,
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

    reportDataQualityGeoCSV: async (
      fromDate,
      toDate,
      hashtags = [],
      page = 0,
      options = {},
    ) => {
      fetch(`${API_URL}/report/dataQualityGeo/csv`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fromDate,
          toDate,
          hashtags,
          page,
        }),
      })
        .then((res) => {
          return res.text();
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

    reportDataQualityTagStats: async (
      fromDate,
      toDate,
      hashtags = [],
      page = 0,
      options = {},
    ) => {
      fetch(`${API_URL}/report/dataQualityTagStats`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fromDate,
          toDate,
          hashtags,
          page,
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

    reportDataQualityTagStatsCSV: async (
      fromDate,
      toDate,
      hashtags = [],
      page = 0,
      options = {},
    ) => {
      fetch(`${API_URL}/report/dataQualityTagStats/csv`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fromDate,
          toDate,
          hashtags,
          page,
        }),
      })
        .then((res) => {
          return res.text();
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

    dataQualityReview: async (osmchange, check = "building", options = {}) => {
      fetch(`${API_URL}/osmchange/validate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          osmchange,
          check,
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            options.onSuccess && options.onSuccess(result);
          },
          (error) => {
            options.onError && options.onError(error);
          },
        );
    },

    rawPolygons: async (
      area,
      tags,
      hashtag,
      dateFrom,
      dateTo,
      status,
      page,
      options = {},
    ) => {
      fetch(`${API_URL}/raw/polygons`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          area,
          tags,
          hashtag,
          dateFrom,
          dateTo,
          status,
          page,
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

    rawNodes: async (
      area,
      tags,
      hashtag,
      dateFrom,
      dateTo,
      status,
      page,
      options = {},
    ) => {
      fetch(API_URL + "/raw/nodes", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          area,
          tags,
          hashtag,
          dateFrom,
          dateTo,
          status,
          page,
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

    rawLines: async (
      area,
      tags,
      hashtag,
      dateFrom,
      dateTo,
      status,
      page,
      options = {},
    ) => {
      fetch(API_URL + "/raw/lines", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          area,
          tags,
          hashtag,
          dateFrom,
          dateTo,
          status,
          page,
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

    rawPolygonsList: async (
      area,
      tags,
      hashtag,
      dateFrom,
      dateTo,
      status,
      page,
      options = {},
    ) => {
      fetch(API_URL + "/raw/polygonsList", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          area,
          tags,
          hashtag,
          dateFrom,
          dateTo,
          status,
          page,
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

    raw: async (
      area,
      tags,
      hashtag,
      dateFrom,
      dateTo,
      status,
      page,
      options = {},
    ) => {
      fetch(`${API_URL}/raw/all`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          area,
          tags,
          hashtag,
          dateFrom,
          dateTo,
          status,
          page,
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
      page,
      options = {},
    ) => {
      fetch(API_URL + "/raw/allList", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          area,
          tags,
          hashtag,
          dateFrom,
          dateTo,
          status,
          page,
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
