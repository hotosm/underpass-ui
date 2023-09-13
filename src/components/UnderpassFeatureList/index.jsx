import React, { useEffect, useState, useRef } from 'react';

import styles from './styles.css';
import FeatureDetailCard from '../FeatureDetailCard';
import API from '../api';

function UnderpassFeatureList({
  tagKey,
  tagValue,
  page,
  onSelect,
  realtime,
  onUpdate,
  config,
  hidePolygons,
  hideNodes,
  hideLines
}) {

  const [features, setFeatures] = useState([]);
  const realtimeIntervalRef = useRef();

  async function fetch() {
    await API(config.API_URL)["rawList"](tagKey, tagValue, page, {
      onSuccess: (data) => {
        const filteredData = data.filter((feature) => (
            !hidePolygons && feature.geotype == "Polygon" ||
            !hideNodes && feature.geotype == "Point" ||
            !hideLines && feature.geotype == "LineString"
        ));
        setFeatures(filteredData);
        onUpdate && onUpdate(filteredData[0]);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }

  useEffect(() => {
    fetch();
  }, [tagKey, tagValue, hidePolygons, hideNodes, hideLines]);

  useEffect(() => {
    if (realtime) {
      realtimeIntervalRef.current = setInterval(fetch, 5000);
    } else {
      if (realtimeIntervalRef.current) {
        clearInterval(realtimeIntervalRef.current);
      }
      
    }
  }, [realtime])

  return (
    <div className={styles.featureCardsCtr}>
      {features && features.sort((a,b) => (
          new Date(a.timestamp) < new Date(b.timestamp)
        )).map((feature) => (
        <div key={feature.id} onClick={() => {
          onSelect && onSelect(feature)
        }}>
          <FeatureDetailCard
            key={feature.id}
            feature={feature}
          />
        </div>
      ))}
    </div>
  );
}

export default UnderpassFeatureList;
