import React, { useState, useRef } from "react";
import { LiveQualityMonitor, UnderpassMap } from "@hotosm/underpass-ui";
import "./Demo.css";

export default () => {
    const [center, setCenter] = useState([0.95953, -79.64696].reverse());
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
                        center={center.reverse()}
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
                            setCenter([feature.lon, feature.lat]);
                            const tags = JSON.stringify(feature.tags);
                            setActiveFeature({properties: { tags: tags } , ...feature});
                        }}
                    />
                </div>
            </div>
      </div>
    );
}

