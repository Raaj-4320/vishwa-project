import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';

export const CustomerDashboard = () => (
  <div>
    <PageHeader title="Customer Dashboard" subtitle="Track your order activity, prescriptions and saved items." />
    <SectionCard>
      <div className="grid-cards">
        <StatCard label="Active Orders" value="3" tone="success" hint="Orders currently in progress" />
        <StatCard label="Pending Prescriptions" value="1" tone="warning" hint="Awaiting review" />
        <StatCard label="Wishlist Items" value="8" hint="Saved for future purchase" />
      </div>
    </SectionCard>
  </div>
);
