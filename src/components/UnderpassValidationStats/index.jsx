import React, { useState, useEffect } from "react";
import API from "../api";

const statusLabel = {
  "badgeom": "Un-squared",
}

function UnderpassValidationStats({
    area, 
    tags, 
    hashtag, 
    dateFrom, 
    dateTo, 
    status,
    featureType,
    onSuccess,
    apiUrl,
    className,
  }) {

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await API(apiUrl)["statsCount"](area, tags, hashtag, dateFrom, dateTo, status, featureType,{
        onSuccess: (data) => {
          setResult(data);
          setLoading(false);
          onSuccess && onSuccess(data);
        },
        onError: (error) => {
          setLoading(false);
          console.log(error);
        },
      });
    };
    getData();
  }, [area, tags, hashtag, dateFrom, dateTo, status]);

  return (result &&
    <div>
      <h3 className="text-lg font-bold mb-2">
        {result.count} <span className="text-base font-normal">{statusLabel[status]}</span>
      </h3>
      <div className="rounded-md bg-gray-300">
        <div className="rounded-md bg-primary py-1.5" style={{
          "width": (result.count * 100 / result.total) + "%"
        }}></div>
      </div> 
    </div>
  )
}

export default UnderpassValidationStats
