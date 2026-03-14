import { DataTable } from '../../components/tables/DataTable.jsx';

export const DeliveryDashboard = () => (
  <div>
    <h2>Delivery Dashboard</h2>
    <DataTable
      columns={[{ key: 'orderId', label: 'Order ID' }, { key: 'status', label: 'Status' }]}
      rows={[{ id: '1', orderId: 'ORD-201', status: 'out_for_delivery' }]}
    />
  </div>
);
