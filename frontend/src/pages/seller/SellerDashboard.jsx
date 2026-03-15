import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard.jsx';
import { api } from '../../services/api.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

export const SellerDashboard = () => {
  const [stats, setStats] = useState({ medicines: 0, stock: 0, lowStock: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/seller/medicines');
        const rows = data?.data || [];
        const stock = rows.reduce((sum, row) => sum + Number(row.currentStock || 0), 0);
        const lowStock = rows.filter((row) => Number(row.currentStock || 0) <= 10).length;
        setStats({ medicines: rows.length, stock, lowStock });
      } catch {
        setStats({ medicines: 0, stock: 0, lowStock: 0 });
      }
    };
    load();
  }, []);

  return (
    <div>
      <PageHeader
        title="Seller Dashboard"
        subtitle="Track inventory health, catalog scale, and replenishment priorities in one place."
        actions={<Link className="btn" to="/seller/medicines/new">Add product</Link>}
      />
      <SectionCard title="Inventory overview" subtitle="Live summaries from your medicine ledger.">
        <div className="grid-cards">
          <StatCard label="Listed medicines" value={String(stats.medicines)} tone="success" hint="Total active + inactive products" />
          <StatCard label="Current stock units" value={String(stats.stock)} hint="Derived from purchase and sold totals" />
          <StatCard label="Low stock alerts" value={String(stats.lowStock)} tone="warning" hint="Items at or below 10 units" />
        </div>
      </SectionCard>
    </div>
  );
};
