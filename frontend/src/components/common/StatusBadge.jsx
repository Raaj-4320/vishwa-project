export const StatusBadge = ({ status = 'info' }) => {
  const tone = String(status).toLowerCase();
  return <span className={`status-badge tone-${tone}`}>{status}</span>;
};
