import React from "react";
import { UnderpassFeatureList } from "@hotosm/underpass-ui";

export default <UnderpassFeatureList 
    tagKey="amenity"
    tagValue=""
    page={1}
    onSelect={(feature) => console.log(feature)}
/>;
