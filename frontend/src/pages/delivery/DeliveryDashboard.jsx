import { DataTable } from '../../components/tables/DataTable.jsx';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

const assignedRows = [
  { id: '1', orderId: 'ORD-201', zone: 'Indiranagar', eta: '18 min', status: <StatusBadge status="info" label="Assigned" /> },
  { id: '2', orderId: 'ORD-199', zone: 'Whitefield', eta: '42 min', status: <StatusBadge status="warning" label="Delayed" /> }
];

export const DeliveryDashboard = () => (
  <div>
    <PageHeader title="Delivery Operations" subtitle="View assigned deliveries and keep handoff status up to date." />
    <SectionCard title="Assigned deliveries" subtitle="Track ETA and status before customer handoff.">
      <DataTable
        columns={[
          { key: 'orderId', label: 'Order ID' },
          { key: 'zone', label: 'Zone' },
          { key: 'eta', label: 'ETA' },
          { key: 'status', label: 'Status' }
        ]}
        rows={assignedRows}
      />
    </SectionCard>
  </div>
);
