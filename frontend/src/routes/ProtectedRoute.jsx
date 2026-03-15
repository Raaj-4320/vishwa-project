import { Navigate } from 'react-router-dom';
import { roleHomePath, useAppState } from '../app/AppProvider.jsx';

export const ProtectedRoute = ({ allowRoles, children, loginPath = '/login', onRoleMismatch = 'home' }) => {
  const { auth, authLoading } = useAppState();

  if (authLoading) return <div className="auth-loading">Loading your secure workspace…</div>;
  if (!auth?.user) return <Navigate to={loginPath} replace />;
  if (allowRoles?.length && !allowRoles.includes(auth.role)) {
    if (onRoleMismatch === 'login') return <Navigate to={loginPath} replace />;
    return <Navigate to={roleHomePath(auth.role)} replace />;
  }
  return children;
};
