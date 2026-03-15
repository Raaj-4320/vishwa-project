import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';

export const CustomerDashboard = () => (
  <div>
    <PageHeader
      title="Customer Dashboard"
      subtitle="Track orders, prescriptions, and discovery activity from one secure workspace."
      actions={<Link className="btn" to="/discover">Discover pharmacies</Link>}
    />
    <SectionCard title="Overview" subtitle="Your key activity signals at a glance.">
      <div className="grid-cards">
        <StatCard label="Active orders" value="3" tone="success" hint="Orders currently in progress" />
        <StatCard label="Pending prescriptions" value="1" tone="warning" hint="Awaiting pharmacist review" />
        <StatCard label="Saved medicines" value="8" hint="Ready for quick reorder" />
      </div>
    </SectionCard>
    <SectionCard title="Next best action" subtitle="Continue exploring serviceable stores to complete upcoming purchases.">
      <p className="hint-text">Use location-based discover to compare delivery and pickup availability before checkout.</p>
    </SectionCard>
  </div>
);
