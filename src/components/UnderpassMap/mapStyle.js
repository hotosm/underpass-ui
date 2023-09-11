const MAPBOX_TOKEN = "";

export const getMapStyle = (grayscale, source = "osm") => {
  const sources = {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
      maxzoom: 19,
    },
    mapbox: {
      type: "raster",
      tiles: [
        "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=" +
          MAPBOX_TOKEN,
      ],
      tileSize: 512,
      attribution: "&copy; OpenStreetMap Contributors &copy; Mapbox",
      maxzoom: 19,
    },
    esri: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors &copy; ESRI",
      maxzoom: 18,
    },
  };

  return {
    version: 8,
    sources,
    layers: [
      {
        id: "main",
        type: "raster",
        source,
        ...(grayscale
          ? {
              paint: {
                "raster-opacity": 0.72,
                "raster-brightness-max": 1,
                "raster-saturation": -1,
              },
            }
          : {}),
      },
    ],
  };
};
