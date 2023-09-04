import React from "react";
import { UnderpassMap } from "@hotosm/underpass-ui";
import { center } from "./center";

export default (
  <div style={{height: "100vh"}}>
    <UnderpassMap
      center={center}
      tagKey="building"
      tagValue="yes"
      highlightDataQualityIssues
      grayscale
    />
  </div>
);
