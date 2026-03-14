import { StatCard } from '../../components/common/StatCard.jsx';

export const AdminDashboard = () => (
  <div>
    <h2>Admin Dashboard</h2>
    <div className="grid-cards">
      <StatCard label="Users" value="2,540" />
      <StatCard label="Verified Pharmacies" value="338" tone="success" />
      <StatCard label="Disputes Open" value="12" tone="warning" />
    </div>
  </div>
);
