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
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-primary">
            {result && result.total}
          </h3>
          <p className="font-bold">
            {params.tags} <span className="font-normal">{label || "found"}</span>
          </p>
        </div>
        { params.status &&
        <><h3 className="text-lg font-bold mb-2">
            {result.count}{" "}
            <span className="text-base font-normal">{statusLabel[params.status]}</span>
          </h3><div className="rounded-md bg-gray-300">
              <div
                className="rounded-md bg-primary py-1.5"
                style={{
                  width: (result.count * 100) / result.total + "%",
                }}
              ></div>
            </div></>
        }
      </div>
    )
  );
}

export default UnderpassValidationStats;
