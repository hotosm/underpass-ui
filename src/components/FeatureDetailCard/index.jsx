import React from "react";

import StatusBox from "../StatusBox";
import TimeAgo from "react-timeago";
import enStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const formatter = buildFormatter(enStrings);

function FeatureDetailCard({ feature }) {
  return (
    <article className="space-y-3">
      <div className="flex">
        <strong>
          {feature.type} &nbsp;
          <a
            rel="noreferrer"
            target="_blank"
            href={"https://osm.org/" + feature.type + "/" + feature.id}
          >
            {feature.id}
          </a>
        </strong>
        {feature.created_at && (
          <abbr
            className="text-right"
            style={{ flex: 2 }}
            title={feature.created_at}
          >
            <TimeAgo date={feature.created_at} formatter={formatter} />
          </abbr>
        )}
      </div>
      <div>
        <table className="table-auto w-full">
          <tbody>
            {feature.tags &&
              Object.keys(feature.tags).map((key) => (
                <tr key={[key, feature.tags[key]].join("=")}>
                  <td className="font-bold">{key}</td>
                  <td className="text-right">
                    <abbr title={feature.tags[key]}>{feature.tags[key]}</abbr>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Including this additional div to preserve the inline-block style of the StatusBox. */}
      <div>{feature.status && <StatusBox status={feature.status} />}</div>
    </article>
  );
}

export default FeatureDetailCard;
