import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

const roleCards = [
  { key: 'customer', title: 'Customer', desc: 'Login or register as customer to place and track orders.' },
  { key: 'seller', title: 'Seller', desc: 'Login or register as seller to manage inventory and operations.' },
  { key: 'admin', title: 'Admin', desc: 'Login or register as admin to access platform control tools.' }
];

export const LandingPage = () => (
  <section className="hero landing-role-hero">
    <PageHeader
      title="MediFlow Healthcare Commerce Platform"
      subtitle="Choose one role below to open the correct login and registration flow."
    />

    <SectionCard title="Role selection" subtitle="These are the 3 options you requested.">
      <div className="role-primary-actions">
        <Link to="/login?role=customer" className="btn">Customer</Link>
        <Link to="/login?role=seller" className="btn">Seller</Link>
        <Link to="/login?role=admin" className="btn">Admin</Link>
      </div>
    </SectionCard>

    <SectionCard title="Portal details" subtitle="Each role opens a dedicated login/register page.">
      <div className="role-gateway-grid">
        {roleCards.map((role) => (
          <article key={role.key} className="role-gateway-card">
            <h3>{role.title}</h3>
            <p className="hint-text">{role.desc}</p>
            <div className="actions">
              <Link to={`/login?role=${role.key}`} className="btn">{role.title} Login</Link>
              <Link to={`/register?role=${role.key}`} className="btn btn-secondary">{role.title} Register</Link>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  </section>
);
