import React from "react";
import { LiveQualityMonitor } from "@hotosm/underpass-ui";

export default <LiveQualityMonitor 
    tagKey="amenity"
    tagValue=""
    page={1}
    onSelect={(feature) => console.log(feature)}
/>;
