import React, { useEffect, useState } from 'react';

import './styles.css';
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
      await API()['rawPolygonsList'](tagKey, tagValue, page, {
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
    <div className='feature-cards-ctr'>
      {features.map((feature) => (
        <FeatureDetailCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}

export default LiveQualityMonitor;
