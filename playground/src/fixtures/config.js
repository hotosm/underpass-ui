export const center = [-64.26692962646484, -31.020869337338432];
export const API_URL = "http://localhost:8000";

export const AOI =
  "-64.36870579060208 -30.911738994952074,-64.16232270392192 -30.911738994952074,-64.16232270392192 -31.12138041118147,-64.36870579060208 -31.12138041118147,-64.36870579060208 -30.911738994952074";

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

