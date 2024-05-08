import API from "../api";
import { RawRequest, RawValidationRequest } from "../api/models";

const getEndpoint = (featureType) => {
  switch (featureType) {
    case "polygons":
    case "nodes":
    case "lines":
      return featureType;
    default:
      return "features";
  }
};

export async function fetchService({
  onSuccess,
  featureType,
  map,
  theme,
  config,
  ...params
}) {
  const api = API(config && config.API_URL);
  const endpoint = getEndpoint(featureType);
  const request = new RawValidationRequest(params);

  await api.rawValidation[endpoint](request, {
    onSuccess: (data) => {
      if (map.getSource("polygon")) {
        map.getSource("polygon").setData({
          ...data,
          features: data.features.filter((x) => x.geometry.type == "Polygon"),
        });
      } else {
        map.addSource("polygon", {
          type: "geojson",
          data: {
            ...data,
            features: data.features.filter((x) => x.geometry.type == "Polygon"),
          },
        });
        map.addLayer({
          id: "waysFill",
          type: "fill",
          source: "polygon",
          layout: {},
          paint: theme.map.waysFill || {},
        });
        map.addLayer({
          id: "waysLine",
          type: "line",
          source: "polygon",
          layout: {},
          paint: theme.map.waysLine || {},
        });
      }

      if (map.getSource("linestring")) {
        map.getSource("linestring").setData({
          ...data,
          features: data.features.filter(
            (x) => x.geometry.type == "LineString",
          ),
        });
      } else {
        map.addSource("linestring", {
          type: "geojson",
          data: {
            ...data,
            features: data.features.filter(
              (x) => x.geometry.type == "LineString",
            ),
          },
        });
        map.addLayer({
          id: "waysLineString",
          type: "line",
          source: "linestring",
          layout: {},
          paint: theme.map.waysLine || {},
        });
      }

      if (map.getSource("point")) {
        map.getSource("point").setData({
          ...data,
          features: data.features.filter((x) => x.geometry.type == "Point"),
        });
      } else {
        map.addSource("point", {
          type: "geojson",
          data: {
            ...data,
            features: data.features.filter((x) => x.geometry.type == "Point"),
          },
        });
        map.addLayer({
          id: "nodesFill",
          type: "symbol",
          source: "point",
          layout: {
            "icon-image": "custom-marker",
          },
        });
      }

      onSuccess();
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
