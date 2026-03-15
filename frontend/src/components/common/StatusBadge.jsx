const toneMap = {
  active: 'success',
  inactive: 'danger',
  warning: 'warning',
  info: 'info',
  success: 'success',
  danger: 'danger',
  expired: 'danger',
  quarantined: 'warning'
};

const labelMap = {
  active: 'Active',
  inactive: 'Inactive',
  warning: 'Warning',
  info: 'Info',
  expired: 'Expired',
  quarantined: 'Quarantined',
  rx_required: 'Rx Required',
  otc: 'OTC'
};

export const StatusBadge = ({ status = 'info', label }) => {
  const key = String(status).toLowerCase();
  const tone = toneMap[key] || 'info';
  return <span className={`status-badge tone-${tone}`}>{label || labelMap[key] || status}</span>;
};
