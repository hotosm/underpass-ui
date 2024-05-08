import React from "react";
import { UnderpassFeatureList } from "@hotosm/underpass-ui";
import { API_URL } from "./config";

const config = {
  API_URL,
};

export default (
  <UnderpassFeatureList
    tags="building=yes"
    page={0}
    // config={config}
    // onSelect={(feature) => console.log(feature)}
    area="-52.30157375335692 -15.888118977416028,-52.28685379028318 -15.88791259782792,-52.28689670562743 -15.899964811051873,-52.301187515258775 -15.899180613658018,-52.30157375335692 -15.888118977416028"
    // dateFrom={"2023-10-10T00:00:00"}
    // dateTo={"2023-10-18T00:00:00"}
    // hashtags="hotosm"
    status="badgeom"
  />
);
