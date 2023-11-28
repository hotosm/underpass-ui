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
  onClose
}) {

    const popupRef = useRef(null);

    useEffect(() => {
      if (!popupRef.current) {
        popupRef.current = new maplibregl.Popup(
          {
            closeOnClick,
            closeOnMove,
            closeButton,
            className: "min-w-fit"
          },
        )
        popupRef.current.on('close', () => {
          onClose();
        });
      }

      if (show) {
        popupRef.current.addTo(map);
      }

      popupRef.current.setLngLat([longitude, latitude])
      .setHTML(renderToString(children))
      
    }, [latitude, longitude, children, map, closeOnClick, closeOnMove, closeButton, onClose, show]);

    return (null);
  }