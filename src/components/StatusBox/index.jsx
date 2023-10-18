import React from 'react'
import styles from './styles.css'

const getStatusLabel = (status) => {
  switch (status) {
    case 'overlapping':
      return 'Overlapping'
    case 'badgeom':
      return 'Un-squared'
    // Add more cases for other values
    default:
      return status
  }
}
const getStatusClass = (status) => {
  switch (status) {
    case 'overlapping':
      return 'statusOverlapping'
    case 'badgeom':
      return 'statusBadgeom'
    // Add more cases for other values
    default:
      return 'statusDefault'
  }
}

function StatusBox({ status }) {
  const statusClass = getStatusClass(status);
  return (
    <div className={[styles.statusCtr, styles[statusClass]].join(' ')}>
      {getStatusLabel(status)}
    </div>
  )
}

export default StatusBox
