import React from "react";
import { UnderpassFeatureList } from "@hotosm/underpass-ui";

export default <UnderpassFeatureList 
    tags="amenity"
    page={1}
    onSelect={(feature) => console.log(feature)}
/>;
