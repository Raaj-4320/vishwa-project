import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { api } from '../../services/api.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

export const SellerInventoryBatchesPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/seller/inventory/batches');
        setRows(data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayRows = useMemo(() => rows.map((r) => ({ ...r, status: <StatusBadge status={r.status || 'active'} />, actions: <Link to={`/seller/inventory/batches/${r.id}/edit`} className="btn btn-sm">Edit</Link> })), [rows]);

  return (
    <div>
      <PageHeader title="Inventory Batches" subtitle="Maintain batch-level stock, reserve quantities, and expiry lifecycle." actions={<Link className="btn" to="/seller/inventory/batches/new">Add Batch</Link>} />
      <SectionCard title="Batch register">
        <DataTable
          loading={loading}
          columns={[
            { key: 'medicineName', label: 'Medicine' },
            { key: 'batchNo', label: 'Batch No' },
            { key: 'expiryDate', label: 'Expiry' },
            { key: 'qty', label: 'Qty' },
            { key: 'reservedQty', label: 'Reserved' },
            { key: 'status', label: 'Status' },
            { key: 'sellingPrice', label: 'Selling Price' },
            { key: 'actions', label: 'Actions' }
          ]}
          rows={displayRows}
          emptyText="No inventory batches found yet. Create your first batch to begin tracking."
        />
      </SectionCard>
    </div>
  );
};
