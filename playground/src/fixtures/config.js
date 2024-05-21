export const center = [-72.6409822432601, 2.5665178546735206];
export const API_URL = "http://localhost:8000";

export const AOI =
  "-72.67154625016511 2.6057181300724466,-72.60667168066998 2.6057181300724466,-72.60667168066998 2.529286328964716,-72.67154625016511 2.529286328964716,-72.67154625016511 2.6057181300724466";

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

