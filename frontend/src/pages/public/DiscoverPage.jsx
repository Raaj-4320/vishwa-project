import { useState } from 'react';
import { api } from '../../services/api.js';
import { DataTable } from '../../components/tables/DataTable.jsx';

export const DiscoverPage = () => {
  const [filters, setFilters] = useState({ city: '', area: '', locality: '', pincode: '' });
  const [rows, setRows] = useState([]);

  const onSearch = async (e) => {
    e.preventDefault();
    const { data } = await api.get('/pharmacies/discover', { params: filters });
    setRows(data.data || []);
  };

  return (
    <div>
      <h2>Store Discovery</h2>
      <form className="grid" onSubmit={onSearch}>
        {Object.keys(filters).map((field) => (
          <input key={field} placeholder={field} value={filters[field]} onChange={(e) => setFilters((p) => ({ ...p, [field]: e.target.value }))} />
        ))}
        <button className="btn" type="submit">Search</button>
      </form>
      <DataTable columns={[{ key: 'name', label: 'Store' }, { key: 'serviceabilityMatchedBy', label: 'Matched By' }]} rows={rows} emptyText="No stores service this location yet." />
    </div>
  );
};
