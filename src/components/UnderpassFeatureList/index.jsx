import React, { useEffect, useState, useRef } from 'react';

import styles from './styles.css';
import FeatureDetailCard from '../FeatureDetailCard';
import API from '../api';

function UnderpassFeatureList({
  area,
  tags,
  hashtag,
  dateFrom,
  dateTo,
  status,
  page,
  onSelect,
  realtime,
  onUpdate,
  config,
}) {

  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const realtimeIntervalRef = useRef();

  async function fetch() {
    setLoading(true);
    await API(config && config.API_URL)["rawList"](
      area,
      tags,
      hashtag,
      dateFrom,
      dateTo,
      status,
      page, {
      onSuccess: (data) => {
        setFeatures(data);
        setLoading(false);
        onUpdate && onUpdate(data[0]);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }

  useEffect(() => {
    fetch();
  }, [tags, hashtag, status]);

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
      {!loading && features.length == 0 &&
        <span className={styles.noResults}>No results</span>
      }
      {loading && 
        <span className={styles.loading}>Loading ...</span>
      }
    </div>
  );
}

export default UnderpassFeatureList;
