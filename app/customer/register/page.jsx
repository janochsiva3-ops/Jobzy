'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SRI_LANKA_DISTRICTS } from '@/lib/sriLankaData';
import { Eye, EyeOff, UserPlus, Mail, Lock, Phone, MapPin, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    district: 'Kilinochchi',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in as customer
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'customer') {
        router.replace('/customer/dashboard');
      }
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register({ ...formData, role: 'customer' });
      setSuccess('Account created! Redirecting to your dashboard…');
      router.push('/customer/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
      background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 50%, var(--primary-600) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Job<span style={{ color: '#FF7A00' }}>Z</span>y</span>
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0.5rem 0 0.25rem' }}>
            Create Your Customer Account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
            Book verified Sri Lankan professionals.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                <User size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Janochsiva"
                required
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                <Mail size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <Lock size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
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
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                <Phone size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 0771234567"
                autoComplete="tel"
              />
            </div>

            {/* District & City */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="district">
                  <MapPin size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                  District
                </label>
                <select
                  id="district"
                  name="district"
                  className="form-control"
                  value={formData.district}
                  onChange={handleChange}
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="city">City / Town</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Kilinochchi"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  Creating Account…
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider & Links */}
          <div style={{ borderTop: '1px solid var(--slate-200)', marginTop: '1.5rem', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--slate-600)' }}>
              Already have an account?{' '}
              <Link href="/customer/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
                Customer Login <ArrowRight size={13} style={{ verticalAlign: 'middle' }} />
              </Link>
            </span>
            <span style={{ color: 'var(--slate-500)', fontSize: '0.825rem' }}>
              Want to offer services?{' '}
              <Link href="/provider/register" style={{ color: 'var(--slate-700)', fontWeight: 700 }}>
                Register as a Provider →
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
