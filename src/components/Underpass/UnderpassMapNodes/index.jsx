import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import HOTTheme from '../../HOTTheme';
import API from '../api';
import { mapStyle } from './mapStyle';
import './styles.css';

export default function UnderpassMapNodes({
  center,
  isRealTime = false,
  theme: propsTheme = {},
  defaultZoom = 18,
  minZoom = 13,
  mapClassName,
  tagKey,
  tagValue
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [theme, setTheme] = useState(null);
  const [map, setMap] = useState(null);
  const popUpRef = useRef(
    new maplibregl.Popup({ closeOnMove: true, closeButton: false })
  );

  useEffect(() => {
    if (mapRef.current) return;

    const hottheme = HOTTheme();
    const theme = {...hottheme, ...propsTheme};

    theme.map.nodesFill = {
      'fill-color': `rgb(${theme.colors.primary})`,
      ...theme.map.nodesFill,
    };

    theme.map.nodesLine = {
      'line-color': `rgb(${theme.colors.primary})`,
      ...theme.map.nodesLine,
    };

    setTheme(theme);

    let rasterStyle = mapStyle;
    if (theme.map.raster) {
      rasterStyle.layers[0].paint = theme.map.raster;
    }
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: rasterStyle,
      center: center,
      zoom: defaultZoom,
    });
    mapRef.current.addControl(new maplibregl.NavigationControl());
    setMap(mapRef.current);
  }, [center]);

  useEffect(() => {
    if (!map) return;
    async function fetchNodes() {
      await API()['rawNodes'](getBBoxString(map), tagKey, tagValue, {
        onSuccess: (data) => {
          if (map.getSource('nodes')) {
            map.getSource('nodes').setData(data);
          } else {
            map.addSource('nodes', {
              type: 'geojson',
              data: data,
            });
            map.addLayer({
              id: 'nodesFill',
              type: 'symbol',
              source: 'nodes',
              layout: {
                'icon-image': 'custom-marker',
              }
            });
          }
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }

    map.on('load', () => {
      fetchNodes(); // Run immediately on the first time
      isRealTime && setInterval(fetchNodes, 5000);
      map.loadImage(theme.map.nodesSymbol || '/images/blue-circle.png',
        (error, image) => {
          map.addImage('custom-marker', image);
        }
      );
    });

    map.on('moveend', () => {
      const zoom = map.getZoom();
      zoom > minZoom && fetchNodes();
    });

    map.on('click', 'nodesFill', (e) => {
      const popupNode = document.createElement('div');
      createRoot(popupNode).render(<Popup feature={e.features[0]} />);
      popUpRef.current.setLngLat(e.lngLat).setDOMContent(popupNode).addTo(map);
    });

    // Display pointer cursor for polygons
    map.on('mouseenter', 'nodesFill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'nodesFill', () => {
      map.getCanvas().style.cursor = '';
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);


  return (
    <div className={mapClassName || 'underpassMap-wrap'}>
      <div ref={mapContainer} className='underpassMap' />
    </div>
  );
}

const Popup = ({ feature }) => {
  const tags = JSON.parse(feature.properties.tags);

  return (
    <div className='popup'>
      <table>
        <tbody>
          <tr>
            <td colSpan='2'>
              <b>Node:</b>&nbsp;
              <a
                target='blank'
                href={`https://www.openstreetmap.org/node/${feature.id}`}
              >
                {feature.id}
              </a>
            </td>
          </tr>
          {Object.keys(tags).map((tag) => (
            <tr key={tag}>
              <td>{tag}</td>
              <td>{tags[tag]}</td>
            </tr>
          ))}
          {feature.properties.status && (
            <tr>
              <td colSpan='2'>
                <strong className='status'>{feature.properties.status}</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

function getBBoxString(map) {
  let bbox = [
    [
      map.getBounds().getNorthEast().lng,
      map.getBounds().getNorthEast().lat,
    ].join(' '),
    [
      map.getBounds().getNorthWest().lng,
      map.getBounds().getNorthWest().lat,
    ].join(' '),
    [
      map.getBounds().getSouthWest().lng,
      map.getBounds().getSouthWest().lat,
    ].join(' '),
    [
      map.getBounds().getSouthEast().lng,
      map.getBounds().getSouthEast().lat,
    ].join(' '),
    [
      map.getBounds().getNorthEast().lng,
      map.getBounds().getNorthEast().lat,
    ].join(' '),
  ].join(',');
  return bbox;
}
