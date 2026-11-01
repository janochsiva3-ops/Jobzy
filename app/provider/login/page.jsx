'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProviderLoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [success, setSuccess] = useState('');

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Redirect if already logged in as provider
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'provider') {
        router.replace('/provider/dashboard');
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRoleError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await login(email, password);
      const role = data.user?.role;

      if (role === 'provider') {
        setSuccess('Login successful! Redirecting…');
        router.push('/provider/dashboard');
      } else if (role === 'customer') {
        setRoleError('customer');
      } else if (role === 'admin') {
        setRoleError('admin');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
    } catch (err) {
      console.error(err);
    }
    setForgotSent(true);
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B2545 0%, #0F4C81 50%, #047857 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Job<span style={{ color: '#FF7A00' }}>Z</span>y</span>
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0.5rem 0 0.25rem' }}>
            Grow your business with Jobzy.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
            Manage your services, bookings and customers.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          {/* Role mismatch errors */}
          {roleError === 'customer' && (
            <div style={{
              background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)',
              padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#1E40AF' }}>
                <AlertCircle size={18} />
                <span>This is a customer account.</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#1E3A8A', margin: 0 }}>
                Please use the Customer Login page.
              </p>
              <Link href="/customer/login" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                Go to Customer Login →
              </Link>
            </div>
          )}

          {roleError === 'admin' && (
            <div style={{
              background: 'var(--danger-100)', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: 'var(--danger-700)', fontSize: '0.875rem', fontWeight: 600
            }}>
              <AlertCircle size={16} />
              <span>Invalid credentials for service provider access.</span>
            </div>
          )}

          {error && (
            <div style={{
              background: 'var(--danger-100)', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: 'var(--danger-700)', fontSize: '0.875rem', fontWeight: 600
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'var(--success-100)', border: '1px solid #6EE7B7', borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: 'var(--success-700)', fontSize: '0.875rem', fontWeight: 600
            }}>
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          {!showForgot ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <Mail size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  <Lock size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-500)', padding: 0
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                    Logging in…
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Log In
                  </>
                )}
              </button>
            </form>
          ) : (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reset Password</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
              {forgotSent ? (
                <div style={{
                  background: 'var(--success-100)', border: '1px solid #6EE7B7', borderRadius: 'var(--radius-md)',
                  padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: 'var(--success-700)', fontSize: '0.875rem', fontWeight: 600
                }}>
                  <CheckCircle2 size={16} />
                  If an account exists, a reset link has been sent.
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="forgot-email">Email Address</label>
                    <input
                      id="forgot-email"
                      type="email"
                      className="form-control"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Send Reset Link</button>
                </form>
              )}
              <button
                type="button"
                onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', marginTop: '1rem', padding: 0 }}
              >
                ← Back to Login
              </button>
            </div>
          )}

          {/* Divider & Links */}
          <div style={{ borderTop: '1px solid var(--slate-200)', marginTop: '1.5rem', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--slate-600)' }}>
              Become a service provider?{' '}
              <Link href="/provider/register" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
                Register here <ArrowRight size={13} style={{ verticalAlign: 'middle' }} />
              </Link>
            </span>
            <span style={{ color: 'var(--slate-500)', fontSize: '0.825rem' }}>
              Looking to book a service?{' '}
              <Link href="/customer/login" style={{ color: 'var(--slate-700)', fontWeight: 700 }}>
                Customer Login →
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
