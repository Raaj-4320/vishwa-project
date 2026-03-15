import { DataTable } from '../../components/tables/DataTable.jsx';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';

export const AdminAuditLogsPage = () => (
  <div>
    <PageHeader title="Audit Logs" subtitle="Trace sensitive actions for governance and compliance." />
    <SectionCard>
      <DataTable
        columns={[{ key: 'actor', label: 'Actor' }, { key: 'action', label: 'Action' }, { key: 'time', label: 'Time' }]}
        rows={[]}
        emptyText="Audit logs will appear here once tracked events are ingested."
      />
    </SectionCard>
  </div>
);
