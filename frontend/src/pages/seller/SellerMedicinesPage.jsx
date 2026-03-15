import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { api } from '../../services/api.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

export const SellerMedicinesPage = () => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/seller/medicines', { params: { search: query } });
      setRows(data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const displayRows = useMemo(() => rows.map((row) => ({
    ...row,
    rxRequired: row.rxRequired ? <StatusBadge status="warning" /> : <StatusBadge status="active" />,
    status: <StatusBadge status={row.status || 'active'} />,
    actions: <Link to={`/seller/medicines/${row.id}/edit`} className="btn btn-sm">Edit</Link>
  })), [rows]);

  return (
    <div>
      <PageHeader title="Medicines" subtitle="Manage product listings, prices and stock totals safely." actions={<Link className="btn" to="/seller/medicines/new">Add Product</Link>} />
      <SectionCard title="Search medicines" subtitle="Find by product name or barcode.">
        <form className="toolbar" onSubmit={(e) => { e.preventDefault(); load(search); }}>
          <input placeholder="Search by name or barcode" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="btn">Search</button>
        </form>
      </SectionCard>
      <SectionCard title="Medicine catalog">
        <DataTable
          loading={loading}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'barcode', label: 'Barcode' },
            { key: 'price', label: 'Price' },
            { key: 'currentStock', label: 'Stock' },
            { key: 'rxRequired', label: 'Rx' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' }
          ]}
          rows={displayRows}
          emptyText="No medicines added yet."
        />
      </SectionCard>
    </div>
  );
};
