import React, { useState, useRef } from "react";
import { LiveQualityMonitor, UnderpassMap } from "@hotosm/underpass-ui";
import { center } from "./center";
import "./Demo.css";

export default () => {
    const [coords, setCoords] = useState(center.reverse());
    const [activeFeature, setActiveFeature] = useState(null);
    const [tagKey, setTagKey] = useState("building");
    const [tagValue, setTagValue] = useState("yes");
    const tagKeyRef = useRef();
    const tagValueRef = useRef();

    const handleFilterClick = (e) => {
        e.preventDefault();
        setTagKey(tagKeyRef.current.value);
        setTagValue(tagValueRef.current.value);
        return false;
    }

    return (
        <div>
            <div className="top">
                <form>
                    <input
                        type="text"
                        placeholder="key (ex: natural)"
                        ref={tagKeyRef}
                    />
                    &nbsp;
                    <input
                        type="text"
                        placeholder="value (ex: water)"
                        ref={tagValueRef}
                    />
                     &nbsp;
                    <button onClick={handleFilterClick}>Filter</button>
                </form>
            </div>
            <div className="container">
                <div className="section2">
                    <UnderpassMap
                        center={coords}
                        tagKey={tagKey}
                        tagValue={tagValue}
                        highlightDataQualityIssues
                        grayscale
                        popupFeature={activeFeature}
                    />
                </div>
                <div className="section1">
                    <h2>Latest mapped features</h2>
                    <LiveQualityMonitor
                        tagKey={tagKey}
                        tagValue={tagValue}
                        page={1}
                        onSelect={(feature) => {
                            setCoords([feature.lat, feature.lon]);
                            const tags = JSON.stringify(feature.tags);
                            setActiveFeature({properties: { tags: tags } , ...feature});
                        }}
                    />
                </div>
            </div>
      </div>
    );
}

