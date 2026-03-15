import { useEffect, useState } from 'react';
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
      <PageHeader title="Seller Dashboard" subtitle="Track inventory health, medicine count and low stock risk in one place." />
      <SectionCard>
        <div className="grid-cards">
          <StatCard label="Medicines" value={String(stats.medicines)} tone="success" hint="Total listed products" />
          <StatCard label="Current Stock Units" value={String(stats.stock)} hint="Derived from purchases/sales totals" />
          <StatCard label="Low Stock Items" value={String(stats.lowStock)} tone="warning" hint="Threshold ≤ 10 units" />
        </div>
      </SectionCard>
    </div>
  );
};
