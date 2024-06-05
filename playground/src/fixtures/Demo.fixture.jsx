import React, { useState, useRef, useEffect } from "react";
import {
  UnderpassFeatureList,
  UnderpassMap,
  HOTTheme,
  UnderpassFeatureStats
} from "@hotosm/underpass-ui";
import { center, API_URL, AOI_GEOJSON } from "./config";
import AOIUpload from "./components/AOIUpload";
import "./index.css";

const config = {
  API_URL,
};

const statusList = {
  ALL: "",
  UNSQUARED: "badgeom",
  OVERLAPPING: "overlapping",
  BADVALUE: "badvalue",
};

const getCoodinatesFromGeoJSON = (geoJSON) => (
  geoJSON.features[0].geometry.coordinates[0].map(x => x.join(" ")).join(",")
)

function App() {
  const [coords, setCoords] = useState(center);
  const [activeFeature, setActiveFeature] = useState(null);
  const [tags, setTags] = useState("building");
  const [hashtag, setHashtag] = useState("");
  const [mapSource, setMapSource] = useState("osm");
  const [realtimeList, setRealtimeList] = useState(false);
  const [realtimeMap, setRealtimeMap] = useState(false);
  const [status, setStatus] = useState(statusList.ALL);
  const [featureType, setFeatureType] = useState("polygons");
  const [mapBbox, setMapBbox] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [aoiGeoJson, setAoiGeoJson] = useState(AOI_GEOJSON);
  const [aoi, setAoi] = useState(null);
  const [fileName, setFileName] = useState(null);
  const tagsInputRef = useRef("");
  const hashtagInputRef = useRef("");
  const styleSelectRef = useRef();

  const hottheme = HOTTheme();

  useEffect(() => {
    if (mapSource === "dark") {
      document.body.style.backgroundColor = `rgb(${hottheme.colors.dark})`;
    } else {
      document.body.style.backgroundColor = `rgb(${hottheme.colors.white})`;
    }
  }, [mapSource]);

  useEffect(() => {
    if (!tags.startsWith("building")) {
      setStatus(statusList.ALL)
    }
  }, [tags, status]);

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

  const handleResetFileClick = () => {
    setFileName(null);
    setAoiGeoJson(AOI_GEOJSON);
    setAoi(null);
  }

  const handleMapSourceSelect = (e) => {
    setMapSource(e.target.options[e.target.selectedIndex].value);
  };

  const handleMapMove = (data) => {
    setMapBbox(data.bbox);
  }

  const handleMapLoad = (data) => {
    setMapLoaded(true);
  }

  const handleAOIFileUpload = (file) => {
    const geoJSON = JSON.parse(file.data);
    setAoiGeoJson(geoJSON);
    setAoi(getCoodinatesFromGeoJSON(geoJSON));
    setFileName(file.name);
  }

  return (
    <div className="hui-theme">
      <div className="hui-flex">
        <div style={{ flex: 2 }}>
          <div className="top">
            <form>
              <input
                className="hui-input-text"
                type="text"
                placeholder="key (ex: building=yes)"
                ref={tagsInputRef}
                defaultValue="building"
              />
              &nbsp;
              <input
                className="hui-input-text"
                type="text"
                placeholder="hashtag (ex: hotosm-project)"
                ref={hashtagInputRef}
              />
              &nbsp;
              <button
                className="hui-button"
                onClick={handleFilterClick}
              >
                Search
              </button>
            </form>
            <select
              onChange={handleMapSourceSelect}
              ref={styleSelectRef}
              className="hui-input-text hui-mt-2 hui-bg-white"
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
            popupFeature={activeFeature}
            source={mapSource}
            config={config}
            realtime={realtimeMap}
            theme={demoTheme}
            zoom={6}
            featureType={featureType}
            aoi={aoiGeoJson}
            onMoveEnd={handleMapMove}
            onLoad={handleMapLoad}
          />
        </div>
        <div
          style={{
            flex: 1,
            padding: 10,
            display: "flex",
            flexDirection: "column",
            backgroundColor: `rgb(${hottheme.colors.white})`,
          }}
        >
            { !fileName ?
              <>
                <p className="fileUploadDropAreaTitle">Upload a GeoJson with the (Polygon) area you want to analyze:</p>
                <div className="fileUploadDropArea">
                  <AOIUpload classes={"fileUploadDropArea"} onFileLoad={handleAOIFileUpload} name="file"/>
                </div>
              </>
              :
              <div className="fileOptions">
                <button onClick={handleResetFileClick} className="hui-text">x</button>
                <h2 class="fileName">{fileName}</h2>
              </div>
            }
            { mapLoaded ?
            <><div>
              <UnderpassFeatureStats
                tags={tags}
                hashtag={hashtag}
                config={config}
                featureType={featureType}
                area={aoi || mapBbox} 
              />
            </div>
            <div className="demo-options">
                <form className="hui-space-x-2">
                  <input
                    onChange={() => {
                      setRealtimeList(!realtimeList);
                    } }
                    name="liveListCheckbox"
                    type="checkbox" />
                  <label target="liveListCheckbox">Live list</label>
                  <input
                    onChange={() => {
                      setRealtimeMap(!realtimeMap);
                    } }
                    name="liveMapCheckbox"
                    type="checkbox" />
                  <label target="liveMapCheckbox">Live map</label>
                </form>
                {tags.startsWith("building") ?
                  <form className="hui-space-x-2 hui-py-4">
                    <input
                      checked={status === statusList.ALL}
                      onChange={() => {
                        setStatus(statusList.ALL);
                      } }
                      name="allCheckbox"
                      id="allCheckbox"
                      type="radio" />
                    <label htmlFor="allCheckbox">All</label>
                    <input
                      checked={status === statusList.UNSQUARED}
                      onChange={() => {
                        setStatus(statusList.UNSQUARED);
                      } }
                      name="geospatialCheckbox"
                      id="geospatialCheckbox"
                      type="radio" />
                    <label htmlFor="geospatialCheckbox">Un-squared</label>
                  </form>
                  : <br />}
                <form className="hui-space-x-2">
                  <input
                    checked={featureType === "all"}
                    onChange={() => {
                      setFeatureType("all");
                    } }
                    name="featureTypeAllCheckbox"
                    id="featureTypeAllCheckbox"
                    type="radio" />
                  <label htmlFor="featureTypeAllCheckbox">All</label>
                  <input
                    checked={featureType === "polygons"}
                    onChange={() => {
                      setFeatureType("polygons");
                    } }
                    name="featureTypePolygonCheckbox"
                    id="featureTypePolygonCheckbox"
                    type="radio" />
                  <label htmlFor="featureTypePolygonCheckbox">Polygon</label>
                  <input
                    checked={featureType === "lines"}
                    onChange={() => {
                      setFeatureType("lines");
                    } }
                    name="featureTypeLineCheckbox"
                    id="featureTypeLineCheckbox"
                    type="radio" />
                  <label htmlFor="featureTypeLineCheckbox">Line</label>
                  <input
                    checked={featureType === "nodes"}
                    onChange={() => {
                      setFeatureType("nodes");
                    } }
                    name="featureTypeNodeCheckbox"
                    id="featureTypeNodeCheckbox"
                    type="radio" />
                  <label htmlFor="featureTypeNodeCheckbox">Node</label>
                  <input
                    disabled
                    checked={featureType === "relations"}
                    onChange={() => {
                      setFeatureType("relations");
                    } }
                    name="featureTypeRelationCheckbox"
                    id="featureTypeRelationCheckbox"
                    type="radio" />
                  <label className="labelDisabled" disabled htmlFor="featureTypeRelationCheckbox">Relation</label>
                </form>
              </div>
              <UnderpassFeatureList
                style={{
                  display: "flex",
                  flexFlow: "column",
                  flex: "1 1 auto",
                }}
                area={aoi || mapBbox}
                tags={tags}
                hashtag={hashtag}
                onSelect={(feature) => {
                  setCoords([feature.lat, feature.lon]);
                  const tags = JSON.stringify(feature.tags);
                  const status = feature.status;
                  setActiveFeature({ properties: { tags, status }, ...feature });
                } }
                realtime={realtimeList}
                config={config}
                status={status}
                // orderBy="closed_at"
                featureType={featureType}
                onFetchFirstTime={(mostRecentFeature) => {
                  if (mostRecentFeature) {
                    setCoords([mostRecentFeature.lat, mostRecentFeature.lon]);
                  }
                } } />
              </>
           : "Loading ..." }
        </div>
      </div>
    </div>
  );
}

export default App;
