import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ProtectedRoute } from '../routes/ProtectedRoute.jsx';
import { ROLES } from '../constants/roles.js';
import { LandingPage } from '../pages/public/LandingPage.jsx';
import { DiscoverPage } from '../pages/public/DiscoverPage.jsx';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '../pages/public/AuthPages.jsx';
import { CustomerDashboard } from '../pages/customer/CustomerDashboard.jsx';
import { SellerDashboard } from '../pages/seller/SellerDashboard.jsx';
import { SellerMedicinesPage } from '../pages/seller/SellerMedicinesPage.jsx';
import { SellerMedicineFormPage } from '../pages/seller/SellerMedicineFormPage.jsx';
import { SellerInventoryBatchesPage } from '../pages/seller/SellerInventoryBatchesPage.jsx';
import { SellerBatchFormPage } from '../pages/seller/SellerBatchFormPage.jsx';
import { SellerPurchasesPage } from '../pages/seller/SellerPurchasesPage.jsx';
import { SellerLowStockPage } from '../pages/seller/SellerLowStockPage.jsx';
import { SellerExpiryAlertsPage } from '../pages/seller/SellerExpiryAlertsPage.jsx';
import { SellerTransactionImportPage } from '../pages/seller/SellerTransactionImportPage.jsx';
import { AdminDashboard } from '../pages/admin/AdminDashboard.jsx';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage.jsx';
import { DeliveryDashboard } from '../pages/delivery/DeliveryDashboard.jsx';

const customerNav = [{ to: '/customer', label: 'Dashboard' }, { to: '/discover', label: 'Discover' }];
const sellerNav = [{ to: '/seller', label: 'Dashboard' }, { to: '/seller/medicines', label: 'Medicines' }, { to: '/seller/medicines/new', label: 'Add Product' }, { to: '/seller/inventory/batches', label: 'Batches' }, { to: '/seller/purchases', label: 'Purchases' }, { to: '/seller/alerts/low-stock', label: 'Low Stock' }, { to: '/seller/alerts/expiry', label: 'Expiry Alerts' }, { to: '/seller/transactions/import', label: 'Import Txns' }];
const adminNav = [{ to: '/admin', label: 'Dashboard' }, { to: '/admin/audit-logs', label: 'Audit Logs' }];
const deliveryNav = [{ to: '/delivery', label: 'Dashboard' }];

export const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/discover" element={<DiscoverPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

    <Route
      path="/customer"
      element={<ProtectedRoute allowRoles={[ROLES.CUSTOMER]}><AppShell title="Customer" navItems={customerNav} /></ProtectedRoute>}
    >
      <Route index element={<CustomerDashboard />} />
    </Route>

    <Route
      path="/seller"
      element={<ProtectedRoute allowRoles={[ROLES.SELLER, ROLES.PHARMACIST]}><AppShell title="Seller" navItems={sellerNav} /></ProtectedRoute>}
    >
      <Route index element={<SellerDashboard />} />
      <Route path="medicines" element={<SellerMedicinesPage />} />
      <Route path="medicines/new" element={<SellerMedicineFormPage />} />
      <Route path="medicines/:id/edit" element={<SellerMedicineFormPage />} />
      <Route path="inventory/batches" element={<SellerInventoryBatchesPage />} />
      <Route path="inventory/batches/new" element={<SellerBatchFormPage />} />
      <Route path="inventory/batches/:id/edit" element={<SellerBatchFormPage />} />
      <Route path="purchases" element={<SellerPurchasesPage />} />
      <Route path="alerts/low-stock" element={<SellerLowStockPage />} />
      <Route path="alerts/expiry" element={<SellerExpiryAlertsPage />} />
      <Route path="transactions/import" element={<SellerTransactionImportPage />} />
    </Route>

    <Route
      path="/admin"
      element={<ProtectedRoute allowRoles={[ROLES.ADMIN, 'super_admin']}><AppShell title="Admin" navItems={adminNav} /></ProtectedRoute>}
    >
      <Route index element={<AdminDashboard />} />
      <Route path="audit-logs" element={<AdminAuditLogsPage />} />
    </Route>

    <Route
      path="/delivery"
      element={<ProtectedRoute allowRoles={[ROLES.DELIVERY]}><AppShell title="Delivery" navItems={deliveryNav} /></ProtectedRoute>}
    >
      <Route index element={<DeliveryDashboard />} />
    </Route>

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);
