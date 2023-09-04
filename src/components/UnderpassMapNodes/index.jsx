import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import HOTTheme from "../HOTTheme";
import API from "../api";
import { getMapStyle } from "./mapStyle";
import styles from "./styles.css";

export default function UnderpassMapNodes({
  center,
  isRealTime = false,
  theme: propsTheme = {},
  defaultZoom = 18,
  minZoom = 13,
  mapClassName,
  tagKey,
  tagValue,
  grayscale = true,
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [theme, setTheme] = useState(null);
  const [map, setMap] = useState(null);
  const popUpRef = useRef(
    new maplibregl.Popup({ closeOnMove: true, closeButton: false }),
  );

  useEffect(() => {
    if (mapRef.current) return;

    const hottheme = HOTTheme();
    const theme = { ...hottheme, ...propsTheme };

    theme.map.nodesFill = {
      "fill-color": `rgb(${theme.colors.primary})`,
      ...theme.map.nodesFill,
    };

    theme.map.nodesLine = {
      "line-color": `rgb(${theme.colors.primary})`,
      ...theme.map.nodesLine,
    };

    setTheme(theme);

    const rasterStyle = getMapStyle(grayscale);
    if (theme.map.raster) {
      rasterStyle.layers[0].paint = theme.map.raster;
    }
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: rasterStyle,
      center,
      zoom: defaultZoom,
    });
    mapRef.current.addControl(new maplibregl.NavigationControl());
    setMap(mapRef.current);
  }, [center]);

  useEffect(() => {
    if (!map) return;
    async function fetchNodes() {
      await API().rawNodes(getBBoxString(map), tagKey, tagValue, {
        onSuccess: (data) => {
          if (map.getSource("nodes")) {
            map.getSource("nodes").setData(data);
          } else {
            map.addSource("nodes", {
              type: "geojson",
              data,
            });
            map.addLayer({
              id: "nodesFill",
              type: "symbol",
              source: "nodes",
              layout: {
                "icon-image": "custom-marker",
              },
            });
          }
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }

    map.on("load", () => {
      fetchNodes(); // Run immediately on the first time
      isRealTime && setInterval(fetchNodes, 5000);
      map.loadImage(
        theme.map.nodesSymbol || "data:image/png;base64,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",
        (error, image) => {
          map.addImage("custom-marker", image);
        },
      );
    });

    map.on("moveend", () => {
      const zoom = map.getZoom();
      zoom > minZoom && fetchNodes();
    });

    map.on("click", "nodesFill", (e) => {
      const popupNode = document.createElement("div");
      createRoot(popupNode).render(<Popup feature={e.features[0]} />);
      popUpRef.current.setLngLat(e.lngLat).setDOMContent(popupNode).addTo(map);
    });

    // Display pointer cursor for polygons
    map.on("mouseenter", "nodesFill", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "nodesFill", () => {
      map.getCanvas().style.cursor = "";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return (
    <div className={mapClassName || styles.underpassMapWrap}>
      <div ref={mapContainer} className={styles.underpassMap} />
    </div>
  );
}

function Popup({ feature }) {
  const tags = JSON.parse(feature.properties.tags);

  return (
    <div className={styles.popup}>
      <table>
        <tbody>
          <tr>
            <td colSpan='2'>
              <b>Node:</b>&nbsp;
              <a
                target="blank"
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
              <td colSpan="2">
                <strong className={styles.status}>{feature.properties.status}</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function getBBoxString(map) {
  const bbox = [
    [
      map.getBounds().getNorthEast().lng,
      map.getBounds().getNorthEast().lat,
    ].join(" "),
    [
      map.getBounds().getNorthWest().lng,
      map.getBounds().getNorthWest().lat,
    ].join(" "),
    [
      map.getBounds().getSouthWest().lng,
      map.getBounds().getSouthWest().lat,
    ].join(" "),
    [
      map.getBounds().getSouthEast().lng,
      map.getBounds().getSouthEast().lat,
    ].join(" "),
    [
      map.getBounds().getNorthEast().lng,
      map.getBounds().getNorthEast().lat,
    ].join(" "),
  ].join(",");
  return bbox;
}
