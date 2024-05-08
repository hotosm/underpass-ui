import React from "react";
import { UnderpassMap } from "@hotosm/underpass-ui";
import { center, API_URL } from "./config";

const config = {
  API_URL,
};

export default (
  <div style={{ height: "100vh" }}>
    <UnderpassMap
      center={center}
      tags="building=yes"
      highlightDataQualityIssues
      config={config}
      zoom={17}
      theme={{}}
      featureType="polygon"
    />
  </div>
);
