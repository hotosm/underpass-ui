import React from "react";
import { UnderpassFeatureList } from "@hotosm/underpass-ui";

const config = {
    API_URL: "http://localhost:8000"
};

export default <UnderpassFeatureList 
    tags="building=yes"
    page={0}
    config={config}
    onSelect={(feature) => console.log(feature)}
    // dateFrom={"2023-10-10T00:00:00"}
    // dateTo={"2023-10-18T00:00:00"}
    // hashtags="hotosm"
    // status="badgeom"
/>;
