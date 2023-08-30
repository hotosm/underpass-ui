import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import HOTTheme from "../../HOTTheme";
import API from "../api";
import { getMapStyle } from "./mapStyle";
import "./styles.css";

export default function UnderpassMap({
  center,
  isRealTime = false,
  theme: propsTheme = {},
  defaultZoom = 18,
  minZoom = 13,
  mapClassName,
  tagKey,
  tagValue,
  highlightDataQualityIssues = true,
  grayscale,
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

    theme.map.waysFill = {
      "fill-color": highlightDataQualityIssues
        ? [
            "match",
            ["get", "status"],
            "badgeom",
            `rgb(${theme.colors.primary})`,
            `rgb(${theme.colors.secondary})`,
          ]
        : `rgb(${theme.colors.secondary})`,
      ...theme.map.waysFill,
    };

    theme.map.waysLine = {
      "line-color": highlightDataQualityIssues
        ? [
            "match",
            ["get", "status"],
            "badgeom",
            `rgb(${theme.colors.primary})`,
            `rgb(${theme.colors.secondary})`,
          ]
        : `rgb(${theme.colors.secondary})`,
      ...theme.map.waysLine,
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
    async function fetchWays() {
      await API().rawPolygons(getBBoxString(map), tagKey, tagValue, {
        onSuccess: (data) => {
          if (map.getSource("ways")) {
            map.getSource("ways").setData(data);
          } else {
            map.addSource("ways", {
              type: "geojson",
              data,
            });
            map.addLayer({
              id: "waysFill",
              type: "fill",
              source: "ways",
              layout: {},
              paint: theme.map.waysFill,
            });
            map.addLayer({
              id: "waysLine",
              type: "line",
              source: "ways",
              layout: {},
              paint: theme.map.waysLine,
            });
          }
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }

    map.on("load", () => {
      fetchWays(); // Run immediately on the first time
      isRealTime && setInterval(fetchWays, 5000);
    });

    map.on("moveend", () => {
      const zoom = map.getZoom();
      zoom > minZoom && fetchWays();
    });

    map.on("click", "waysFill", (e) => {
      const popupNode = document.createElement("div");
      createRoot(popupNode).render(
        <Popup
          feature={e.features[0]}
          highlightDataQualityIssues={highlightDataQualityIssues}
        />,
      );
      popUpRef.current.setLngLat(e.lngLat).setDOMContent(popupNode).addTo(map);
    });

    // Display pointer cursor for polygons
    map.on("mouseenter", "waysFill", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "waysFill", () => {
      map.getCanvas().style.cursor = "";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return (
    <div className={mapClassName || "underpassMap-wrap"}>
      <div ref={mapContainer} className="underpassMap" />
    </div>
  );
}

function Popup({ feature, highlightDataQualityIssues }) {
  const tags = JSON.parse(feature.properties.tags);
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const visibleTags = showAll
    ? Object.keys(tags)
    : Object.keys(tags).slice(0, 2);

  return (
    <div className="popup">
      <table>
        <tbody>
          <tr>
            <td colSpan="2">
              <b>Way:</b>&nbsp;
              <a
                target="blank"
                href={`https://www.openstreetmap.org/way/${feature.id}`}
              >
                {feature.id}
              </a>
            </td>
          </tr>
          {visibleTags.map((tag) => (
            <tr key={tag}>
              <td width="60%">{tag}</td>
              <td width="40%">{tags[tag]}</td>
            </tr>
          ))}
          {highlightDataQualityIssues && feature.properties.status && (
            <tr>
              <td colSpan="2">
                <strong className="status">{feature.properties.status}</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!showAll && Object.keys(tags).length > 2 && (
        <button className="more-btn" onClick={toggleShowAll}>
          More ...
        </button>
      )}
      {feature.properties.status && (
        <div
          className={`status status-bg-${feature.properties.status.toLowerCase()}`}
        >
          {feature.properties.status}
        </div>
      )}
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
