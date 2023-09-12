import React, { useState, useRef, useEffect } from "react";
import { UnderpassFeatureList, UnderpassMap, HOTTheme } from "@hotosm/underpass-ui";
import { center } from "./center";
import "./Demo.css";


export default () => {
    const [coords, setCoords] = useState(center.reverse());
    const [activeFeature, setActiveFeature] = useState(null);
    const [tagKeyInput, setTagKeyInput] = useState("building");
    const [tagValueInput, setTagValueInput] = useState("");
    const [tagKey, setTagKey] = useState("building");
    const [tagValue, setTagValue] = useState("");
    const [mapSource, setMapSource] = useState("osm");
    const [realtime, setRealtime] = useState(false);
    const [showPoints, setShowPoints] = useState(true);
    const [showLines, setShowLines] = useState(true);
    const [showPolygons, setShowPolygons] = useState(true);
    const styleSelectRef = useRef();

    const hottheme = HOTTheme();

    const defaultMapStyle = {
        waysLine: {
            ...hottheme.map.waysLine,
            "line-opacity": 1,
        },
        waysFill: {
            ...hottheme.map.waysFill,
            "fill-opacity":
            [
                "match",
                ["get", "type"],
                "LineString", 0, .5
            ]
        },
        nodesSymbol: {
            ...hottheme.map.nodesSymbol,
            "icon-opacity": 1,
        },
    };

    const [demoTheme, setDemoTheme] = useState({
        map: defaultMapStyle
    });

    useEffect(() => {
    
        let waysLineStyle = defaultMapStyle.waysLine;
        let waysFillStyle = defaultMapStyle.waysFill;
        let nodesSymbolStyle = defaultMapStyle.nodesSymbol;

        if (!showLines) {
            waysLineStyle["line-opacity"] = [
                "match",
                ["get", "type"],
                "LineString", 0, showPolygons ? 1 : 0
            ]
        }
        if (!showPolygons) {
            waysLineStyle["line-opacity"] = [
                "match",
                ["get", "type"],
                "Polygon", 0, showLines ? 1 : 0
            ]
            waysFillStyle["fill-opacity"] = [
                "match",
                ["get", "type"],
                "Polygon", 0, 0
            ]
        }
        if (!showPoints) {
            nodesSymbolStyle["icon-opacity"] = 0
        }

        setDemoTheme({
            map: {
                waysLine: {
                    ...hottheme.map.waysLine,
                    ...waysLineStyle,
                },
                waysFill: {
                    ...hottheme.map.waysFill,
                    ...waysFillStyle,
                },
                nodesSymbol: {
                    ...hottheme.map.nodesSymbol,
                    ...nodesSymbolStyle,
                }
            }
        })
    }, [showPoints, showLines, showPolygons])

    const handleFilterClick = (e) => {
        e.preventDefault();
        setTagKey(tagKeyInput);
        setTagValue(tagValueInput);
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
                        placeholder="key (ex: natural)"
                        value={tagKeyInput}
                        onChange={(e) => {
                            setTagKeyInput(e.target.value);
                        }}
                    />
                    &nbsp;
                    <input
                        type="text"
                        placeholder="value (ex: water)"
                        value={tagValueInput}
                        onChange={(e) => {
                            setTagValueInput(e.target.value);
                        }}
                    />
                     &nbsp;
                    <button onClick={handleFilterClick}>Filter</button>
                </form>
                <select onChange={handleMapSourceSelect} ref={styleSelectRef} className="mapSourceSelect">
                    <option value="osm">OSM</option>
                    <option value="bing">Bing</option>
                    <option value="esri">ESRI</option>
                    <option value="mapbox">Mapbox</option>
                    <option value="white">Blank</option>
                    <option value="dark">Blank (dark)</option>
                </select>
            </div>
            <div className="container">
                <div className="section2">
                    <UnderpassMap
                        center={coords}
                        tagKey={tagKey}
                        tagValue={tagValue}
                        highlightDataQualityIssues
                        // grayscale
                        popupFeature={activeFeature}
                        source={mapSource}
                        config={{
                            MAPBOX_TOKEN: "YOUR_TOKEN"
                        }}
                        realtime={realtime}
                        theme={demoTheme}
                    />
                </div>
                <div className="section1">
                    <h2>Latest mapped features</h2>
                    <form className="optionsForm">
                        <input onChange={() => { setRealtime(!realtime)}} name="liveCheckbox" type="checkbox" />
                        <label>Live</label>
                        <input onClick={() => { setShowPoints(!showPoints)}} name="pointsCheckbox" checked={showPoints} type="checkbox" />
                        <label>Points</label>
                        <input onClick={() => { setShowPolygons(!showPolygons)}} name="polygonsCheckbox" checked={showPolygons} type="checkbox" />
                        <label>Polygons</label>
                        <input onClick={() => { setShowLines(!showLines)}} name="linesCheckbox" checked={showLines} type="checkbox" />
                        <label>Lines</label>
                    </form>
                    <UnderpassFeatureList
                        tagKey={tagKey}
                        tagValue={tagValue}
                        page={1}
                        onSelect={(feature) => {
                            setCoords([feature.lat, feature.lon]);
                            const tags = JSON.stringify(feature.tags);
                            setActiveFeature({properties: { tags: tags } , ...feature});
                        }}
                        realtime={realtime}
                        onUpdate={(mostRecentFeature) => {
                            if (mostRecentFeature) {
                                setCoords([mostRecentFeature.lat, mostRecentFeature.lon]);
                                const tags = JSON.stringify(mostRecentFeature.tags);
                                setActiveFeature({properties: { tags: tags } , ...mostRecentFeature});    
                            }
                        }}
                    />
                </div>
            </div>
      </div>
    );
}

