'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SRI_LANKA_DISTRICTS } from '@/lib/sriLankaData';
import CheckoutModal from '@/components/CheckoutModal';
import {
  Eye, EyeOff, UserPlus, Mail, Lock, Phone, MapPin, User,
  Briefcase, Clock, FileText, DollarSign, ArrowRight, AlertCircle, CheckCircle2, Shield, CreditCard
} from 'lucide-react';

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    district: 'Kilinochchi',
    city: '',
    category_id: '',
    categoryId: '',
    title: '',
    experience_years: '',
    bio: '',
    pricing_type: 'hourly',
    base_rate: '',
    nic_number: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmationId, setConfirmationId] = useState('');
  const [registrationFee, setRegistrationFee] = useState(null);
  const [subscriptionFee, setSubscriptionFee] = useState(null);
  const [showRegFeeCheckout, setShowRegFeeCheckout] = useState(false);
  const [regFeePaid, setRegFeePaid] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');

  // Redirect if already logged in as provider
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'provider' && !confirmationId) {
        router.replace('/provider/dashboard');
      }
    }
  }, [user, authLoading, router, confirmationId]);

  // Fetch active categories from the same source used by service listings
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError('');
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) {
        throw new Error(`Failed to load service categories (HTTP ${res.status})`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (data?.categories || []);
      const activeList = rawList.filter(c => c && (c.is_active === undefined || c.is_active === 1 || c.is_active === true));
      setCategories(activeList);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategoriesError(err.message || 'Unable to load service categories. Please try again.');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Fetch fee settings for pre-registration display
  useEffect(() => {
    async function loadFees() {
      try {
        const res = await fetch('/api/payments/fees');
        if (res.ok) {
          const data = await res.json();
          const regFee = (data.fees || []).find(f => f.fee_type === 'provider_registration');
          const subFee = (data.fees || []).find(f => f.fee_type === 'provider_subscription');
          if (regFee) setRegistrationFee(regFee.amount);
          if (subFee) setSubscriptionFee(subFee.amount);
        }
      } catch {}
    }
    loadFees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'category_id') {
        next.categoryId = value;
      } else if (name === 'categoryId') {
        next.category_id = value;
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const chosenCategoryId = (formData.category_id || formData.categoryId || '').trim();
    if (!chosenCategoryId) {
      setError('Please select a valid service category before submitting.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        ...formData,
        category_id: chosenCategoryId,
        categoryId: chosenCategoryId,
        experienceYears: formData.experience_years,
        baseRate: formData.base_rate,
        pricingType: formData.pricing_type,
        role: 'provider',
        verificationDocs: formData.nic_number ? [
          { type: 'National Identity Card (NIC)', number: formData.nic_number, date: new Date().toISOString() }
        ] : []
      });
      const generatedId = res?.confirmation_id || 'JZ-SP-2026-PENDING';
      setConfirmationId(generatedId);
      if (res?.registration_fee_amount) {
        setRegistrationFee(res.registration_fee_amount);
      }
      setSuccess(`Your registration ID is ${generatedId}. Your status is Awaiting Registration Payment.`);
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

  const selectedCategory = categories.find((c) => String(c.id) === String(formData.category_id || formData.categoryId));
  const inputStyle = { width: '100%' };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B2545 0%, #0F4C81 50%, #047857 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Job<span style={{ color: '#FF7A00' }}>Z</span>y</span>
          </Link>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 700, color: '#fff', margin: '0.5rem 0 0.25rem' }}>
            Register as a Service Provider
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
            Join Sri Lanka&apos;s trusted service marketplace.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', overflow: 'visible' }}>
          {confirmationId ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Shield size={36} />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#0F172A', marginBottom: '0.5rem' }}>
                Registration Submitted!
              </h2>
              <div style={{ background: '#F1F5F9', borderRadius: '8px', padding: '1rem', margin: '1.25rem auto', maxWidth: '480px', border: '1px solid #CBD5E1' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.25rem', fontWeight: 600 }}>Your Permanent Provider ID</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E40AF', letterSpacing: '1px' }}>{confirmationId}</div>
                <div style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  background: regFeePaid ? '#DBEAFE' : '#FEF3C7',
                  color: regFeePaid ? '#1E40AF' : '#92400E',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {regFeePaid ? 'Application Status: Pending Admin Approval' : 'Application Status: Awaiting Registration Payment'}
                </div>
              </div>

              {/* Fee Disclosure */}
              <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '1rem 1.25rem', margin: '0 auto 1.5rem', maxWidth: '500px', textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Platform Fee Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#334155' }}>One-Time Registration Fee:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>LKR {registrationFee?.toLocaleString() ?? '…'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#334155' }}>Monthly Platform Subscription (after approval):</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>LKR {subscriptionFee?.toLocaleString() ?? '…'} / mo</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  ⚠ Verified registration payment changes your status to <strong>Pending Admin Approval</strong>. Payment alone does not approve your account — an administrator must review and approve it manually, after which your first monthly subscription payment activates your public listing.
                </div>
              </div>

              {/* Payment + Dashboard Actions */}
              {regFeePaid ? (
                <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '10px', padding: '0.75rem 1.25rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#065F46', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <CheckCircle2 size={18} />
                  Registration payment verified — Status is now Pending Admin Approval.
                </div>
              ) : (
                <button
                  onClick={() => setShowRegFeeCheckout(true)}
                  className="btn btn-primary"
                  style={{ minWidth: '260px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                >
                  <CreditCard size={16} />
                  Pay Registration Fee — LKR {registrationFee?.toLocaleString() ?? '…'}
                </button>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => router.push('/provider/dashboard')} className="btn btn-secondary">
                  Go to Provider Dashboard →
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div style={{
                  background: 'var(--danger-100)', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: 'var(--danger-700)', fontSize: '0.875rem', fontWeight: 600
                }}>
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div style={{
                  background: 'var(--success-100)', border: '1px solid #6EE7B7', borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: 'var(--success-700)', fontSize: '0.875rem', fontWeight: 600
                }}>
                  <CheckCircle2 size={16} />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate-500)', marginBottom: '1rem', marginTop: 0 }}>
                  Personal Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {/* Full Name */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="name">
                      <User size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                      Full Name
                    </label>
                    <input id="name" name="name" type="text" className="form-control" value={formData.name} onChange={handleChange} placeholder="e.g. Janochsiva" required autoComplete="name" style={inputStyle} />
                  </div>

                  {/* Email */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="email">
                      <Mail size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                      Email Address
                    </label>
                    <input id="email" name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="you@example.com" required autoComplete="email" style={inputStyle} />
                  </div>

                  {/* Password */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="password">
                      <Lock size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input id="password" name="password" type={showPassword ? 'text' : 'password'} className="form-control" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required autoComplete="new-password" style={{ paddingRight: '2.75rem', width: '100%' }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-500)', padding: 0 }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="phone">
                      <Phone size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                      Phone Number
                    </label>
                    <input id="phone" name="phone" type="tel" className="form-control" value={formData.phone} onChange={handleChange} placeholder="e.g. 0771234567" autoComplete="tel" style={inputStyle} />
                  </div>

                  {/* District */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="district">
                      <MapPin size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                      District
                    </label>
                    <select id="district" name="district" className="form-control" value={formData.district} onChange={handleChange} style={inputStyle}>
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="city">City / Town</label>
                    <input id="city" name="city" type="text" className="form-control" value={formData.city} onChange={handleChange} placeholder="e.g. Kilinochchi" style={inputStyle} />
                  </div>
                </div>

                {/* Professional Details */}
                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                  Professional Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {/* Category */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <label className="form-label" htmlFor="category_id" style={{ margin: 0 }}>
                        <Briefcase size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                        Service Category <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      {categoriesLoading && (
                        <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }} />
                          Loading…
                        </span>
                      )}
                    </div>

                    <select
                      id="category_id"
                      name="category_id"
                      className="form-control"
                      value={formData.category_id || formData.categoryId || ''}
                      onChange={handleChange}
                      disabled={categoriesLoading || Boolean(categoriesError) || categories.length === 0}
                      required
                      aria-label="Service Category"
                      style={{
                        ...inputStyle,
                        cursor: (categoriesLoading || categoriesError || categories.length === 0) ? 'not-allowed' : 'pointer',
                        colorScheme: 'light',
                        backgroundColor: '#ffffff',
                        color: (formData.category_id || formData.categoryId) ? '#0f172a' : '#64748b'
                      }}
                    >
                      <option value="" disabled>
                        {categoriesLoading
                          ? 'Loading categories…'
                          : categoriesError
                          ? 'Unable to load categories'
                          : categories.length === 0
                          ? 'No service categories available'
                          : '— Select a category —'}
                      </option>
                      {categories.map((c) => (
                        <option
                          key={String(c.id)}
                          value={String(c.id)}
                          style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>

                    {/* Immediate display of selected category name */}
                    {selectedCategory && (
                      <div
                        id="selected-category-indicator"
                        style={{
                          marginTop: '0.4rem',
                          padding: '0.4rem 0.65rem',
                          background: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          fontSize: '0.8rem',
                          color: '#065F46'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0 }} />
                          <span>Selected: <strong>{selectedCategory.name}</strong></span>
                        </div>
                        {selectedCategory.description && (
                          <span style={{ fontSize: '0.72rem', color: '#047857', opacity: 0.9 }}>
                            {selectedCategory.description.length > 40
                              ? `${selectedCategory.description.substring(0, 40)}…`
                              : selectedCategory.description}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Error State with Retry Button */}
                    {categoriesError && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          padding: '0.6rem 0.75rem',
                          background: '#FEF2F2',
                          border: '1px solid #FCA5A5',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          color: '#991B1B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <AlertCircle size={15} style={{ flexShrink: 0 }} />
                          <span>{categoriesError}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => loadCategories()}
                          className="btn btn-sm"
                          style={{
                            padding: '0.2rem 0.65rem',
                            fontSize: '0.75rem',
                            background: '#DC2626',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* Empty State: No categories configured */}
                    {!categoriesLoading && !categoriesError && categories.length === 0 && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          padding: '0.6rem 0.75rem',
                          background: '#FFFBEB',
                          border: '1px solid #FCD34D',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          color: '#92400E',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                        <span>No service categories are currently configured. Please contact administrator support.</span>
                      </div>
                    )}
                  </div>

                  {/* Professional Title */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="title">Professional Title</label>
                    <input id="title" name="title" type="text" className="form-control" value={formData.title} onChange={handleChange} placeholder="e.g. Certified Electrician" style={inputStyle} />
                  </div>

                  {/* Experience */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="experience_years">
                      <Clock size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                      Years of Experience
                    </label>
                    <input id="experience_years" name="experience_years" type="number" min="0" max="60" className="form-control" value={formData.experience_years} onChange={handleChange} placeholder="e.g. 5" style={inputStyle} />
                  </div>

                  {/* NIC */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="nic_number">NIC Number</label>
                    <input id="nic_number" name="nic_number" type="text" className="form-control" value={formData.nic_number} onChange={handleChange} placeholder="e.g. 200012345678" style={inputStyle} />
                  </div>
                </div>

                {/* Bio */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" htmlFor="bio">
                    <FileText size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                    Professional Bio
                  </label>
                  <textarea id="bio" name="bio" className="form-control" value={formData.bio} onChange={handleChange} placeholder="Describe your skills, experience, and what makes you stand out…" rows={4} style={{ resize: 'vertical' }} />
                </div>

                {/* Pricing */}
                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                  Pricing
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="pricing_type">Pricing Type</label>
                    <select id="pricing_type" name="pricing_type" className="form-control" value={formData.pricing_type} onChange={handleChange} style={inputStyle}>
                      <option value="hourly">Hourly Rate</option>
                      <option value="fixed">Fixed Price</option>
                      <option value="quote">Request a Quote</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="base_rate">
                      <DollarSign size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                      Base Rate (LKR)
                    </label>
                    <input id="base_rate" name="base_rate" type="number" min="0" className="form-control" value={formData.base_rate} onChange={handleChange} placeholder="e.g. 2500" style={inputStyle} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                      Creating Profile…
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Register as Provider
                    </>
                  )}
                </button>
              </form>

              {/* Divider & Links */}
              <div style={{ borderTop: '1px solid var(--slate-200)', marginTop: '1.5rem', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--slate-600)' }}>
                  Already registered?{' '}
                  <Link href="/provider/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
                    Provider Login <ArrowRight size={13} style={{ verticalAlign: 'middle' }} />
                  </Link>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Registration Fee Checkout Modal */}
      {showRegFeeCheckout && (
        <CheckoutModal
          isOpen={showRegFeeCheckout}
          onClose={() => setShowRegFeeCheckout(false)}
          feeType="provider_registration"
          relatedId={confirmationId}
          title="Provider One-Time Registration Fee"
          subtitle={`Registration ID: ${confirmationId} — Payment does not automatically approve your application.`}
          onSuccess={() => {
            setRegFeePaid(true);
            setShowRegFeeCheckout(false);
          }}
        />
      )}
    </div>
  );
}
