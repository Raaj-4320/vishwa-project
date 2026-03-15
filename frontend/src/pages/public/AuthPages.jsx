import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { firebaseAuth } from '../../services/firebase.js';
import { api, setAuthToken } from '../../services/api.js';
import { roleHomePath, useAppState } from '../../app/AppProvider.jsx';

const roleIntentMap = {
  seller: { title: 'Seller sign in', subtitle: 'Access inventory, batch, and purchase operations.' },
  admin: { title: 'Admin sign in', subtitle: 'Access control tower, audit logs, and governance tools.' },
  customer: { title: 'Customer sign in', subtitle: 'Manage orders, prescriptions, and delivery updates.' },
  delivery: { title: 'Delivery sign in', subtitle: 'Track assigned deliveries and handoff status.' }
};

const intentRoleMatch = (intent, role) => {
  if (!intent) return true;
  if (intent === 'admin') return role === 'admin' || role === 'super_admin';
  if (intent === 'seller') return role === 'seller' || role === 'pharmacist';
  return role === intent;
};

const AuthLayout = ({ title, subtitle, children, lockToRole }) => {
  const { auth, authLoading } = useAppState();

  if (!authLoading && auth?.user && (!lockToRole || intentRoleMatch(lockToRole, auth.role))) {
    return <Navigate to={roleHomePath(auth.role)} replace />;
  }

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <h2>{title}</h2>
        <p className="hint-text">{subtitle}</p>
        {children}
      </div>
    </section>
  );
};

const SwitchAccountNotice = ({ roleIntent }) => {
  const { auth } = useAppState();

  if (!auth?.user || !roleIntent || intentRoleMatch(roleIntent, auth.role)) return null;

  return (
    <div className="state-box warning">
      <p>You are signed in as <strong>{auth.role}</strong>. Sign out to continue as <strong>{roleIntent}</strong>.</p>
      <button className="btn btn-secondary" type="button" onClick={() => signOut(firebaseAuth)}>Sign out and continue</button>
    </div>
  );
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleIntent = searchParams.get('role');
  const roleCopy = useMemo(() => roleIntentMap[roleIntent] || { title: 'Welcome back', subtitle: 'Sign in to continue to your secure workspace.' }, [roleIntent]);
  const registerPath = roleIntent ? `/register?role=${roleIntent}` : '/register';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const creds = await signInWithEmailAndPassword(firebaseAuth, form.email.trim(), form.password);
      const token = await creds.user.getIdToken();
      setAuthToken(token);
      const boot = await api.post('/auth/bootstrap', {});
      navigate(roleHomePath(boot.data?.data?.role), { replace: true });
    } catch {
      setError('Sign in failed. Please verify credentials and backend availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={roleCopy.title} subtitle={roleCopy.subtitle} lockToRole={roleIntent}>
      <SwitchAccountNotice roleIntent={roleIntent} />
      {roleIntent === 'admin' ? <p className="hint-text">Default admin credentials: <strong>admin@123.com</strong> / <strong>123456</strong>.</p> : null}
      <form className="auth-form" onSubmit={onSubmit}>
        <label>Email address *</label>
        <input type="email" placeholder="name@domain.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <label>Password *</label>
        <input type="password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <div className="auth-links">
        <Link to="/forgot-password">Forgot password?</Link>
        <Link to={registerPath}>{roleIntent === 'admin' ? 'Register admin account' : `Create ${roleIntent || 'customer'} account`}</Link>
      </div>
    </AuthLayout>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registerIntent = searchParams.get('role');
  const isAdminRegister = registerIntent === 'admin';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Full name, valid email, and password with at least 6 characters are required.');
      return;
    }

    try {
      setLoading(true);
      const creds = await createUserWithEmailAndPassword(firebaseAuth, form.email.trim(), form.password);
      await updateProfile(creds.user, { displayName: form.name.trim() });
      const token = await creds.user.getIdToken(true);
      setAuthToken(token);
      const boot = await api.post('/auth/bootstrap', { name: form.name.trim() });
      navigate(roleHomePath(boot.data?.data?.role), { replace: true });
    } catch {
      setError('Registration failed. Try another email or verify backend availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={isAdminRegister ? 'Register admin account' : `Create ${registerIntent || 'customer'} account`} subtitle={isAdminRegister ? 'Use the default admin credentials for first-time setup or create an admin request account.' : 'Create a secure role-specific account to continue.'} lockToRole={registerIntent}>
      {isAdminRegister ? <p className="hint-text">Default admin credentials for bootstrap: <strong>admin@123.com</strong> / <strong>123456</strong>.</p> : null}
      <form className="auth-form" onSubmit={onSubmit}>
        <label>Full name *</label>
        <input placeholder="Enter your full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <label>Email address *</label>
        <input type="email" placeholder="name@domain.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <label>Password *</label>
        <input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating account…' : isAdminRegister ? 'Create admin account' : `Register ${registerIntent || 'customer'}`}</button>
      </form>
      <div className="auth-links">
        <Link to={registerIntent ? `/login?role=${registerIntent}` : '/login'}>Already have an account? Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(firebaseAuth, email.trim());
      setMessage('Password reset link sent. Please check your inbox and spam folder.');
    } catch {
      setError('Unable to send reset email right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="We will email you a secure reset link.">
      <form className="auth-form" onSubmit={onSubmit}>
        <label>Email address *</label>
        <input type="email" placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
      </form>
      <div className="auth-links"><Link to="/login">Back to sign in</Link></div>
    </AuthLayout>
  );
};
