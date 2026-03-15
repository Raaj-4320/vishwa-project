import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

export const LandingPage = () => (
  <section className="hero">
    <PageHeader
      title="Location-Based Smart Medical Shop Platform"
      subtitle="A trusted healthcare commerce SaaS for medicine discovery, operations, and fulfillment without map dependency."
      actions={<Link to="/discover" className="btn">Discover Stores</Link>}
    />
    <SectionCard title="Why teams choose this platform" subtitle="Built for customers, pharmacies, and operators with secure role-based access.">
      <ul>
        <li>Location serviceability by city, area, locality and pincode.</li>
        <li>Prescription-aware ordering and operational inventory controls.</li>
        <li>Role-based dashboards for seller, admin, delivery and customer journeys.</li>
      </ul>
      <div className="actions">
        <Link to="/login" className="btn btn-secondary">Login</Link>
        <Link to="/register" className="btn">Create Account</Link>
      </div>
    </SectionCard>
  </section>
);
