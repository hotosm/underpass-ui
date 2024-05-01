import React, { useState, useRef, useEffect } from "react";
import {
  UnderpassFeatureList,
  UnderpassMap,
  HOTTheme,
  UnderpassFeatureStats,
  UnderpassValidationStats,
} from "@hotosm/underpass-ui";
import { center } from "./center";
import "./Demo.css";

const config = {
  API_URL: "http://localhost:8000",
};

const statusList = {
  ALL: "",
  UNSQUARED: "badgeom",
  OVERLAPPING: "overlapping",
  BADVALUE: "badvalue",
};

function App() {
  const [coords, setCoords] = useState(center);
  const [activeFeature, setActiveFeature] = useState(null);
  const [tags, setTags] = useState("building");
  const [hashtag, setHashtag] = useState("");
  const [mapSource, setMapSource] = useState("osm");
  const [realtimeList, setRealtimeList] = useState(false);
  const [realtimeMap, setRealtimeMap] = useState(false);
  const [status, setStatus] = useState(statusList.UNSQUARED);
  const [featureType, setFeatureType] = useState("polygon");
  const [area, setArea] = useState(null);
  const tagsInputRef = useRef("");
  const hashtagInputRef = useRef("");
  const styleSelectRef = useRef();

  const hottheme = HOTTheme();

  useEffect(() => {
    if (mapSource == "dark") {
      document.body.style.backgroundColor = `rgb(${hottheme.colors.dark})`;
    } else {
      document.body.style.backgroundColor = `rgb(${hottheme.colors.white})`;
    }
  }, [mapSource]);

  const defaultMapStyle = {
    waysLine: {
      ...hottheme.map.waysLine,
      "line-opacity": 0.8,
    },
    waysFill: {
      ...hottheme.map.waysFill,
      "fill-opacity": ["match", ["get", "type"], "LineString", 0, 0.3],
    },
    nodesSymbol: {
      ...hottheme.map.nodesSymbol,
      "icon-opacity": ["match", ["get", "type"], "Point", 0.8, 0],
    },
  };

  const [demoTheme, setDemoTheme] = useState({
    map: defaultMapStyle,
  });

  const handleFilterClick = (e) => {
    e.preventDefault();
    setTags(tagsInputRef.current.value);
    setHashtag(hashtagInputRef.current.value);
    return false;
  };

  const handleMapSourceSelect = (e) => {
    setMapSource(e.target.options[e.target.selectedIndex].value);
  };

  const handleMapMove = ({ bbox }) => {
    setArea(bbox);
  };
  const handleMapLoad = ({ bbox }) => {
    setArea(bbox);
  };

  return (
    <div>
      <div className="flex">
        <div style={{ flex: 2 }}>
          <div className="top">
            <form>
              <input
                className="border px-2 py-2 text-sm"
                type="text"
                placeholder="key (ex: building=yes)"
                ref={tagsInputRef}
                defaultValue="building"
              />
              &nbsp;
              <input
                className="border px-2 py-2 text-sm"
                type="text"
                placeholder="hashtag (ex: hotosm-project)"
                ref={hashtagInputRef}
              />
              &nbsp;
              <button
                className="inline-flex items-center rounded bg-primary px-2 py-2 text-sm font-medium text-white"
                onClick={handleFilterClick}
              >
                Search
              </button>
            </form>
            <select
              onChange={handleMapSourceSelect}
              ref={styleSelectRef}
              className="border mt-2 bg-white px-2 py-2 text-sm"
            >
              <option value="osm">OSM</option>
              <option value="bing">Bing</option>
              <option value="esri">ESRI</option>
              <option value="mapbox">Mapbox</option>
              <option value="white">Blank</option>
              <option value="dark">Blank (dark)</option>
              <option value="oam">OAM</option>
            </select>
          </div>
          <UnderpassMap
            center={coords}
            tags={tags}
            hashtag={hashtag}
            highlightDataQualityIssues
            popupFeature={activeFeature}
            source={mapSource}
            config={config}
            realtime={realtimeMap}
            theme={demoTheme}
            zoom={17}
            onMove={handleMapMove}
            onLoad={handleMapLoad}
            featureType={featureType}
          />
        </div>
        <div
          style={{
            flex: 1,
            padding: 10,
            display: "flex",
            "flex-direction": "column",
            backgroundColor: `rgb(${hottheme.colors.white})`,
          }}
        >
          <div className="border-b-2 pb-5 space-y-3">
            <UnderpassValidationStats
              tags={tags}
              hashtag={hashtag}
              apiUrl={config.API_URL}
              status="badgeom"
              featureType={featureType}
            />
          </div>
          <div className="border-b-2 py-5 mb-4">
            <form className="space-x-2">
              <input
                onChange={() => {
                  setRealtimeList(!realtimeList);
                }}
                name="liveListCheckbox"
                type="checkbox"
              />
              <label target="liveListCheckbox">Live list</label>
              <input
                onChange={() => {
                  setRealtimeMap(!realtimeMap);
                }}
                name="liveMapCheckbox"
                type="checkbox"
              />
              <label target="liveMapCheckbox">Live map</label>
            </form>
            <form className="space-x-2 py-4">
              <input
                checked={status === statusList.ALL}
                onChange={() => {
                  setStatus(statusList.ALL);
                }}
                name="allCheckbox"
                id="allCheckbox"
                type="radio"
              />
              <label htmlFor="allCheckbox">All</label>
              <input
                checked={status === statusList.UNSQUARED}
                onChange={() => {
                  setStatus(statusList.UNSQUARED);
                }}
                name="geospatialCheckbox"
                id="geospatialCheckbox"
                type="radio"
              />
              <label htmlFor="geospatialCheckbox">Geospatial</label>
              <input
                checked={status === statusList.BADVALUE}
                onChange={() => {
                  setStatus(statusList.BADVALUE);
                }}
                name="semanticCheckbox"
                id="semanticCheckbox"
                type="radio"
              />
              <label htmlFor="semanticCheckbox">Semantic</label>
            </form>
            <form className="space-x-2">
              <input
                checked={featureType === "all"}
                onChange={() => {
                  setFeatureType("all");
                }}
                name="featureTypeAllCheckbox"
                id="featureTypeAllCheckbox"
                type="radio"
              />
              <label htmlFor="featureTypeAllCheckbox">All</label>
              <input
                checked={featureType === "polygon"}
                onChange={() => {
                  setFeatureType("polygon");
                }}
                name="featureTypePolygonCheckbox"
                id="featureTypePolygonCheckbox"
                type="radio"
              />
              <label htmlFor="featureTypePolygonCheckbox">Polygon</label>
              <input
                checked={featureType === "line"}
                onChange={() => {
                  setFeatureType("line");
                }}
                name="featureTypeLineCheckbox"
                id="featureTypeLineCheckbox"
                type="radio"
              />
              <label htmlFor="featureTypeLineCheckbox">Line</label>
              <input
                checked={featureType === "node"}
                onChange={() => {
                  setFeatureType("node");
                }}
                name="featureTypeNodeCheckbox"
                id="featureTypeNodeCheckbox"
                type="radio"
              />
              <label htmlFor="featureTypeNodeCheckbox">Node</label>
            </form>
          </div>
          <UnderpassFeatureList
            style={{
              display: "flex",
              "flex-flow": "column",
              height: "1px",
              flex: "1 1 auto",
            }}
            tags={tags}
            hashtag={hashtag}
            page={0}
            onSelect={(feature) => {
              setCoords([feature.lat, feature.lon]);
              const tags = JSON.stringify(feature.tags);
              const status = feature.status;
              setActiveFeature({ properties: { tags, status }, ...feature });
            }}
            realtime={realtimeList}
            config={config}
            status={status}
            // orderBy="created_at"
            featureType={featureType}
            onFetchFirstTime={(mostRecentFeature) => {
              if (mostRecentFeature) {
                setCoords([mostRecentFeature.lat, mostRecentFeature.lon]);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
