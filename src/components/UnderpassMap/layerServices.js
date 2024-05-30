import API from "../api";
import { RawValidationRequest } from "../api/models";

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
      if (!data.features) {
        data.features = []
      }
      // Polygons
      if (map.getSource("polygon")) {
        map.getSource("polygon").setData({
          ...data,
          features: data.features.filter((x) => x.geometry.type == "Polygon"),
        });
      } else {
        // Polygon source
        map.addSource("polygon", {
          type: "geojson",
          data: {
            ...data,
            features: data.features.filter(
              (x) => x.geometry.type == "Polygon",
            ),
          },
        });

        // Ways fill layer
        map.addLayer({
          id: "waysFill",
          type: "fill",
          source: "polygon",
          layout: {},
          paint: theme.map.waysFill || {},
        });

        // Ways stroke layer
        map.addLayer({
          id: "waysLine",
          type: "line",
          source: "polygon",
          layout: {},
          paint: theme.map.waysLine || {},
        });
      }

      // Linestring
      if (map.getSource("linestring")) {
        map.getSource("linestring").setData({
          ...data,
          features: data.features.filter(
            (x) => x.geometry.type == "LineString",
          ),
        });
      } else {
        // Linestring source
        map.addSource("linestring", {
          type: "geojson",
          data: {
            ...data,
            features: data.features.filter(
              (x) => x.geometry.type == "LineString",
            ),
          },
        });

        // Linestring stroke layer
        map.addLayer({
          id: "waysLineString",
          type: "line",
          source: "linestring",
          layout: {},
          paint: theme.map.waysLine || {},
        });
      }

      // Nodes
      if (map.getSource("node")) {
        map.getSource("node").setData({
          ...data,
          features: data.features.filter((x) => x.geometry.type == "Point"),
        });
      } else {
        // Node source
        map.addSource("node", {
          type: "geojson",
          data: {
            ...data,
            features: data.features.filter((x) => x.geometry.type == "Point"),
          },
        });

        // Node circle layer
        map.addLayer({
          id: "nodes",
          type: "circle",
          source: "node",
          paint: theme.map.nodes || {
            "circle-color": "red",
            "circle-radius": 7,
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
