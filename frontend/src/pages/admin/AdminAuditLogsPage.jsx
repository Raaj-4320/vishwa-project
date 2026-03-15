import { useMemo, useState } from 'react';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

const allRows = [
  { id: '1', actor: 'admin@mediflow.com', action: 'Updated seller permissions', target: 'seller:PHRM-1102', severity: 'warning', date: '2026-03-15', time: '10:14 UTC' },
  { id: '2', actor: 'ops@mediflow.com', action: 'Reviewed stock anomaly', target: 'batch:BT-4421', severity: 'info', date: '2026-03-15', time: '09:58 UTC' },
  { id: '3', actor: 'security@mediflow.com', action: 'Forced password reset', target: 'user:USR-1882', severity: 'danger', date: '2026-03-14', time: '18:22 UTC' },
  { id: '4', actor: 'admin@mediflow.com', action: 'Approved pharmacy verification', target: 'pharmacy:PHY-904', severity: 'success', date: '2026-03-14', time: '16:01 UTC' }
];

export const AdminAuditLogsPage = () => {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredRows = useMemo(() => allRows
    .filter((row) => {
      if (severity !== 'all' && row.severity !== severity) return false;
      if (fromDate && row.date < fromDate) return false;
      if (toDate && row.date > toDate) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return [row.actor, row.action, row.target].join(' ').toLowerCase().includes(q);
    })
    .map((row) => ({
      ...row,
      severity: <StatusBadge status={row.severity} label={row.severity.charAt(0).toUpperCase() + row.severity.slice(1)} />,
      happenedAt: `${row.date} ${row.time}`
    })), [search, severity, fromDate, toDate]);

  const clearFilters = () => {
    setSearch('');
    setSeverity('all');
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="admin-page">
      <PageHeader
        title="Audit Logs"
        subtitle="Trace sensitive actions for governance, controls, and compliance investigations."
        actions={<button type="button" className="btn btn-secondary">Export CSV</button>}
      />

      <SectionCard title="Filters" subtitle="Refine events by actor, target, severity, and date range.">
        <div className="admin-filter-grid">
          <input
            placeholder="Search actor, action, or target"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="all">All severities</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="danger">Critical</option>
          </select>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <button className="btn btn-secondary" type="button" onClick={clearFilters}>Clear</button>
          <button className="btn" type="button">Apply filters</button>
        </div>
      </SectionCard>

      <SectionCard title="Event timeline" subtitle="Ordered by most recent activity.">
        <DataTable
          columns={[
            { key: 'actor', label: 'Actor' },
            { key: 'action', label: 'Action' },
            { key: 'target', label: 'Target' },
            { key: 'severity', label: 'Severity' },
            { key: 'happenedAt', label: 'Timestamp' }
          ]}
          rows={filteredRows}
          emptyText="No audit events match your selected filters."
        />
      </SectionCard>
    </div>
  );
};
