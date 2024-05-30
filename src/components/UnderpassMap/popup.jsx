import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { renderToString } from "react-dom/server";

export default function Popup({
  latitude,
  longitude,
  map,
  children,
  closeOnMove,
  closeButton,
  closeOnClick,
  show,
  onClose,
  popupRef,
}) {
  useEffect(() => {
    if (!popupRef.current) {
      popupRef.current = new maplibregl.Popup({
        closeOnClick,
        closeOnMove,
        closeButton,
        className: "hui-min-w-fit",
      });
    }
    popupRef.current
      .setLngLat([longitude, latitude])
      .setHTML(renderToString(children));
  }, [
    latitude,
    longitude,
    children,
    map,
    closeOnClick,
    closeOnMove,
    closeButton,
    onClose,
    show,
    popupRef,
  ]);

  return null;
}
