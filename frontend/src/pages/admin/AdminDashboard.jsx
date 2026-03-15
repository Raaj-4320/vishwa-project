import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SectionCard } from '../../components/common/SectionCard.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';

const overviewStats = [
  { label: 'Orders (today)', value: '426', hint: 'Week: 2,814 • Month: 11,902' },
  { label: 'Total revenue', value: '₹28.4L', tone: 'success', hint: 'Across all successful payments' },
  { label: 'Total customers', value: '15,240', hint: 'Active in last 90 days' },
  { label: 'Total sellers', value: '338', hint: 'Verified pharmacies only' },
  { label: 'Pending prescriptions', value: '84', tone: 'warning', hint: 'Awaiting pharmacist review' },
  { label: 'Low stock alerts', value: '129', tone: 'warning', hint: 'Across active pharmacies' },
  { label: 'Expiring medicines', value: '47', tone: 'danger', hint: 'Within configured window' },
  { label: 'Delivery overview', value: '92.1%', tone: 'success', hint: 'On-time delivery rate' }
];

const topMedicines = [
  { id: '1', medicine: 'Paracetamol 650', category: 'Fever', orders: '1,920', status: <StatusBadge status="success" label="Top seller" /> },
  { id: '2', medicine: 'Cetirizine 10mg', category: 'Allergy', orders: '1,104', status: <StatusBadge status="info" label="Stable" /> },
  { id: '3', medicine: 'Azithromycin 500', category: 'Antibiotic', orders: '828', status: <StatusBadge status="warning" label="Rx heavy" /> }
];

const topPharmacies = [
  { id: '1', pharmacy: 'City Care Pharmacy', city: 'Bengaluru', revenue: '₹6.2L', rating: '4.8' },
  { id: '2', pharmacy: 'Medico Plus', city: 'Hyderabad', revenue: '₹5.7L', rating: '4.7' },
  { id: '3', pharmacy: 'HealthLine Stores', city: 'Pune', revenue: '₹5.1L', rating: '4.6' }
];

const adminModules = [
  {
    title: '1) Dashboard (Overview)',
    points: ['Total Orders (today/week/month)', 'Total Revenue', 'Total Customers', 'Total Sellers', 'Pending Prescriptions', 'Low Stock Alerts', 'Expiring Medicines', 'Delivery Status Overview', 'Top Selling Medicines', 'Top Performing Pharmacies'],
    chips: ['Orders/day', 'Revenue graph', 'Category sales', 'Prescription vs OTC']
  },
  {
    title: '2) User Management',
    points: ['Customers: block/unblock, order history, addresses, prescription uploads', 'Sellers/Pharmacies: approve registration, verify licenses, suspend store', 'Delivery partners: assign deliveries, track performance, activate/deactivate'],
    chips: ['Customers', 'Sellers', 'Delivery partners']
  },
  {
    title: '3) Pharmacy (Seller) Management',
    points: ['Approve/reject new pharmacy applications', 'Verify license documents and GST', 'Manage service areas, ratings, and inventory visibility'],
    chips: ['License', 'GST', 'Store status', 'Revenue']
  },
  {
    title: '4) Medicine Catalog Management',
    points: ['Master medicine list (name, generic, brand, strength, category, dosage, manufacturer, barcode, Rx required)', 'Add/edit/delete/activate/deactivate medicines', 'CSV import support'],
    chips: ['Master catalog', 'Lifecycle controls', 'CSV import']
  },
  {
    title: '5) Inventory Monitoring',
    points: ['View stock across pharmacies', 'Low stock alerts, expiring batches, recall workflow', 'Filters by pharmacy, medicine, expiry, batch'],
    chips: ['Cross-pharmacy stock', 'Batch tracking', 'Recall management']
  },
  {
    title: '6) Order Management',
    points: ['Statuses: Pending, Awaiting Prescription, Approved, Packed, Out for Delivery, Delivered, Cancelled, Refunded', 'View order details, assign delivery, cancel/refund, escalate issues'],
    chips: ['Order lifecycle', 'Assignment', 'Refund actions']
  },
  {
    title: '7) Prescription Management',
    points: ['Pending review with image + patient + doctor details', 'Approve with medicine validation', 'Reject with reason (invalid, expired, unclear)'],
    chips: ['Pending', 'Approved', 'Rejected']
  },
  {
    title: '8) Location & Service Area Management',
    points: ['Master hierarchy: Country/State/City/Area/Locality/Pincode', 'Add new cities/pincodes, approve seller service areas'],
    chips: ['Location master', 'Serviceability controls']
  },
  {
    title: '9) Delivery Management',
    points: ['Assign delivery partners and track status updates', 'Tabs for assigned/completed/failed deliveries'],
    chips: ['Assigned', 'Completed', 'Failed']
  },
  {
    title: '10) Payment & Finance',
    points: ['Track order payments, seller payouts, refund management, commission tracking', 'Transactions + seller settlements views'],
    chips: ['Transactions', 'Settlements', 'Commission']
  },
  {
    title: '11) Offers & Promotions',
    points: ['Create coupons/discounts/first-order offers/category offers', 'Examples: MED10, FIRST20'],
    chips: ['Coupon engine', 'Category discounts']
  },
  {
    title: '12) Reviews & Ratings',
    points: ['Approve reviews, remove abusive content, monitor pharmacy ratings'],
    chips: ['Moderation', 'Quality signals']
  },
  {
    title: '13) Notifications & Communication',
    points: ['Push, email, and SMS campaigns for order updates, recalls, promotions'],
    chips: ['Push', 'Email', 'SMS']
  },
  {
    title: '14) Reports & Analytics',
    points: ['Sales/revenue/order/AOV reports', 'Medicine/pharmacy/customer reports', 'Export CSV/Excel/PDF'],
    chips: ['Sales', 'Customer insights', 'Exports']
  },
  {
    title: '15) Compliance & Legal',
    points: ['Drug/pharmacy license verification', 'Audit-ready storage and recall notices'],
    chips: ['License compliance', 'Recall notices']
  },
  {
    title: '16) Audit Logs',
    points: ['Track all admin actions (medicine add, suspension, refunds, etc.) with accountability'],
    chips: ['Action history', 'Traceability']
  },
  {
    title: '17) Platform Settings',
    points: ['General branding/contact settings', 'Commission %', 'Order rules like minimum value and delivery fee'],
    chips: ['General', 'Commission', 'Order settings']
  },
  {
    title: '18) Support & Ticket System',
    points: ['Handle customer and seller complaints, refund disputes, and order issues'],
    chips: ['Complaints', 'Disputes', 'Order support']
  }
];

export const AdminDashboard = () => (
  <div className="admin-page">
    <PageHeader
      title="Admin Control Tower"
      subtitle="Enterprise workspace for governance, operations, catalog quality, and business performance across the platform."
      actions={(
        <>
          <button className="btn btn-secondary" type="button">Export snapshot</button>
          <Link className="btn" to="/admin/audit-logs">Open audit logs</Link>
        </>
      )}
    />

    <SectionCard title="Dashboard Overview" subtitle="Real-time platform insight cards for quick decision making.">
      <div className="grid-cards admin-kpi-grid">
        {overviewStats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} tone={item.tone} hint={item.hint} />
        ))}
      </div>
    </SectionCard>

    <SectionCard title="Charts" subtitle="Analytical views used by operations and leadership teams.">
      <div className="admin-chart-grid">
        <article className="admin-chart-card"><h4>Orders per day</h4><p className="hint-text">Daily trendline with peak-hour highlights.</p></article>
        <article className="admin-chart-card"><h4>Revenue graph</h4><p className="hint-text">Revenue trajectory by day/week/month.</p></article>
        <article className="admin-chart-card"><h4>Category sales</h4><p className="hint-text">Contribution split by medicine categories.</p></article>
        <article className="admin-chart-card"><h4>Prescription vs OTC</h4><p className="hint-text">Demand ratio between Rx and OTC orders.</p></article>
      </div>
    </SectionCard>

    <div className="admin-two-column">
      <SectionCard title="Top Selling Medicines">
        <DataTable
          columns={[{ key: 'medicine', label: 'Medicine' }, { key: 'category', label: 'Category' }, { key: 'orders', label: 'Orders' }, { key: 'status', label: 'Status' }]}
          rows={topMedicines}
        />
      </SectionCard>
      <SectionCard title="Top Performing Pharmacies">
        <DataTable
          columns={[{ key: 'pharmacy', label: 'Pharmacy' }, { key: 'city', label: 'City' }, { key: 'revenue', label: 'Revenue' }, { key: 'rating', label: 'Rating' }]}
          rows={topPharmacies}
        />
      </SectionCard>
    </div>

    <SectionCard title="Admin Functional Modules" subtitle="Organized delivery roadmap and operational surface, simplified step-by-step.">
      <div className="admin-module-grid">
        {adminModules.map((module) => (
          <article key={module.title} className="admin-module-card">
            <h4>{module.title}</h4>
            <ul>
              {module.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <div className="admin-chip-wrap">
              {module.chips.map((chip) => <span key={chip} className="status-badge tone-info">{chip}</span>)}
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  </div>
);
