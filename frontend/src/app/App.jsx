import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ProtectedRoute } from '../routes/ProtectedRoute.jsx';
import { ROLES } from '../constants/roles.js';
import { LandingPage } from '../pages/public/LandingPage.jsx';
import { DiscoverPage } from '../pages/public/DiscoverPage.jsx';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '../pages/public/AuthPages.jsx';
import { CustomerDashboard } from '../pages/customer/CustomerDashboard.jsx';
import { SellerDashboard } from '../pages/seller/SellerDashboard.jsx';
import { AdminDashboard } from '../pages/admin/AdminDashboard.jsx';
import { DeliveryDashboard } from '../pages/delivery/DeliveryDashboard.jsx';

const customerNav = [{ to: '/customer', label: 'Dashboard' }, { to: '/discover', label: 'Discover' }];
const sellerNav = [{ to: '/seller', label: 'Dashboard' }, { to: '/seller/inventory', label: 'Inventory' }];
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
      <Route path="inventory" element={<div>Inventory batches table module ready.</div>} />
    </Route>

    <Route
      path="/admin"
      element={<ProtectedRoute allowRoles={[ROLES.ADMIN]}><AppShell title="Admin" navItems={adminNav} /></ProtectedRoute>}
    >
      <Route index element={<AdminDashboard />} />
      <Route path="audit-logs" element={<div>Audit logs module ready.</div>} />
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
