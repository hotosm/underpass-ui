import React, { useState, useRef, useEffect } from "react";
import { UnderpassFeatureList, UnderpassMap, HOTTheme } from "@hotosm/underpass-ui";
import { center } from "./center";
import "./Demo.css";

const config = {
    API_URL: "http://localhost:8000",
    MAPBOX_TOKEN: "pk.eyJ1IjoiZW1pNDIwIiwiYSI6ImNqZW9leG5pZTAxYWwyeG83bHU0eHM0ZXcifQ.YWmk4Rp8FBGCLmpx_huJYw",
};

const statusList = {
    ALL: "",
    UNSQUARED: "badgeom",
    OVERLAPPING: "overlaping",
}

export default () => {
    const [coords, setCoords] = useState(center);
    const [activeFeature, setActiveFeature] = useState(null);
    const [tags, setTags] = useState("building=yes");
    const [hashtag, setHashtag] = useState("");
    const [mapSource, setMapSource] = useState("dark");
    const [realtime, setRealtime] = useState(false);
    const [status, setStatus] = useState(statusList.ALL);
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
    }, [mapSource])

    const defaultMapStyle = {
        waysLine: {
            ...hottheme.map.waysLine,
            "line-opacity": .8,
        },
        waysFill: {
            ...hottheme.map.waysFill,
            "fill-opacity":
            [
                "match",
                ["get", "type"],
                "LineString", 0, .3
            ]
        },
        nodesSymbol: {
            ...hottheme.map.nodesSymbol,
            "icon-opacity": [
                "match",
                ["get", "type"],
                "Point", .8, 0
              ],        
        },
    };

    const [demoTheme, setDemoTheme] = useState({
        map: defaultMapStyle
    });

    const handleFilterClick = (e) => {
        e.preventDefault();
        setTags(tagsInputRef.current.value);
        setHashtag(hashtagInputRef.current.value);
        return false;
    }

    const handleMapSourceSelect = (e) => {
        setMapSource(e.target.options[e.target.selectedIndex].value);
    }

    return (
        <div>
            <div className="top">
                <form>
                    <input
                        type="text"
                        placeholder="key (ex: building=yes)"
                        ref={tagsInputRef}
                    />
                     &nbsp;
                     <input
                        type="text"
                        placeholder="hashtag (ex: hotosm-project)"
                        ref={hashtagInputRef}
                    />
                     &nbsp;
                    <button onClick={handleFilterClick}>Search</button>
                </form>
                <select onChange={handleMapSourceSelect} ref={styleSelectRef} className="mapSourceSelect">
                    <option value="osm">OSM</option>
                    <option value="bing">Bing</option>
                    <option value="esri">ESRI</option>
                    <option value="mapbox">Mapbox</option>
                    <option value="white">Blank</option>
                    <option value="dark">Blank (dark)</option>
                    <option value="oam">OAM</option>
                </select>
            </div>
            <div className="container">
                <div className="section2">
                    <UnderpassMap
                        center={coords}
                        tags={tags}
                        hashtag={hashtag}
                        highlightDataQualityIssues
                        popupFeature={activeFeature}
                        source={mapSource}
                        config={config}
                        realtime={realtime}
                        theme={demoTheme}
                        zoom={17}
                    />
                </div>
                <div className="section1" style={{
                    backgroundColor: `rgb(${hottheme.colors.white})`}}
                >
                    <h2>
                        <img src="/hot-logo.svg" />
                        <span>Latest mapped features</span>
                    </h2>
                    <form className="optionsForm">
                        <input onChange={() => { setRealtime(!realtime)}} name="liveCheckbox" type="checkbox" />
                        <label target="liveCheckbox">Live</label>
                    </form>
                    <form className="optionsForm">
                        <input checked={status == statusList.ALL} onChange={() => { setStatus(statusList.ALL) }} name="allCheckbox" type="radio" />
                        <label target="allCheckbox">All</label>
                        <input checked={status == statusList.UNSQUARED} onChange={() => { setStatus(statusList.UNSQUARED) }} name="unsquaredCheckbox" type="radio" />
                        <label target="unsquaredCheckbox">Un-squared</label>
                        <input checked={status == statusList.OVERLAPPING} onChange={() => { setStatus(statusList.OVERLAPPING) }} name="overlappingCheckbox" type="radio" />
                        <label target ="overlappingCheckbox">Overlapping</label>
                    </form>
                    <UnderpassFeatureList
                        tags={tags}
                        hashtag={hashtag}
                        page={0}
                        onSelect={(feature) => {
                            setCoords([feature.lat, feature.lon]);
                            const tags = JSON.stringify(feature.tags);
                            const status = feature.status;
                            setActiveFeature({properties: { tags, status } , ...feature});
                        }}
                        realtime={realtime}
                        config={config}
                        status={status}
                        onUpdate={realtime ? (mostRecentFeature) => {
                            if (mostRecentFeature) {
                                setCoords([mostRecentFeature.lat, mostRecentFeature.lon]);
                                const tags = JSON.stringify(mostRecentFeature.tags);
                                const status = mostRecentFeature.status;
                                setActiveFeature({properties: { tags, status } , ...mostRecentFeature});
                            }
                        } : false}
                    />
                </div>
            </div>
      </div>
    );
}

