import React from 'react';
import './styles.css';

const getStatusClass = (status) => {
  switch (status) {
    case 'Un-squared':
      return 'status-un-squared';
    case 'Overlapping':
      return 'status-overlapping';
    case 'Badgeom':
      return 'status-badgeom';
    // Add more cases for other statuses and classes
    default:
      return 'status-default';
  }
};

function StatusBox({ status }) {
  const statusClass = getStatusClass();
  return <div className={`status-ctr ${statusClass}`}>{status}</div>;
}

export default StatusBox;
