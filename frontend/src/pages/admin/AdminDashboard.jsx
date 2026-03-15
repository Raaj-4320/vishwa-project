import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

const platformHealth = [
  { id: '1', domain: 'Authentication', owner: 'Identity Platform', status: <StatusBadge status="success" label="Healthy" />, updatedAt: '2026-03-15 10:15 UTC' },
  { id: '2', domain: 'Orders API', owner: 'Core Commerce', status: <StatusBadge status="warning" label="Degraded" />, updatedAt: '2026-03-15 10:11 UTC' },
  { id: '3', domain: 'Seller Inventory', owner: 'Ops Platform', status: <StatusBadge status="success" label="Healthy" />, updatedAt: '2026-03-15 10:09 UTC' }
];

export const AdminDashboard = () => (
  <div className="admin-page">
    <PageHeader
      title="Admin Command Center"
      subtitle="Monitor compliance, operational risk, and ecosystem quality across the healthcare commerce platform."
      actions={(
        <>
          <button className="btn btn-secondary" type="button">Export snapshot</button>
          <Link className="btn" to="/admin/audit-logs">Open audit logs</Link>
        </>
      )}
    />

    <SectionCard title="Executive KPI Overview" subtitle="Daily platform performance and governance signals.">
      <div className="grid-cards admin-kpi-grid">
        <StatCard label="Active users" value="2,540" hint="+4.3% week-over-week" />
        <StatCard label="Verified sellers" value="338" tone="success" hint="All checks completed" />
        <StatCard label="Open escalations" value="12" tone="warning" hint="2 require immediate review" />
        <StatCard label="Critical incidents" value="0" tone="success" hint="No sev-1 in last 24h" />
      </div>
    </SectionCard>

    <div className="admin-two-column">
      <SectionCard title="Operational Health" subtitle="Service domains and latest status check-ins.">
        <div className="admin-health-list">
          {platformHealth.map((item) => (
            <article key={item.id} className="admin-health-item">
              <div>
                <p className="admin-health-title">{item.domain}</p>
                <p className="hint-text">Owner: {item.owner}</p>
              </div>
              <div className="admin-health-meta">
                {item.status}
                <p className="hint-text">{item.updatedAt}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Governance Actions" subtitle="Fast links for high-priority review workflows.">
        <div className="admin-action-list">
          <Link to="/admin/audit-logs" className="admin-action-link">Review permission changes</Link>
          <Link to="/admin/audit-logs" className="admin-action-link">Inspect inventory overrides</Link>
          <Link to="/admin/audit-logs" className="admin-action-link">Trace failed auth events</Link>
          <Link to="/admin/audit-logs" className="admin-action-link">Download compliance evidence</Link>
        </div>
      </SectionCard>
    </div>
  </div>
);
