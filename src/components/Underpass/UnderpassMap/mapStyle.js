export const getMapStyle = (isShowGrayscale) => {
  return {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap Contributors',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
        ...(isShowGrayscale
          ? {
              paint: {
                'raster-opacity': 0.72,
                'raster-brightness-max': 1,
                'raster-saturation': -1,
              },
            }
          : {}),
      },
    ],
  };
};
