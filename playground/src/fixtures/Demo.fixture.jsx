import React, { useState, useRef, useEffect } from "react";
import { UnderpassFeatureList, UnderpassMap, HOTTheme } from "@hotosm/underpass-ui";
import { center } from "./center";
import "./Demo.css";

const config = {
    MAPBOX_TOKEN: "YOUR_TOKEN",
    API_URL: "http://localhost:8000"
};

export default () => {
    const [coords, setCoords] = useState(center);
    const [activeFeature, setActiveFeature] = useState(null);
    const [tags, setTags] = useState("building=yes");
    const [mapSource, setMapSource] = useState("osm");
    const [realtime, setRealtime] = useState(false);
    const tagsInputRef = useRef("");
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
                        highlightDataQualityIssues
                        grayscale
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
                        <img src="https://www.hotosm.org/images/hot-logo-icon-nav.svg" />
                        <span>Latest mapped features</span>
                    </h2>
                    <form className="optionsForm">
                        <input onChange={() => { setRealtime(!realtime)}} name="liveCheckbox" type="checkbox" />
                        <label>Live</label>
                    </form>
                    <UnderpassFeatureList
                        tags={tags}
                        page={1}
                        onSelect={(feature) => {
                            setCoords([feature.lat, feature.lon]);
                            const tags = JSON.stringify(feature.tags);
                            setActiveFeature({properties: { tags: tags } , ...feature});
                        }}
                        realtime={realtime}
                        config={config}
                        onUpdate={realtime ? (mostRecentFeature) => {
                            if (mostRecentFeature) {
                                setCoords([mostRecentFeature.lat, mostRecentFeature.lon]);
                                const tags = JSON.stringify(mostRecentFeature.tags);
                                setActiveFeature({properties: { tags: tags } , ...mostRecentFeature});    
                            }
                        } : false}
                    />
                </div>
            </div>
      </div>
    );
}

