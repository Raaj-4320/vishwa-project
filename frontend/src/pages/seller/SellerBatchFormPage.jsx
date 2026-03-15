import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

const defaults = {
  sellerMedicineId: '',
  batchNo: '',
  expiryDate: '',
  qty: 0,
  reservedQty: 0,
  purchasePrice: 0,
  sellingPrice: 0,
  supplier: '',
  status: 'active'
};

export const SellerBatchFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState(defaults);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const meds = await api.get('/seller/medicines');
      setMedicines(meds.data?.data || []);
      if (id) {
        const batches = await api.get('/seller/inventory/batches');
        const current = (batches.data?.data || []).find((b) => b.id === id);
        if (current) setForm({ ...defaults, ...current, expiryDate: current.expiryDate?.slice(0, 10) || '' });
      }
    };
    init();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const qty = Number(form.qty);
    const reservedQty = Number(form.reservedQty);
    if (!form.sellerMedicineId || !form.batchNo.trim() || !form.expiryDate || !form.supplier.trim()) {
      setError('Medicine, batch no, expiry and supplier are required.');
      return;
    }
    if ([qty, reservedQty, Number(form.purchasePrice), Number(form.sellingPrice)].some((v) => Number.isNaN(v) || v < 0)) {
      setError('Numeric fields must be non-negative.');
      return;
    }
    if (reservedQty > qty) {
      setError('Reserved quantity cannot exceed quantity.');
      return;
    }

    const payload = {
      ...form,
      qty,
      reservedQty,
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
      expiryDate: new Date(`${form.expiryDate}T00:00:00.000Z`).toISOString()
    };

    try {
      setSaving(true);
      if (isEdit) await api.patch(`/seller/inventory/batches/${id}`, payload);
      else await api.post('/seller/inventory/batches', payload);
      setSuccess(`Batch ${isEdit ? 'updated' : 'created'} successfully.`);
      setTimeout(() => navigate('/seller/inventory/batches', { replace: true }), 500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save batch.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Batch' : 'Add Batch'} subtitle="Capture batch identity, expiry and stock controls safely." actions={<Link className="btn btn-secondary" to="/seller/inventory/batches">Back to Batches</Link>} />
      <SectionCard title="Batch details" subtitle="Fields marked * are required.">
        <form className="form-grid" onSubmit={onSubmit}>
          <select value={form.sellerMedicineId} onChange={(e) => setForm((p) => ({ ...p, sellerMedicineId: e.target.value }))} disabled={isEdit}>
            <option value="">Select medicine *</option>
            {medicines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input placeholder="Batch no *" value={form.batchNo} onChange={(e) => setForm((p) => ({ ...p, batchNo: e.target.value }))} disabled={isEdit} />
          <input type="date" value={form.expiryDate} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))} />
          <input type="number" min="0" placeholder="Quantity" value={form.qty} onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))} />
          <input type="number" min="0" placeholder="Reserved Qty" value={form.reservedQty} onChange={(e) => setForm((p) => ({ ...p, reservedQty: e.target.value }))} />
          <input type="number" min="0" placeholder="Purchase Price" value={form.purchasePrice} onChange={(e) => setForm((p) => ({ ...p, purchasePrice: e.target.value }))} />
          <input type="number" min="0" placeholder="Selling Price" value={form.sellingPrice} onChange={(e) => setForm((p) => ({ ...p, sellingPrice: e.target.value }))} />
          <input placeholder="Supplier *" value={form.supplier} onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))} />
          <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
            <option value="active">Active</option>
            <option value="quarantined">Quarantined</option>
            <option value="expired">Expired</option>
          </select>
          {error ? <p className="error-text span-all">{error}</p> : null}
          {success ? <p className="success-text span-all">{success}</p> : null}
          <div className="page-actions span-all">
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Batch'}</button>
            <Link className="btn btn-secondary" to="/seller/inventory/batches">Cancel</Link>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};
