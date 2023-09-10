import React from 'react'
import styles from './styles.css'

const getStatusClass = (status) => {
  switch (status) {
    case 'overlapping':
      return 'statusOverlapping'
    case 'badgeom':
      return 'statusBadgeom'
    // Add more cases for other statuses and classes
    default:
      return 'statusDefault'
  }
}

function StatusBox({ status }) {
  const statusClass = getStatusClass(status);
  return (
    <div className={[styles.statusCtr, styles[statusClass]].join(' ')}>
      {status}
    </div>
  )
  //  ${statusClass}`}>{status}</div>;
}

export default StatusBox
