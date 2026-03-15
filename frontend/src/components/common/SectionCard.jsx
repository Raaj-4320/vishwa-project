export const SectionCard = ({ title, subtitle, children, right }) => (
  <section className="section-card">
    {(title || right || subtitle) ? (
      <div className="section-card-head">
        <div>
          {title ? <h3>{title}</h3> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {right ? <div>{right}</div> : null}
      </div>
    ) : null}
    {children}
  </section>
);
