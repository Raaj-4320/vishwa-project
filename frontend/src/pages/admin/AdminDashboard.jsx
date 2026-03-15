import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';

export const AdminDashboard = () => (
  <div>
    <PageHeader title="Admin Dashboard" subtitle="Platform governance and ecosystem performance overview." />
    <SectionCard>
      <div className="grid-cards">
        <StatCard label="Users" value="2,540" />
        <StatCard label="Verified Pharmacies" value="338" tone="success" />
        <StatCard label="Disputes Open" value="12" tone="warning" />
      </div>
    </SectionCard>
  </div>
);
