import { StatCard } from '../../components/common/StatCard.jsx';

export const SellerDashboard = () => (
  <div>
    <h2>Seller Dashboard</h2>
    <div className="grid-cards">
      <StatCard label="Today Sales" value="₹12,400" tone="success" />
      <StatCard label="Low Stock Alerts" value="6" tone="warning" />
      <StatCard label="Expiry < 60 days" value="9" tone="danger" />
    </div>
  </div>
);
