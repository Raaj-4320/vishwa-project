import { useState } from 'react';
import { api } from '../../services/api.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

const sample = JSON.stringify([
  { sellerMedicineId: 'MEDICINE_DOC_ID', type: 'purchase', quantity: 25, reference: 'import-1', happenedAt: new Date().toISOString() }
], null, 2);

const parseExcelCsv = (content) => {
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error('CSV must include header and at least one row.');
  const headers = lines[0].split(',').map((h) => h.trim());
  const required = ['sellerMedicineId', 'type', 'quantity', 'reference', 'happenedAt'];
  const missing = required.filter((field) => !headers.includes(field));
  if (missing.length) throw new Error(`CSV missing required columns: ${missing.join(', ')}`);
  const index = Object.fromEntries(headers.map((h, i) => [h, i]));

  return lines.slice(1).map((line, rowIndex) => {
    const cells = line.split(',').map((c) => c.trim());
    const entry = {
      sellerMedicineId: cells[index.sellerMedicineId],
      type: cells[index.type],
      quantity: Number(cells[index.quantity]),
      reference: cells[index.reference] || '',
      happenedAt: cells[index.happenedAt]
    };
    if (!entry.sellerMedicineId || !['purchase', 'sale'].includes(entry.type) || Number.isNaN(entry.quantity) || entry.quantity < 0 || !entry.happenedAt) {
      throw new Error(`Invalid data at CSV row ${rowIndex + 2}`);
    }
    return entry;
  });
};

export const SellerTransactionImportPage = () => {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('json');

  const submitEntries = async (entries) => {
    const { data } = await api.post('/seller/transactions/import', { entries });
    setResult(`Imported ${data?.data?.applied || 0} transactions successfully.`);
  };

  const onSubmitJson = async (e) => {
    e.preventDefault();
    setError('');
    setResult('');
    try {
      const entries = JSON.parse(text);
      if (!Array.isArray(entries) || !entries.length) {
        setError('Provide a non-empty JSON array.');
        return;
      }
      await submitEntries(entries);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Import failed. Ensure JSON schema is valid.');
    }
  };

  const onCsvSelect = async (event) => {
    setError('');
    setResult('');
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file exported from Excel.');
      return;
    }

    try {
      const content = await file.text();
      const entries = parseExcelCsv(content);
      await submitEntries(entries);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'CSV import failed.');
    }
  };

  return (
    <div>
      <PageHeader title="Transaction Import" subtitle="Import stock movement in bulk using JSON or Excel-exported CSV." actions={<select value={mode} onChange={(e) => setMode(e.target.value)}><option value="json">JSON</option><option value="excel_csv">Excel (CSV)</option></select>} />
      <SectionCard title="Import entries" subtitle="Validation rules are applied before totals are updated.">
        {mode === 'json' ? (
          <form className="import-form" onSubmit={onSubmitJson}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} />
            <p className="hint-text">JSON schema: sellerMedicineId, type (purchase|sale), quantity, reference, happenedAt (ISO).</p>
            {error ? <p className="error-text">{error}</p> : null}
            {result ? <p className="success-text">{result}</p> : null}
            <button className="btn" type="submit">Import Transactions</button>
          </form>
        ) : (
          <div className="import-form">
            <p className="hint-text">Upload CSV headers: sellerMedicineId,type,quantity,reference,happenedAt</p>
            <input type="file" accept=".csv,text/csv" onChange={onCsvSelect} />
            {error ? <p className="error-text">{error}</p> : null}
            {result ? <p className="success-text">{result}</p> : null}
          </div>
        )}
      </SectionCard>
    </div>
  );
};
