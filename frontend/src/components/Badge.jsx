import React from 'react';

export default function Badge({ status, text }) {
  const s = (status || '').toUpperCase();
  let badgeClass = 'badge-orange';

  if (['ACTIVE', 'GOOD', 'PAID', 'COMPLETED', 'RESOLVED'].includes(s)) {
    badgeClass = 'badge-active';
  } else if (['EXPIRED', 'FAILED', 'CANCELLED', 'INACTIVE', 'NO_SHOW'].includes(s)) {
    badgeClass = 'badge-expired';
  } else if (['PENDING', 'NEEDS_REPAIR', 'EXPIRING_SOON'].includes(s)) {
    badgeClass = 'badge-pending';
  } else if (['UNDER_MAINTENANCE', 'SCHEDULED', 'IN_PROGRESS'].includes(s)) {
    badgeClass = 'badge-maintenance';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {text || status}
    </span>
  );
}
