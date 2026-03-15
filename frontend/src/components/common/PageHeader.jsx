export const PageHeader = ({ title, subtitle, actions }) => (
  <header className="page-header">
    <div>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
    {actions ? <div className="page-actions">{actions}</div> : null}
  </header>
);
