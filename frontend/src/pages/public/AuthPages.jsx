import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseAuth } from '../../services/firebase.js';
import { api, setAuthToken } from '../../services/api.js';
import { roleHomePath, useAppState } from '../../app/AppProvider.jsx';

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
      setError('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your operations workspace.">
      <form className="auth-form" onSubmit={onSubmit}>
        <label>Email *</label>
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <label>Password *</label>
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
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
      setError('Name, valid email, and password (6+ chars) are required.');
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
      setError('Registration failed. Try another email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Register a secure customer account.">
      <form className="auth-form" onSubmit={onSubmit}>
        <label>Full name *</label>
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <label>Email *</label>
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <label>Password *</label>
        <input type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register as Customer'}</button>
      </form>
      <div className="auth-links">
        <Link to="/login">Already have an account? Login</Link>
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
      setMessage('Password reset email sent. Check your inbox.');
    } catch {
      setError('Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Receive a secure password reset email.">
      <form className="auth-form" onSubmit={onSubmit}>
        <label>Email *</label>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
      </form>
      <div className="auth-links"><Link to="/login">Back to login</Link></div>
    </AuthLayout>
  );
};
