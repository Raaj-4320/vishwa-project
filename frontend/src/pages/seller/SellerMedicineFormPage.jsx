import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

const defaults = {
  name: '',
  category: '',
  dosageForm: '',
  strength: '',
  brand: '',
  generic: '',
  barcode: '',
  manufacturer: '',
  rxRequired: false,
  totalPurchase: 0,
  totalSold: 0,
  price: 0,
  status: 'active'
};

export const SellerMedicineFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(defaults);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const currentStock = useMemo(() => Math.max(0, Number(form.totalPurchase || 0) - Number(form.totalSold || 0)), [form.totalPurchase, form.totalSold]);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      const { data } = await api.get(`/seller/medicines/${id}`);
      if (data?.data) setForm({ ...defaults, ...data.data });
    };
    load();
  }, [id, isEdit]);

  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const purchase = Number(form.totalPurchase);
    const sold = Number(form.totalSold);
    const price = Number(form.price);

    if (!form.name.trim() || !form.category.trim() || !form.barcode.trim()) {
      setError('Name, category and barcode are required.');
      return;
    }
    if ([purchase, sold, price].some((v) => Number.isNaN(v) || v < 0)) {
      setError('Purchase, sold and price must be non-negative numbers.');
      return;
    }
    if (sold > purchase) {
      setError('totalSold cannot exceed totalPurchase.');
      return;
    }

    const payload = { ...form, totalPurchase: purchase, totalSold: sold, price };

    try {
      setSaving(true);
      if (isEdit) await api.patch(`/seller/medicines/${id}`, payload);
      else await api.post('/seller/medicines', payload);
      setSuccess(`Product ${isEdit ? 'updated' : 'created'} successfully.`);
      setTimeout(() => navigate('/seller/medicines', { replace: true }), 500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save medicine.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Product' : 'Add Product'} subtitle="Maintain accurate product identity, pricing and inventory totals." actions={<Link className="btn btn-secondary" to="/seller/medicines">Back to Medicines</Link>} />
      <SectionCard title="Product details" subtitle="Fields marked * are required.">
        <form className="form-grid" onSubmit={onSubmit}>
          <input placeholder="Product name *" value={form.name} onChange={(e) => onChange('name', e.target.value)} />
          <input placeholder="Category *" value={form.category} onChange={(e) => onChange('category', e.target.value)} />
          <input placeholder="Dosage form" value={form.dosageForm} onChange={(e) => onChange('dosageForm', e.target.value)} />
          <input placeholder="Strength" value={form.strength} onChange={(e) => onChange('strength', e.target.value)} />
          <input placeholder="Brand" value={form.brand} onChange={(e) => onChange('brand', e.target.value)} />
          <input placeholder="Generic" value={form.generic} onChange={(e) => onChange('generic', e.target.value)} />
          <input placeholder="Barcode *" value={form.barcode} onChange={(e) => onChange('barcode', e.target.value)} />
          <input placeholder="Manufacturer" value={form.manufacturer} onChange={(e) => onChange('manufacturer', e.target.value)} />
          <input type="number" min="0" placeholder="Total purchase" value={form.totalPurchase} onChange={(e) => onChange('totalPurchase', e.target.value)} />
          <input type="number" min="0" placeholder="Total sold" value={form.totalSold} onChange={(e) => onChange('totalSold', e.target.value)} />
          <input type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => onChange('price', e.target.value)} />
          <select value={form.status} onChange={(e) => onChange('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <label className="checkbox-row span-all">
            <input type="checkbox" checked={form.rxRequired} onChange={(e) => onChange('rxRequired', e.target.checked)} /> Prescription required
          </label>
          <div className="stock-chip span-all">Current Stock: {currentStock}</div>
          {error ? <p className="error-text span-all">{error}</p> : null}
          {success ? <p className="success-text span-all">{success}</p> : null}
          <div className="page-actions span-all">
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
            <Link className="btn btn-secondary" to="/seller/medicines">Cancel</Link>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};
