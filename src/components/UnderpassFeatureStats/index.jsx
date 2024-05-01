import React, { useState, useEffect } from "react";
import API from "../api";

function UnderpassFeatureStats({
  area,
  tags,
  hashtag,
  dateFrom,
  dateTo,
  featureType,
  onSuccess,
  apiUrl,
  label,
  className,
}) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await API(apiUrl)["statsCount"](
        area,
        tags,
        hashtag,
        dateFrom,
        dateTo,
        featureType,
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
  }, [area, tags, hashtag, dateFrom, dateTo, featureType]);

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
