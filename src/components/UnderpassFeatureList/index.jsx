import React, { useEffect, useState, useRef } from "react";
import FeatureDetailCard from "../FeatureDetailCard";
import API from "../api";

function UnderpassFeatureList({
  area,
  tags,
  hashtag,
  dateFrom,
  dateTo,
  status,
  orderBy,
  page,
  onSelect,
  realtime,
  onUpdate,
  onFetchFirstTime,
  config,
  style,
  className,
  featureType,
}) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const realtimeIntervalRef = useRef();
  const loadedRef = useRef();
  const pageRef = useRef(0);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      pageRef.current += 1;
      fetch(pageRef.current);
    }
  };

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
        featureType,
        page,
        orderBy,
        {
          onSuccess: (data) => {
            if (page && features) {
              setFeatures(features.concat(data));
            } else {
              setFeatures(data);
            }
            if (data && data.length > 0) {
              setHasMore(true);
              onUpdate && onUpdate(data[0]);
              if (loadedRef.current) {
                onFetchFirstTime && onFetchFirstTime(data[0]);
                loadedRef.current = false;
              }
            } else {
              setHasMore(false);
            }
            setLoading(false);
          },
          onError: (error) => {
            console.log(error);
          },
        },
      );
    }
  }

  useEffect(() => {
    pageRef.current = 0;
    fetch();
  }, [tags, hashtag, status, area, featureType]);

  useEffect(() => {
    if (realtime) {
      realtimeIntervalRef.current = setInterval(fetch, 10000);
    } else {
      if (realtimeIntervalRef.current) {
        clearInterval(realtimeIntervalRef.current);
      }
    }
  }, [realtime]);

  return (
    <div
      style={{ "overflow-y": "scroll", ...style }}
      className={className}
      onScroll={handleScroll}
    >
      {features &&
        features.map(
          (feature, index) =>
            feature && (
              <div
                key={feature && feature.id}
                className="border-b pb-5"
                onClick={() => {
                  onSelect && onSelect(feature);
                }}
              >
                <FeatureDetailCard key={feature.id} feature={feature} />
              </div>
            ),
        )}
      {!loading && features && features.length === 0 && (
        <span className="text-sm text-secondary-light">No results</span>
      )}
      {loading && (
        <span className="text-sm text-secondary-light">Loading ...</span>
      )}
    </div>
  );
}

export default UnderpassFeatureList;
