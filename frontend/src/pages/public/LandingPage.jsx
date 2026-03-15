import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

const roleCards = [
  {
    key: 'customer',
    title: 'Customer Portal',
    desc: 'Order medicines, upload prescriptions, and track delivery updates securely.'
  },
  {
    key: 'seller',
    title: 'Seller Portal',
    desc: 'Manage medicines, batches, purchases, low-stock, and expiry workflows.'
  },
  {
    key: 'admin',
    title: 'Admin Portal',
    desc: 'Access governance dashboards, audit logs, and platform-wide controls.'
  }
];

export const LandingPage = () => (
  <section className="hero landing-role-hero">
    <PageHeader
      title="MediFlow Healthcare Commerce Platform"
      subtitle="Choose your workspace and continue with role-specific authentication and operations."
      actions={<Link to="/discover" className="btn btn-secondary">Discover pharmacies</Link>}
    />

    <SectionCard title="Choose your portal" subtitle="Sign in or register based on your role.">
      <div className="role-gateway-grid">
        {roleCards.map((role) => (
          <article key={role.key} className="role-gateway-card">
            <h3>{role.title}</h3>
            <p className="hint-text">{role.desc}</p>
            <div className="actions">
              <Link to={`/login?role=${role.key}`} className="btn">{role.key[0].toUpperCase() + role.key.slice(1)} Login</Link>
              <Link to={`/register?role=${role.key}`} className="btn btn-secondary">{role.key[0].toUpperCase() + role.key.slice(1)} Register</Link>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  </section>
);
