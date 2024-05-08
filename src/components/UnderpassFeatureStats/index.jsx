import React, { useState, useEffect } from "react";
import API from "../api";
import {
  StatsRequest
} from "../api/models";

const getEndpoint = (featureType) => {
  switch(featureType) {
    case "polygons":
    case "nodes":
    case "lines":
      return featureType;
    default:
      return "features";
    }
}

function UnderpassFeatureStats({
  onSuccess,
  featureType,
  config,
  label,
  className,
  ...params
}) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const api = API(config && config.API_URL);
  const endpoint = getEndpoint(featureType);
  const request = new StatsRequest(params);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await api.raw[endpoint](request,
        {
          onSuccess: (data) => {
            setResult(data);
            setLoading(false);
            onSuccess && onSuccess(data);
          },
          onError: (error) => {
            setLoading(false);
            console.log(error);
          },
        },
      );
    };
    getData();
  }, [params.area, params.tags, params.hashtag, params.dateFrom, params.dateTo, featureType]);

  return (
    <div>
      <h3 className="text-2xl font-bold text-primary">
        {result && result.count}
      </h3>
      <p className="font-bold">
        {tags} <span className="font-normal">{label || "found"}</span>
      </p>
    </div>
  );
}

export default UnderpassFeatureStats;
