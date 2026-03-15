export const SectionCard = ({ title, subtitle, children, right }) => (
  <section className="section-card">
    {(title || right || subtitle) ? (
      <div className="section-card-head">
        <div className="section-card-copy">
          {title ? <h3>{title}</h3> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {right ? <div className="section-card-actions">{right}</div> : null}
      </div>
    ) : null}
    <div className="section-card-body">{children}</div>
  </section>
);
