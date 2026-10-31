import React from 'react';

export default function Badge({ status, text }) {
  const s = (status || '').toUpperCase();
  let badgeClass = 'badge-silver';

  // Green: Active / Good / Completed / Paid / Resolved
  if (['ACTIVE', 'GOOD', 'COMPLETED', 'PAID', 'RESOLVED'].includes(s)) {
    badgeClass = 'badge-active';
  }
  // Red: Needs repair / Expired / Inactive / Failed / Cancelled / No show
  else if (['NEEDS_REPAIR', 'EXPIRED', 'INACTIVE', 'FAILED', 'CANCELLED', 'NO_SHOW'].includes(s)) {
    badgeClass = 'badge-expired';
  }
  // Amber: Scheduled / Pending / Under maintenance / Expiring soon / In progress
  else if (['SCHEDULED', 'PENDING', 'UNDER_MAINTENANCE', 'EXPIRING_SOON', 'IN_PROGRESS'].includes(s)) {
    badgeClass = 'badge-pending';
  }
  // Any other: Silver / Grey
  else {
    badgeClass = 'badge-silver';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {text || status}
    </span>
  );
}
