import React, { useState, useEffect } from "react";
import API from "../api";
import styles from './styles.css'

function UnderpassFeatureStats({
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

  return (
    <div>
      <h3 className={styles.title}>{result && result.count}</h3>
      <p className={styles.subTitle}>{tags} <span className={styles.label}>mapped</span></p>
    </div>
  )
}

export default UnderpassFeatureStats
