import React from "react";
import { UnderpassMapNodes } from "@hotosm/underpass-ui";
import { center } from "./center";

export default (
  <UnderpassMapNodes center={center} tagKey="amenity" tagValue="" grayscale />
);
