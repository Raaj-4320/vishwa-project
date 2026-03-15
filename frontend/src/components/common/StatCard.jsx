export const StatCard = ({ label, value, tone = 'default' }) => (
  <div className={`card tone-${tone}`}>
    <p>{label}</p>
    <h3>{value}</h3>
  </div>
);
