import { NavLink, Outlet } from 'react-router-dom';

export const AppShell = ({ title, navItems }) => (
  <div className="shell">
    <aside className="sidebar">
      <h2>{title}</h2>
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} className="nav-link">
          {item.label}
        </NavLink>
      ))}
    </aside>
    <main className="content">
      <Outlet />
    </main>
  </div>
);
