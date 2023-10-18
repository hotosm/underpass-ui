import React from "react";
import { UnderpassFeatureList } from "@hotosm/underpass-ui";

export default <UnderpassFeatureList 
    tags="building=yes"
    page={1}
    onSelect={(feature) => console.log(feature)}
    dateFrom={"2023-10-10T00:00:00"}
    dateTo={"2023-10-18T00:00:00"}
    hashtags="hotosm"
/>;
