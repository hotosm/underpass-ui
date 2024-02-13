import React from "react";

const getStatusLabel = (status) => {
  switch (status) {
    case "overlapping":
      return "Overlapping";
    case "badgeom":
      return "Un-squared";
    case "badvalue":
      return "Bad value";
    // Add more cases for other values
    default:
      return status;
  }
};
const getStatusClass = (status) => {
  switch (status) {
    case "overlapping":
      return "statusOverlapping";
    case "badgeom":
      return "statusBadgeom";
    case "badvalue":
      return "statusBadValue";
    // Add more cases for other values
    default:
      return "statusDefault";
  }
};

function StatusBox({ status }) {
  const statusClass = getStatusClass(status);
  return (
    <div className="inline-flex items-center rounded-md bg-primary px-2 py-1 text-sm font-medium text-white">
      {getStatusLabel(status)}
    </div>
  );
}

export default StatusBox;
