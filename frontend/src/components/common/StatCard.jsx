export const StatCard = ({ label, value, tone = 'default', hint }) => (
  <article className={`card stat-card tone-${tone}`}>
    <p className="stat-label">{label}</p>
    <h3 className="stat-value">{value}</h3>
    {hint ? <p className="stat-hint">{hint}</p> : null}
  </article>
);
