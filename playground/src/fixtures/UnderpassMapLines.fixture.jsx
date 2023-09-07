import React from "react";
import { UnderpassMapLines } from "@hotosm/underpass-ui";
import { center } from "./center";

export default (
  <div style={{height: "100vh"}}>
    <UnderpassMapLines
      center={center}
      tagKey="waterway"
      tagValue=""
      highlightDataQualityIssues
      grayscale
    />
  </div>
);
