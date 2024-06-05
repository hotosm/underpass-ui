import React, { useEffect, useState, useRef } from "react";
import FeatureDetailCard from "../FeatureDetailCard";
import API from "../api";
import {
  RawValidationListRequest
} from "../api/models";

const getEndpoint = (featureType) => {
  switch(featureType) {
    case "polygons":
      return "polygonsList";
    case "lines":
      return "linesList";
    case "nodes":
      return "nodesList";
    default:
      return "list";
    }
}

function UnderpassFeatureList({
  onSelect,
  onUpdate,
  onFetchFirstTime,
  featureType,
  realtime,
  config,
  style,
  className,
  aoi,
  ...params
}) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [fetchSwitch, setFetchSwitch] = useState(false);
  const [page, setPage] = useState(0);
  const featureIndexes = useRef({});
  const [loaded, setLoaded] = useState(false);
  const listDivRef = useRef(null);
  const request = new RawValidationListRequest(params);

  const api = API(config && config.API_URL);
  const endpoint = getEndpoint(featureType);

  // Handle infinite list scroll
  const handleScroll = (e) => {
    const bottom =
      e.target.clientHeight + e.target.scrollTop >= e.target.scrollHeight;
    if (bottom && hasMore && !loading) {
      setPage(page+1);
    }
  };

  // Get data from the API
  useEffect(() => {
    async function fetch() {
      request.page = page;
      if (!loading) {
        setLoading(true);
        const request = new RawValidationListRequest(params);
        console.log(params);
        await api.rawValidation[endpoint](request,
          {
            onSuccess: (data) => {
              if (page && features) {
                  const newFeatures = [];
                  data.forEach(feature => {
                    if (!featureIndexes.current[feature.id]) {
                      newFeatures.push(feature);
                      featureIndexes.current[feature.id] = true;
                    }
                    setFeatures([...features, ...newFeatures]);
                  })
              } else {
                setFeatures(data);
                featureIndexes.current = {};
                data.forEach(feature => {
                  featureIndexes.current[feature.id] = true;
                });
              }
              if (data && data.length > 0) {
                setHasMore(true);
                onUpdate && onUpdate(data[0]);
                if (!loaded) {
                  onFetchFirstTime && onFetchFirstTime(data[0]);
                  setLoaded(true);
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
    fetch();
  }, [page, fetchSwitch]);

  // Get new data from API
  useEffect(() => {
    if (!realtime) { return; }
    async function fetch() {
      request.page = 0;
      await api.rawValidation[endpoint](request,
        {
          onSuccess: (data) => {
            if (features) {
              const newFeatures = [];
              data.forEach(feature => {
                if (!featureIndexes.current[feature.id]) {
                  newFeatures.push(feature);
                  featureIndexes.current[feature.id] = true;  
                }
              })
              if (newFeatures.length > 0) {
                setFeatures([...newFeatures, ...features]);
              }
            }
          }
        }
      )
    }
    fetch();
  }, [realtime, fetchSwitch]);

  // Reset page and scroll when params change
  useEffect(() => {
    setPage(0);
    setFetchSwitch(!fetchSwitch);
    setFeatures([]);
    listDivRef.current.scrollTo(0, 0);
  }, [
    params.tags, params.hashtag, params.status, params.area, featureType]);
    
  // Realtime handler (fetch data every X seconds)
  useEffect(() => {
    if (realtime) {
      const realtimeInterval = setInterval(() => {
        setFetchSwitch(!fetchSwitch);
      }, 1000);
      return () => {
        clearInterval(realtimeInterval);
      };
    }
  }, [realtime, fetchSwitch]);

  return (
    <div
      style={{ overflowY: "scroll", ...style, "height": "350px" }}
      className={className || "hui-theme"}
      onScroll={handleScroll}
      ref={listDivRef}
    >
      {features &&
        features.map(
          (feature, index) =>
            feature && (
              <div
                key={feature && feature.id}
                className="hui-list-item"
                onClick={() => {
                  onSelect && onSelect(feature);
                }}
              >
                <FeatureDetailCard key={feature.id} feature={feature} />
              </div>
            ),
        )}
      {!loading && features && features.length === 0 && (
        <span className="hui-text-sm hui-text-secondary-light">No results</span>
      )}
      {loading && (
        <span className="hui-text-sm hui-text-secondary-light">Loading ...</span>
      )}
    </div>
  );
}

export default UnderpassFeatureList;
