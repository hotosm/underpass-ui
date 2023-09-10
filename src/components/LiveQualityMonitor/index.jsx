import React, { useEffect, useState } from 'react';

import styles from './styles.css';
import FeatureDetailCard from '../FeatureDetailCard';
import API from '../api';

function LiveQualityMonitor({
  tagKey,
  tagValue,
  page,
  onSelect
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
      {features && features.map((feature) => (
        <div onClick={() => {
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

export default LiveQualityMonitor;
