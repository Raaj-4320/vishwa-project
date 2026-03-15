import { useEffect, useState } from 'react';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { api } from '../../services/api.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

export const SellerExpiryAlertsPage = () => {
  const [rows, setRows] = useState([]);
  const [days, setDays] = useState(60);
  const [loading, setLoading] = useState(false);

  const load = async (d = days) => {
    setLoading(true);
    try {
      const { data } = await api.get('/seller/alerts/expiry', { params: { days: d } });
      setRows(data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageHeader title="Expiry Alerts" subtitle="Track batches expiring within a selected horizon." />
      <SectionCard right={<form className="toolbar" onSubmit={(e) => { e.preventDefault(); load(days); }}><input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} /><button className="btn" type="submit">Apply</button></form>}>
        <DataTable
          loading={loading}
          columns={[{ key: 'medicineName', label: 'Medicine' }, { key: 'batchNo', label: 'Batch' }, { key: 'expiryDate', label: 'Expiry Date' }, { key: 'qty', label: 'Qty' }]}
          rows={rows}
          emptyText="No near-expiry batches."
        />
      </SectionCard>
    </div>
  );
};
