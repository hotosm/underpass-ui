import React from 'react';

import StatusBox from '../StatusBox';
import './styles.css';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

function FeatureDetailCard({ feature }) {
  
  return (
    <article className='feature-card'>
      <div className='time-info'>
        <strong>Way&nbsp;<a rel="noreferrer" target="_blank" href={"https://osm.org/way/" + feature.id}>{feature.id}</a></strong>
        <abbr className='text-secondary' title={feature.timestamp}>{timeAgo.format(new Date(feature.timestamp), 'round')}</abbr>
      </div>
      <div>
      <table>
        {Object.keys(feature.tags).map((key) => (
          <tr className="tags">
            <td className="key">{key}</td>
            <td className="value">{feature.tags[key]}</td>
          </tr>
        ))}
      </table>
      </div>
      {/* Including this additional div to preserve the inline-block style of the StatusBox. */}
      <div>{feature.status && <StatusBox status={feature.status} />}</div>
      {/* <div>
        {feature.comments.map((comment, index) => (
          <span key={comment} className='text-secondary'>
            {comment}
            {index !== feature.comments.length - 1 && ' '}
          </span>
        ))}
      </div> */}
    </article>
  );
}

export default FeatureDetailCard;
