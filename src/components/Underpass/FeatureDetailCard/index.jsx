import React from 'react';

import StatusBox from '../StatusBox';
import './styles.css';

function FeatureDetailCard({ feature }) {
  return (
    <article className='feature-card'>
      <div className='time-info'>
        <strong>Way&nbsp;{feature.id}</strong>
        <i className='text-secondary'>{feature.timestamp}</i>
      </div>
      <div>
        <b>building</b>&nbsp;|&nbsp;
        <span>{feature.buildingType}</span>
      </div>
      {/* Including this additional div to preserve the inline-block style of the StatusBox. */}
      <div>{feature.status && <StatusBox status={feature.status} />}</div>
      <div>
        {feature.comments.map((comment, index) => (
          <span key={comment} className='text-secondary'>
            {comment}
            {index !== feature.comments.length - 1 && ' '}
          </span>
        ))}
      </div>
    </article>
  );
}

export default FeatureDetailCard;
