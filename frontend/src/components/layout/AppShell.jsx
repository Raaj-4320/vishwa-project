import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../../services/firebase.js';
import { useAppState } from '../../app/AppProvider.jsx';

export const AppShell = ({ title, navItems }) => {
  const { auth } = useAppState();
  const navigate = useNavigate();

  const onLogout = async () => {
    await signOut(firebaseAuth);
    navigate('/login');
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand-block">
          <h2>{title}</h2>
          <p>Operations Console</p>
        </div>
        <p className="user-chip">{auth?.profile?.email || auth?.user?.email || 'Signed in'}</p>
        <nav className="nav-stack">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn logout-btn" onClick={onLogout}>Logout</button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};
