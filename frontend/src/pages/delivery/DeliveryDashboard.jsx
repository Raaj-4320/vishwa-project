import { DataTable } from '../../components/tables/DataTable.jsx';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

export const DeliveryDashboard = () => (
  <div>
    <PageHeader title="Delivery Dashboard" subtitle="View assigned deliveries and update handoff status." />
    <SectionCard title="Assigned deliveries">
      <DataTable
        columns={[{ key: 'orderId', label: 'Order ID' }, { key: 'status', label: 'Status' }]}
        rows={[{ id: '1', orderId: 'ORD-201', status: <StatusBadge status="info" /> }]}
      />
    </SectionCard>
  </div>
);
