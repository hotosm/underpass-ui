import React, { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import HOTTheme from "../HOTTheme";
import { getMapStyle } from "./mapStyle";
import Popup from "./popup";
import PopupContent from "./popupContent";
import { getBBoxString } from "./utils";
import { fetchService } from "./layerServices";

  // Create a theme and highlight quality issues if the feature is enabled
  const getTheme = (propsTheme, highlightDataQualityIssues) => {
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

    theme.map.nodes = {
      ...theme.map.nodes,
    };
    return theme;
  };

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
  onMoveEnd,
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

  const [activePopupFeature, setActivePopupFeature] = useState(null);
  const [center, setCenter] = useState(propsCenter);
  const [loading, setLoading] = useState(true);
  const [fetchSwitch, setFetchSwitch] = useState(false);
  const popupRef = useRef(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersVisibility, setLayersVisibility] = useState(true);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(getTheme)
  }, []);

  // Fetch data from the Underpass API
  useEffect(() => {
    async function fetch() {
      if (!theme || !mapLoaded && layersVisibility) return;
      setLoading(true);
      fetchService({
        area: getBBoxString(map.current),
        tags: tags,
        hashtag: hashtag,
        dateFrom: dateFrom,
        dateTo: dateTo,
        status: status,
        featureType: featureType,
        map: map.current,
        theme: theme,
        config: config,
        aoi: aoi,
        onSuccess: () => {
          setLoading(false);
        },
      });
    }
    fetch();
  }, [map.current, fetchSwitch, tags, hashtag, dateFrom, dateTo, status, featureType, aoi, center, mapLoaded]);

  // Map initialization
  useEffect(() => {
    if (map.current) return;

    const theme = getTheme(propsTheme, highlightDataQualityIssues);
    const rasterStyle = getMapStyle(grayscale, source, config);
    if (theme.map.raster) {
      rasterStyle.layers[1].paint = theme.map.raster;
    }
    let mapLibreOptions = {
      container: mapContainer.current,
      style: rasterStyle,
      propsCenter,
      zoom: defaultZoom || 17,
      ...mapProps
    }
    map.current = new maplibregl.Map(mapLibreOptions);
    map.current.addControl(new maplibregl.NavigationControl());

      // Run immediately on the first time
      map.current.on("load", () => {

        // Show Popup on feature click
        const handleLayerClick = (e) => {
          setActivePopupFeature(e.features[0]);
          const coords = e.lngLat;
          setCenter([coords.lng, coords.lat]);
          popupRef.current.addTo(map.current);
        };

        // Display pointer cursor
        const handleLayerMouseEnter = (e) => {
          map.current.getCanvas().style.cursor = "pointer";
        };
        const handleLayerMouseLeave = (e) => {
          map.current.getCanvas().style.cursor = "inherit";
        };

        // Event handlers for layers
        map.current.on("mouseenter", "waysFill", handleLayerMouseEnter);
        map.current.on("mouseleave", "waysFill", handleLayerMouseLeave);
        map.current.on("mouseenter", "nodes", handleLayerMouseEnter);
        map.current.on("mouseleave", "nodes", handleLayerMouseLeave);
        map.current.on("mouseenter", "waysLineString", handleLayerMouseEnter);
        map.current.on("mouseleave", "waysLineString", handleLayerMouseLeave);
        map.current.on("click", "waysFill", handleLayerClick);
        map.current.on("click", "nodes", handleLayerClick);
        map.current.on("click", "waysLine", handleLayerClick);
        map.current.on("click", "waysLineString", handleLayerClick);

        setMapLoaded(true);
        onLoad && onLoad();

      });

      // Handle map move end
      map.current.on("moveend", () => {
        const zoom = map.current.getZoom();
        if (zoom < minZoom) {
          setLayersVisibility(false);
        } else {
          setLayersVisibility(true);
        }
        const center = map.current.getCenter();
        setCenter([center.lat, center.lng]);
        onMoveEnd && onMoveEnd({ bbox: getBBoxString(map.current) });
      });

  }, [propsCenter, fetchSwitch]);

  // Show/hide layers when zooming out
  useEffect(() => {
    if (!mapLoaded) { return; }
    if (layersVisibility) {
      map.current.setLayoutProperty("waysLine", "visibility", "visible");
      map.current.setLayoutProperty("waysFill", "visibility", "visible");
      map.current.setLayoutProperty("waysLineString", "visibility", "visible");
      map.current.setLayoutProperty("nodes", "visibility", "visible");
    } else {
      map.current.setLayoutProperty("waysLine", "visibility", "none");
      map.current.setLayoutProperty("waysLineString", "visibility", "none");
      map.current.setLayoutProperty("waysFill", "visibility", "none");
      map.current.setLayoutProperty("nodes", "visibility", "none");
    }
  }, [layersVisibility, mapLoaded]);

  // AOI
  useEffect(() => {
    if (!map.current || !aoi) return;
    if (map.current.getSource("aoi")) {
      map.current.getSource("aoi").setData(aoi);
    } 
  }, [aoi]);

  // Source
  useEffect(() => {
    if (!map.current || !source) return;
    const rasterStyle = getMapStyle(grayscale, source, config);
    map.current.once("styledata", () => {
      setFetchSwitch(!fetchSwitch);
      if (aoi) {
        map.current.addSource("aoi", {
          type: "geojson",
          data: aoi,
        });
        const theme = getTheme();
        map.current.addLayer({
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
    map.current.setStyle(rasterStyle);
  }, [map.current, source]);

  // Center
  useEffect(() => {
    if (!map.current || !propsCenter) return;
    map.current.setCenter(propsCenter);
  }, [map.current, propsCenter]);

  // Zoom
  useEffect(() => {
    if (!map.current || !zoom) return;
    map.current.setZoom(zoom);
  }, [map.current, zoom]);

  // Show popup on prop change
  useEffect(() => {
    if (!map.current || !popupFeature) return;
    if (map.current.getZoom() < minZoom) {
      map.current.setZoom(defaultZoom);
    }
    setActivePopupFeature(popupFeature);
    popupRef.current.addTo(map.current);
    setCenter([popupFeature.lat, popupFeature.lon]);
  }, [map.current, popupFeature]);

  // Realtime handler (fetch data every X seconds)
  useEffect(() => {
    if (realtime) {
      const realtimeInterval = setInterval(() => {
        setFetchSwitch(!fetchSwitch);
      }, 10000);
      return () => {
        clearInterval(realtimeInterval);
      };
    }
  }, [realtime, fetchSwitch]);

  return (
    <div className="hui-theme">
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
        {map.current && map.current.getZoom() < minZoom && (
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
        <Popup
          longitude={center[0]}
          latitude={center[1]}
          popupRef={popupRef}
          closeOnMove={false}
          closeButton={true}
        >
          {activePopupFeature && (
            <PopupContent
              feature={activePopupFeature}
              highlightDataQualityIssues
            />
          )}
        </Popup>
      </div>
    </div>
  );
}
