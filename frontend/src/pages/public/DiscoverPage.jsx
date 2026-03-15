import { useState } from 'react';
import { api } from '../../services/api.js';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { ErrorState } from '../../components/common/FeedbackState.jsx';

export const DiscoverPage = () => {
  const [filters, setFilters] = useState({ city: '', area: '', locality: '', pincode: '' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/pharmacies/discover', { params: filters });
      setRows(data.data || []);
    } catch {
      setError('Unable to fetch stores right now. Please retry in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Discover Pharmacies" subtitle="Find serviceable stores by city, area, locality, and pincode." />
      <SectionCard title="Search criteria" subtitle="Enter at least one location field to narrow results.">
        <form className="form-grid" onSubmit={onSearch}>
          {Object.keys(filters).map((field) => (
            <input key={field} placeholder={field.charAt(0).toUpperCase()+field.slice(1)} value={filters[field]} onChange={(e) => setFilters((p) => ({ ...p, [field]: e.target.value }))} />
          ))}
          <button className="btn" type="submit">Search stores</button>
        </form>
        {error ? <ErrorState text={error} /> : null}
      </SectionCard>
      <SectionCard title="Serviceable stores">
        <DataTable
          loading={loading}
          columns={[{ key: 'name', label: 'Store' }, { key: 'serviceabilityMatchedBy', label: 'Matched By' }, { key: 'supportsDelivery', label: 'Delivery' }, { key: 'supportsPickup', label: 'Pickup' }]}
          rows={rows.map((r) => ({ ...r, supportsDelivery: r.supportsDelivery ? 'Available' : 'Unavailable', supportsPickup: r.supportsPickup ? 'Available' : 'Unavailable' }))}
          emptyText="No stores currently match this location selection."
        />
      </SectionCard>
    </div>
  );
};
