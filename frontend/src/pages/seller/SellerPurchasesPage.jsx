import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { api } from '../../services/api.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

export const SellerPurchasesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ sellerMedicineId: '', qty: 0, unitCost: 0, invoiceNo: '', supplier: '', purchaseDate: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [medRes, purRes] = await Promise.all([api.get('/seller/medicines'), api.get('/seller/purchases')]);
      setMedicines(medRes.data?.data || []);
      setRows(purRes.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalCost = useMemo(() => Number(form.qty || 0) * Number(form.unitCost || 0), [form.qty, form.unitCost]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.sellerMedicineId || !form.invoiceNo.trim() || !form.supplier.trim() || !form.purchaseDate) {
      setError('All fields are required.');
      return;
    }
    if ([Number(form.qty), Number(form.unitCost)].some((v) => Number.isNaN(v) || v < 0)) {
      setError('Qty and unit cost must be non-negative.');
      return;
    }

    try {
      await api.post('/seller/purchases', {
        ...form,
        qty: Number(form.qty),
        unitCost: Number(form.unitCost),
        purchaseDate: new Date(`${form.purchaseDate}T00:00:00.000Z`).toISOString()
      });
      setForm({ sellerMedicineId: '', qty: 0, unitCost: 0, invoiceNo: '', supplier: '', purchaseDate: '' });
      setSuccess('Purchase entry saved and stock totals updated.');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save purchase.');
    }
  };

  return (
    <div>
      <PageHeader title="Purchase Entry" subtitle="Record inbound stock and keep inventory totals synchronized." />
      <SectionCard title="New purchase" subtitle="Fields marked * are required.">
        <form className="form-grid" onSubmit={onSubmit}>
          <select value={form.sellerMedicineId} onChange={(e) => setForm((p) => ({ ...p, sellerMedicineId: e.target.value }))}>
            <option value="">Select medicine *</option>
            {medicines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input type="number" min="0" placeholder="Qty *" value={form.qty} onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))} />
          <input type="number" min="0" placeholder="Unit cost *" value={form.unitCost} onChange={(e) => setForm((p) => ({ ...p, unitCost: e.target.value }))} />
          <input placeholder="Invoice no *" value={form.invoiceNo} onChange={(e) => setForm((p) => ({ ...p, invoiceNo: e.target.value }))} />
          <input placeholder="Supplier *" value={form.supplier} onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))} />
          <input type="date" value={form.purchaseDate} onChange={(e) => setForm((p) => ({ ...p, purchaseDate: e.target.value }))} />
          <div className="stock-chip">Total Cost: {totalCost}</div>
          {error ? <p className="error-text span-all">{error}</p> : null}
          {success ? <p className="success-text span-all">{success}</p> : null}
          <button className="btn" type="submit">Save Purchase</button>
        </form>
      </SectionCard>
      <SectionCard title="Purchase history">
        <DataTable
          loading={loading}
          columns={[
            { key: 'medicineName', label: 'Medicine' },
            { key: 'qty', label: 'Qty' },
            { key: 'unitCost', label: 'Unit Cost' },
            { key: 'totalCost', label: 'Total Cost' },
            { key: 'invoiceNo', label: 'Invoice' },
            { key: 'supplier', label: 'Supplier' }
          ]}
          rows={rows}
          emptyText="No purchases yet."
        />
      </SectionCard>
    </div>
  );
};
