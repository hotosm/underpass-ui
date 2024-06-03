export const center = [-78.44326124379337, -0.3161792265839267];
export const API_URL = "http://localhost:8000";

export const AOI =
  "-78.45892755540599 -0.3092467320797567,-78.42987181477953 -0.3090768179415022,-78.42993978142428 -0.3242331482031915,-78.45923340530734 -0.3234855270543733,-78.45892755540599 -0.3092467320797567";

const coordinates = AOI.split(",")
  .map((coord) => coord.split(" "))
  .map((x) => (x = [parseFloat(x[0]), parseFloat(x[1])]));

export const AOI_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [coordinates],
        type: "Polygon",
      },
    },
  ],
};

