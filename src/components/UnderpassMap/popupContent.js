import React from "react";
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
    <div className="hui-space-y-3 hui-text-lg hui-truncate hui-popup-content">
      <table className="hui-table-auto hui-w-full">
        <tbody>
          <tr>
            <td colSpan="2" className="hui-t-1 hui-pb-1">
              <b>{type}</b>&nbsp;
              <a
                className="hui-no-decoration"
                target="blank"
                href={`https://www.openstreetmap.org/${type}/${feature.id}`}
              >
               {feature.id}
              </a>
              <br />
              <abbr title={feature.properties.closed_at}>
                <TimeAgo
                  date={feature.properties.closed_at}
                  formatter={formatter}
                />
              </abbr>
            </td>
          </tr>
          {visibleTags.map((tag) => (
            <tr key={tag} className="hui-border-b">
              <td className="hui-pr-5 hui-pt-1 hui-pb-1">{tag}</td>
              <td className="hui-p2-5 hui-pb-1">
                <abbr title={tags[tag]}>{tags[tag]}</abbr>
              </td>
            </tr>
          ))}
          {highlightDataQualityIssues && feature.properties.status && (
            <tr>
              <td colSpan="2" className="hui-pt-1 hui-pb-1">
                <StatusBox status={feature.properties.status} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
