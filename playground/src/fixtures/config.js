export const center = [-74.07581738265863, 40.71429483321765];
export const API_URL = "http://localhost:8000";

export const AOI =
  "-74.09030946882663 40.72445822156507,-74.06168609531639 40.72423035990883,-74.060784098252 40.704038720771536,-74.0900088031385 40.704038720771536,-74.09030946882663 40.72445822156507";

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

