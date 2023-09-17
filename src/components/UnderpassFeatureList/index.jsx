import React, { useEffect, useState, useRef } from 'react';

import styles from './styles.css';
import FeatureDetailCard from '../FeatureDetailCard';
import API from '../api';

function UnderpassFeatureList({
  tags,
  page,
  onSelect,
  realtime,
  onUpdate,
  config,
}) {

  const [features, setFeatures] = useState([]);
  const realtimeIntervalRef = useRef();

  async function fetch() {
    await API(config && config.API_URL)["rawList"](tags, page, {
      onSuccess: (data) => {
        setFeatures(data);
        onUpdate && onUpdate(data[0]);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }

  useEffect(() => {
    fetch();
  }, [tags]);

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
      {features && features.map((feature) => (
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
