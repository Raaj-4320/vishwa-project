import { StatCard } from '../../components/common/StatCard.jsx';

export const CustomerDashboard = () => (
  <div>
    <h2>Customer Dashboard</h2>
    <div className="grid-cards">
      <StatCard label="Active Orders" value="3" tone="success" />
      <StatCard label="Pending Prescriptions" value="1" tone="warning" />
      <StatCard label="Wishlist Items" value="8" />
    </div>
  </div>
);
