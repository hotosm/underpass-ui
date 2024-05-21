import React, { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import HOTTheme from "../HOTTheme";
import { getMapStyle } from "./mapStyle";
import Popup from "./popup";
import PopupContent from "./popupContent";
import { getBBoxString } from "./utils";
import { fetchService } from "./layerServices";

export default function UnderpassMap({
  center: propsCenter,
  popupFeature,
  realtime = false,
  theme: propsTheme = {},
  defaultZoom = 18,
  minZoom = 16,
  source = "osm",
  zoom,
  mapProps,
  highlightDataQualityIssues = true,
  config,
  grayscale,
  onMove,
  onLoad,
  mapClassName,
  tags,
  dateFrom,
  dateTo,
  status,
  hashtag,
  featureType,
  aoi,
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const tagsRef = useRef(tags);
  const hashtagRef = useRef(hashtag);
  const statusRef = useRef(status);
  const featureTypeRef = useRef(featureType);
  const dateFromRef = useRef(dateFrom);
  const dateToRef = useRef(dateTo);
  const realtimeIntervalRef = useRef();
  const [center, setCenter] = useState(propsCenter);
  const [activePopupFeature, setActivePopupFeature] = useState(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  // Fetch data from the Underpass API
  async function fetch() {
    const theme = getTheme();
    if ((!mapRef || !theme) || (map && map.getZoom() < minZoom)) return;
    setLoading(true);
    fetchService({
      area: getBBoxString(mapRef.current),
      tags: tagsRef.current,
      hashtag: hashtagRef.current,
      dateFrom: dateFromRef.current,
      dateTo: dateToRef.current,
      status: statusRef.current,
      featureType: featureTypeRef.current,
      map: mapRef.current,
      theme: theme,
      config: config,
      aoi: aoi,
      onSuccess: () => {
        setLoading(false);
      },
    });
  }

  // Create a theme and highlight quality issues if the feature is enabled
  const getTheme = () => {
    const hottheme = HOTTheme();
    const theme = { ...hottheme, ...propsTheme };

    theme.map.waysFill = {
      "fill-color": highlightDataQualityIssues
        ? [
            "match",
            ["get", "status"],
            "badgeom",
            theme.colors.primary,
            theme.colors.info,
          ]
        : theme.colors.info,
      "fill-opacity": ["match", ["get", "type"], "LineString", 0, 0.5],
      ...theme.map.waysFill,
    };

    theme.map.waysLine = {
      "line-color": highlightDataQualityIssues
        ? [
            "match",
            ["get", "status"],
            "badgeom",
            theme.colors.primary,
            theme.colors.info,
          ]
        : theme.colors.info,
      ...theme.map.waysLine,
    };

    theme.map.nodesSymbol = {
      "icon-opacity": ["match", ["get", "type"], "Point", 1, 0],
      ...theme.map.nodesSymbol,
    };

    return theme;
  };


  // Initialization
  useEffect(() => {
    if (!map) return;

    // Run immediately on the first time
    map.on("load", () => {
      onLoad && onLoad({ bbox: getBBoxString(mapRef.current) });

      // Show/hide layers when zooming out
      map.on("moveend", () => {
        const zoom = map.getZoom();
        if (zoom > minZoom) {
          fetch();
          map.setLayoutProperty("waysLine", "visibility", "visible");
          map.setLayoutProperty("waysFill", "visibility", "visible");
          map.setLayoutProperty("nodesFill", "visibility", "visible");  
        } else {
          map.setLayoutProperty("waysLine", "visibility", "none");
          map.setLayoutProperty("waysFill", "visibility", "none");
          map.setLayoutProperty("nodesFill", "visibility", "none");
        }
        // OnMove event
        onMove && onMove({ bbox: getBBoxString(mapRef.current) });
      });

    });

    // Show Popup on feature click
    const handleLayerClick = (e) => {
      setActivePopupFeature(e.features[0]);
      const coords = e.lngLat;
      setCenter([coords.lng, coords.lat]);
      setShowPopup(true);
      popupRef.current.addTo(map);
    };
    map.on("click", "waysFill", handleLayerClick);
    map.on("click", "nodesFill", handleLayerClick);
    map.on("click", "waysLine", handleLayerClick);
    map.on("click", "waysLineString", handleLayerClick);

    // Display pointer cursor for Polygons
    const handleLayerMouseEnter = (e) => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleLayerMouseLeave = (e) => {
      map.getCanvas().style.cursor = "";
    };

    // Event handlers for layers
    map.on("mouseenter", "waysFill", handleLayerMouseEnter);
    map.on("mouseleave", "waysFill", handleLayerMouseLeave);
    map.on("mouseenter", "waysLine", handleLayerMouseEnter);
    map.on("mouseleave", "waysLine", handleLayerMouseLeave);
    map.on("mouseenter", "nodesFill", handleLayerMouseEnter);
    map.on("mouseleave", "nodesFill", handleLayerMouseLeave);
    map.on("mouseenter", "waysLineString", handleLayerMouseEnter);
    map.on("mouseleave", "waysLineString", handleLayerMouseLeave);
  }, [map]);

  // Map initialization
  useEffect(() => {
    if (mapRef.current) return;
    const theme = getTheme();
    const rasterStyle = getMapStyle(grayscale, source, config);
    if (theme.map.raster) {
      rasterStyle.layers[1].paint = theme.map.raster;
    }
    let mapLibreOptions = {
      container: mapContainer.current,
      style: rasterStyle,
      center,
      zoom: defaultZoom || 17,
      ...mapProps
    }
    mapRef.current = new maplibregl.Map(mapLibreOptions);
    mapRef.current.addControl(new maplibregl.NavigationControl());
    setMap(mapRef.current);
  }, [center]);

  // AOI
  useEffect(() => {
    const theme = getTheme();
    if (!map || !aoi) return;
    if (map.getSource("aoi")) {
      map.getSource("aoi").setData(aoi);
    } 
  }, [aoi, map]);

  // Raster style
  useEffect(() => {
    if (!map || !propsTheme) return;
    const rasterStyle = getMapStyle(grayscale, source, config);
    map.once("styledata", () => {
      fetch();
    });
    mapRef.current.setStyle(rasterStyle);
  }, [map, propsTheme]);

  // Source
  useEffect(() => {
    if (!map || !source) return;
    const rasterStyle = getMapStyle(grayscale, source, config);
    map.once("styledata", () => {
      fetch();
      if (aoi) {
        map.addSource("aoi", {
          type: "geojson",
          data: aoi,
        });
        const theme = getTheme();
        map.addLayer({
          id: "aoi",
          type: "line",
          source: "aoi",
          paint: theme.map.aoi || {
            "line-color": theme.colors.primary,
            'line-dasharray': [3, 3],
            'line-width': 2,
          }
        });
      }
    });
    mapRef.current.setStyle(rasterStyle);
  }, [map, source]);

  // Center
  useEffect(() => {
    if (!map || !propsCenter) return;
    map.setCenter(propsCenter);
  }, [map, propsCenter]);

  // Zoom
  useEffect(() => {
    if (!map || !zoom) return;
    map.setZoom(zoom);
  }, [map, zoom]);

  // Show popup
  useEffect(() => {
    if (!map || !popupFeature) return;
    setActivePopupFeature(popupFeature);
    setShowPopup(true);
    popupRef.current.addTo(map);
    setCenter([popupFeature.lat, popupFeature.lon]);
    if (map.getZoom() < minZoom) {
      map.setZoom(defaultZoom);
    }
  }, [map, popupFeature]);

  // Hide popup
  useEffect(() => {
    setShowPopup(false);
    popupRef.current && popupRef.current.remove();
    setActivePopupFeature(null);
  }, [hashtag, tags, featureType]);

  // Tags
  useEffect(() => {
    tagsRef.current = tags;
    fetch();
  }, [tags]);

  // Filters: hashtag, status, featureType, dataFrom, dateTo
  useEffect(() => {
    hashtagRef.current = hashtag;
    statusRef.current = status;
    featureTypeRef.current = featureType;
    dateFromRef.current = dateFrom;
    dateToRef.current = dateTo;
    fetch();
  }, [hashtag, status, featureType, dateFrom, dateTo]);

  // Realtime map update
  useEffect(() => {
    if (realtime) {
      realtimeIntervalRef.current = setInterval(fetch, 10000);
    } else {
      if (realtimeIntervalRef.current) {
        clearInterval(realtimeIntervalRef.current);
      }
    }
  }, [realtime]);

  return (
    <div
      className={mapClassName || "underpassMapWrap"}
      style={{ position: "relative" }}
    >
      <div ref={mapContainer} />
      {loading && (
        <span
          className="hui-loading-label hui-absolute hui-text-sm"
          style={{
            bottom: "20px",
            right: "20px",
          }}
        >
          Loading ...
        </span>
      )}
      {map && map.getZoom() < minZoom && (
        <span
          className="hui-information-label hui-absolut hui-text-xl"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          Zoom in to see data
        </span>
      )}
      {map && (
        <Popup
          map={map}
          longitude={center[0]}
          latitude={center[1]}
          popupRef={popupRef}
          closeOnMove={false}
          closeButton={true}
        >
          {activePopupFeature && showPopup && (
            <PopupContent
              feature={activePopupFeature}
              highlightDataQualityIssues
            />
          )}
        </Popup>
      )}
    </div>
  );
}
