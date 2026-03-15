import { Navigate } from 'react-router-dom';
import { useAppState } from '../app/AppProvider.jsx';

export const ProtectedRoute = ({ allowRoles, children }) => {
  const { auth, authLoading } = useAppState();

  if (authLoading) return <div className="auth-loading">Checking your session...</div>;
  if (!auth?.user) return <Navigate to="/login" replace />;
  if (allowRoles?.length && !allowRoles.includes(auth.role)) return <Navigate to="/" replace />;
  return children;
};
