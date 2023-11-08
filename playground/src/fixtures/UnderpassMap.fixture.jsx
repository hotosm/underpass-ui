import React from "react";
import { UnderpassMap } from "@hotosm/underpass-ui";
import { center } from "./center";

const config = {
  API_URL: "http://localhost:8000"
};

export default (
  <div style={{height: "100vh"}}>
    <UnderpassMap
      center={center}
      tags="building=yes"
      highlightDataQualityIssues
      grayscale
      config={config}
      source="osm"
    />
  </div>
);
