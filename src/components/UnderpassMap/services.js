import API from "../api";

export async function fetchService(bbox, tags, map, theme, config) {
  await API(config && config.API_URL).raw(bbox, tags, {
    onSuccess: (data) => {
      if (map.getSource("raw")) {
        map.getSource("raw").setData(data);
      } else {
        map.addSource("raw", {
          type: "geojson",
          data,
        });
        map.addLayer({
          id: "waysFill",
          type: "fill",
          source: "raw",
          layout: {},
          paint: theme.map.waysFill || {},
        });
        map.addLayer({
          id: "waysLine",
          type: "line",
          source: "raw",
          layout: {},
          paint: theme.map.waysLine || {},
        });
        map.addLayer({
          id: "nodesFill",
          type: "symbol",
          source: "raw",
          layout: {
            "icon-image": "custom-marker",
          },
          paint: theme.map.nodesSymbol || {},
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
