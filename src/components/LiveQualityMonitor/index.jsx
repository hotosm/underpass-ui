import React, { useEffect, useState } from 'react';

import styles from './styles.css';
import FeatureDetailCard from '../FeatureDetailCard';
import API from '../api';

function LiveQualityMonitor({
  tagKey,
  tagValue,
  page
}) {

  const [features, setFeatures] = useState([]);

  useEffect(() => {
    async function fetchWays() {
      await API()["rawPolygonsList"](tagKey, tagValue, page, {
        onSuccess: (data) => {
          setFeatures(data);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
    fetchWays();
  }, [tagKey, tagValue]);

  return (
    <div className={styles.featureCardsCtr}>
      {features.map((feature) => (
        <FeatureDetailCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}

export default LiveQualityMonitor;
