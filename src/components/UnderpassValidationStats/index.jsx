import React, { useState, useEffect } from "react";
import API from "../api";
import {
  RawValidationStatsRequest
} from "../api/models";

const getEndpoint = (featureType) => {
  switch(featureType) {
    case "polygons":
    case "nodes":
    case "lines":
      return featureType;
    default:
      return "stats";
    }
}

const statusLabel = {
  badgeom: "Un-squared",
};

function UnderpassValidationStats({
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
  const request = new RawValidationStatsRequest(params);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await api.rawValidation[endpoint](request,
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
  }, [params.area, params.tags, params.hashtag, params.dateFrom, params.dateTo, params.status, featureType]);

  return (
    result && (
      <div>
        <div className="hui-b-2">
          <h3 className="hui-text-2xl hui-font-bold hui-text-primary">
            {result && result.total}
          </h3>
          <p className="font-bold">
            {params.tags} <span className="hui-font-normal">{label || "found"}</span>
          </p>
        </div>
        { params.status &&
        <div>
        <h3 className="hui-text-lg hui-font-bold hui-mb-2">
            {result.count}{" "}
            <span className="hui-text-base hui-font-normal">{statusLabel[params.status]}</span>
          </h3><div className="hui-rounded-md hui-bg-gray-300">
              <div
                className="hui-rounded-md hui-bg-primary hui-py-1.5"
                style={{
                  width: (result.count * 100) / result.total + "%",
                }}
              ></div>
            </div>
          </div>
        }
      </div>
    )
  );
}

export default UnderpassValidationStats;
