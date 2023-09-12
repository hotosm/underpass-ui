import React, { useState } from "react";

import styles from "./styles.css";
import StatusBox from '../StatusBox';
import TimeAgo from 'react-timeago'
import enStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const formatter = buildFormatter(enStrings)

export default function Popup({ feature, highlightDataQualityIssues }) {
    const tags = JSON.parse(feature.properties.tags);
    const [showAll, setShowAll] = useState(false);
  
    const toggleShowAll = () => {
      setShowAll(!showAll);
    };
  
    const visibleTags = showAll
      ? Object.keys(tags)
      : Object.keys(tags).slice(0, 2);
  
    let type = feature.type;
    if (feature.type == "Feature") {
      if (feature.geometry.type == "Point") {
        type = "node";
      } else {
        type = "way";
      }
    }

    return (
      <div className={styles.popup}>
        <table>
          <tbody>
            <tr>
              <td colSpan="2">
                <b>{
                  type
                }:</b>&nbsp;
                <a
                  target="blank"
                  href={`https://www.openstreetmap.org/${type}/${feature.id}`}
                >
                  {feature.id}
                </a>
                <br />
                <abbr className={styles.timestamp} title={feature.properties.timestamp}>
                  <TimeAgo date={feature.properties.timestamp} formatter={formatter} />
                </abbr>
              </td>
            </tr>
            {visibleTags.map((tag) => (
              <tr key={tag}>
                <td width="60%">{tag}</td>
                <td width="40%">
                  <abbr title={tags[tag]}>
                    {tags[tag]}
                  </abbr>
                </td>
              </tr>
            ))}
            {highlightDataQualityIssues && feature.properties.status && (
              <tr>
                <td colSpan="2">
                  <StatusBox status={feature.properties.status} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!showAll && Object.keys(tags).length > 2 && (
          <button className={styles.moreBtn} onClick={toggleShowAll}>
            More ...
          </button>
        )}
      </div>
    );
  }