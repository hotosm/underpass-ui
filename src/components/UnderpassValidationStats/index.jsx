import React, { useState, useEffect } from "react";
import API from "../api";
import styles from './styles.css'

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
    onSuccess,
    apiUrl,
    className,
  }) {

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await API(apiUrl)["statsCount"](area, tags, hashtag, dateFrom, dateTo, status, {
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
      <h3 className={styles.title}>{result.count} <span className={styles.statusLabel}>{statusLabel[status]}</span></h3>
      <div className={styles.bar}>
        <div className={styles.barValue} style={{
          "width": (result.count * 100 / result.total) + "%"
        }}></div>
      </div> 
    </div>
  )
}

export default UnderpassValidationStats
