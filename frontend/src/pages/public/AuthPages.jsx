import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseAuth } from '../../services/firebase.js';
import { api, setAuthToken } from '../../services/api.js';
import { roleHomePath, useAppState } from '../../app/AppProvider.jsx';

const roleIntentMap = {
  seller: { title: 'Seller sign in', subtitle: 'Access your inventory and operational workspace.' },
  admin: { title: 'Admin sign in', subtitle: 'Access governance, audit, and compliance controls.' },
  customer: { title: 'Customer sign in', subtitle: 'Manage your orders, prescriptions, and history.' },
  delivery: { title: 'Delivery sign in', subtitle: 'Track assigned shipments and handoffs.' }
};

const AuthLayout = ({ title, subtitle, children }) => {
  const { auth, authLoading } = useAppState();
  if (!authLoading && auth?.user) return <Navigate to={roleHomePath(auth.role)} replace />;

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

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleIntent = searchParams.get('role');
  const roleCopy = useMemo(() => roleIntentMap[roleIntent] || { title: 'Welcome back', subtitle: 'Sign in to continue to your secure workspace.' }, [roleIntent]);

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
      setError('Sign in failed. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={roleCopy.title} subtitle={roleCopy.subtitle}>
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
        <Link to="/register">Create account</Link>
      </div>
    </AuthLayout>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
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
      await api.post('/auth/bootstrap', { name: form.name.trim() });
      navigate('/customer', { replace: true });
    } catch {
      setError('Registration failed. Try a different email or sign in if account exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Register a secure customer account to get started.">
      <form className="auth-form" onSubmit={onSubmit}>
        <label>Full name *</label>
        <input placeholder="Enter your full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <label>Email address *</label>
        <input type="email" placeholder="name@domain.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <label>Password *</label>
        <input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Register as customer'}</button>
      </form>
      <div className="auth-links">
        <Link to="/login">Already have an account? Sign in</Link>
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
      setError('Unable to send reset email at the moment. Please retry shortly.');
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
