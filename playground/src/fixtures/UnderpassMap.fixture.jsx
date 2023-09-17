import React from "react";
import { UnderpassMap } from "@hotosm/underpass-ui";
import { center } from "./center";

export default (
  <div style={{height: "100vh"}}>
    <UnderpassMap
      center={center}
      tags="building=yes"
      highlightDataQualityIssues
      grayscale
      source="osm"
    />
  </div>
);
