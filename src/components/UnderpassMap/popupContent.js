import React, { useState } from "react";
import StatusBox from "../StatusBox";
import TimeAgo from "react-timeago";
import enStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const formatter = buildFormatter(enStrings);

export default function PopupContent({ feature, highlightDataQualityIssues }) {
  const tags = JSON.parse(feature.properties.tags);
  const visibleTags = Object.keys(tags);

  let type = feature.type;
  if (feature.type === "Feature") {
    if (feature.geometry.type === "Point") {
      type = "node";
    } else {
      type = "way";
    }
  }

  return (
    <div className="space-y-3 text-lg truncate">
      <table className="table-auto w-full">
        <tbody>
          <tr>
            <td colSpan="2" className="pt-1 pb-1">
              <b>{type}</b>&nbsp;
              <a
                target="blank"
                href={`https://www.openstreetmap.org/${type}/${feature.id}`}
              >
                {feature.id}
              </a>
              <br />
              <abbr title={feature.properties.created_at}>
                <TimeAgo
                  date={feature.properties.created_at}
                  formatter={formatter}
                />
              </abbr>
            </td>
          </tr>
          {visibleTags.map((tag) => (
            <tr key={tag} className="border-b">
              <td className="pr-5 pt-1 pb-1">{tag}</td>
              <td className="p2-5 pb-1">
                <abbr title={tags[tag]}>{tags[tag]}</abbr>
              </td>
            </tr>
          ))}
          {highlightDataQualityIssues && feature.properties.status && (
            <tr>
              <td colSpan="2" className="pt-1 pb-1">
                <StatusBox status={feature.properties.status} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
