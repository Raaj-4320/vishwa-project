import { useEffect, useState } from 'react';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { api } from '../../services/api.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

export const SellerLowStockPage = () => {
  const [rows, setRows] = useState([]);
  const [threshold, setThreshold] = useState(10);
  const [loading, setLoading] = useState(false);

  const load = async (t = threshold) => {
    setLoading(true);
    try {
      const { data } = await api.get('/seller/alerts/low-stock', { params: { threshold: t } });
      setRows(data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageHeader title="Low Stock Alerts" subtitle="Monitor products below your selected minimum stock threshold." />
      <SectionCard right={<form className="toolbar" onSubmit={(e) => { e.preventDefault(); load(threshold); }}><input type="number" min="0" value={threshold} onChange={(e) => setThreshold(e.target.value)} /><button className="btn" type="submit">Apply filter</button></form>}>
        <DataTable
          loading={loading}
          columns={[{ key: 'name', label: 'Medicine' }, { key: 'barcode', label: 'Barcode' }, { key: 'currentStock', label: 'Current Stock' }]}
          rows={rows}
          emptyText="Great news — no products are currently below this threshold."
        />
      </SectionCard>
    </div>
  );
};
