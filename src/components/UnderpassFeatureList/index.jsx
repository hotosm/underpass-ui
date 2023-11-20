
import React, { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
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
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const realtimeIntervalRef = useRef();
  const infiniteScrollRef = useRef(null);

  async function fetch(page) {
    if (!loading) {
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
          if (page && features) {
            setFeatures(features.concat(data));
          } else {
            setFeatures(data);
          }
          if (data && data.length > 0) {
            setHasMore(true);
            onUpdate && onUpdate(data[0]);
          } else {
            setHasMore(false);
          }
          setLoading(false);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
  }

  useEffect(() => {
    fetch();
    infiniteScrollRef.current.pageLoaded = 0;
  }, [tags, hashtag, status, area]);

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
      <InfiniteScroll
        pageStart={0}
        loadMore={fetch}
        hasMore={hasMore}
        useWindow={false}
        ref={infiniteScrollRef}
      >
        {features && features.map(feature => (
          feature && (
          <div key={feature && feature.id} onClick={() => {
            onSelect && onSelect(feature)
          }}> 
            <FeatureDetailCard
              key={feature.id}
              feature={feature}
            />
          </div>
        )))}
      </InfiniteScroll>
      {!loading && features && features.length == 0 &&
        <span className={styles.noResults}>No results</span>
      }
      {loading && 
        <span className={styles.loading}>Loading ...</span>
      }
    </div>
  );
}

export default UnderpassFeatureList;
