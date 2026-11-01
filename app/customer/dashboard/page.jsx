'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SRI_LANKA_DISTRICTS } from '@/lib/sriLankaData';
import ReviewModal from '@/components/ReviewModal';
import MessageModal from '@/components/MessageModal';
import ReceiptModal from '@/components/ReceiptModal';
import CheckoutModal from '@/components/CheckoutModal';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, MessageSquare, 
  Star, XCircle, ArrowRight, User, ShieldCheck, MapPin, 
  DollarSign, RefreshCw, AlertTriangle, Receipt, CreditCard
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile' | 'payments'
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Review & Message modal states
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [chatBookingId, setChatBookingId] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  // Payments tab state
  const [paymentTxns, setPaymentTxns] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [viewReceiptTxnId, setViewReceiptTxnId] = useState(null);
  const [bookingForFeePayment, setBookingForFeePayment] = useState(null);

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDistrict, setProfileDistrict] = useState('Colombo');
  const [profileCity, setProfileCity] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/customer/login');
    }
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileDistrict(user.district || 'Colombo');
      setProfileCity(user.city || '');
      setProfileAddress(user.address || '');
    }
  }, [user, authLoading]);

  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = statusFilter === 'all' 
        ? '/api/bookings' 
        : `/api/bookings?status=${statusFilter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token, statusFilter]);

  const fetchPayments = async () => {
    if (!token) return;
    setPaymentsLoading(true);
    try {
      const res = await fetch('/api/payments/transactions', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setPaymentTxns(data.transactions || data || []);
      }
    } catch (err) { console.error(err); }
    finally { setPaymentsLoading(false); }
  };

  useEffect(() => {
    if (token && activeTab === 'payments') fetchPayments();
  }, [token, activeTab]);

  // Customer Actions: Approve Quote
  const handleApproveQuote = async (bookingId) => {
    if (!confirm('Do you want to approve this formal quotation and confirm the appointment?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/approve-quote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else {
        alert(data.message);
        fetchBookings();
      }
    } catch (err) {
      alert('Error approving quotation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Customer Actions: Confirm Completion
  const handleConfirmCompletion = async (bookingId) => {
    if (!confirm('Are you satisfied with the completed work? This will confirm completion and allow you to pay the provider directly.')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/confirm-completion`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else {
        alert(data.message);
        fetchBookings();
      }
    } catch (err) {
      alert('Error confirming completion.');
    } finally {
      setActionLoading(false);
    }
  };

  // Customer Actions: Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    const reason = prompt('Please enter the reason for cancellation (Jobzy Free Cancellation applies):');
    if (!reason) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else {
        alert(data.message);
        fetchBookings();
      }
    } catch (err) {
      alert('Error cancelling booking.');
    } finally {
      setActionLoading(false);
    }
  };

  // Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileName,
          phone: profilePhone,
          district: profileDistrict,
          city: profileCity,
          address: profileAddress
        })
      });
      if (res.ok) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'awaiting_payment':
        return <span className="badge" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B' }}>Awaiting Booking Fee Payment</span>;
      case 'pending':
        return <span className="badge badge-pending">Pending Provider Acceptance</span>;
      case 'awaiting_quote_approval':
        return <span className="badge" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B' }}>Action Needed: Review Quote</span>;
      case 'confirmed':
        return <span className="badge badge-confirmed">Confirmed Appointment</span>;
      case 'in_progress':
        return <span className="badge badge-progress">Work In Progress</span>;
      case 'awaiting_completion':
        return <span className="badge" style={{ background: '#D1FAE5', color: '#047857', border: '1px solid #10B981' }}>Action Needed: Confirm Work</span>;
      case 'completed':
        return <span className="badge badge-completed">Completed</span>;
      case 'declined':
        return <span className="badge badge-declined">Declined</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  if (authLoading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading customer account...</div>;
  }

  if (!user) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>Customer Sign-In Required</h2>
        <p style={{ color: '#64748B', margin: '1rem 0 1.5rem 0' }}>
          Please sign in to access your bookings, messages, and profile.
        </p>
        <button onClick={() => router.push('/customer/login')} className="btn btn-primary">
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div style={{ padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'} 
              alt={user.name} 
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Customer Account</div>
            </div>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li>
            <button 
              className={`sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
              style={{ width: '100%', textAlign: 'left' }}
            >
              <Calendar size={18} />
              <span>My Bookings</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ width: '100%', textAlign: 'left' }}
            >
              <User size={18} />
              <span>Account Profile</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
              style={{ width: '100%', textAlign: 'left' }}
            >
              <CreditCard size={18} />
              <span>Payments &amp; Receipts</span>
            </button>
          </li>
        </ul>

        {/* Cancellation policy reminder box */}
        <div style={{
          marginTop: '2rem',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '0.85rem',
          fontSize: '0.8rem',
          color: '#1E40AF'
        }}>
          <strong>Jobzy Guarantee:</strong> Free cancellation is supported prior to provider dispatch. Direct payments are made in person upon satisfaction.
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-main">
        {/* 1. BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A' }}>My Service Bookings</h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                  Track requests, review provider quotations, communicate, and confirm completed work.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select 
                  className="form-control"
                  style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="awaiting_payment">Awaiting Booking Fee Payment</option>
                  <option value="pending">Pending Provider Acceptance</option>
                  <option value="awaiting_quote_approval">Awaiting Quote Approval</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="awaiting_completion">Awaiting Completion</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <Link href="/find" className="btn btn-primary btn-sm">
                  + Book Another Service
                </Link>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <RefreshCw size={24} color="#1D4ED8" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '0.5rem', color: '#64748B', fontSize: '0.85rem' }}>Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <Calendar size={40} color="#94A3B8" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '0.4rem' }}>
                  No bookings found
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  You do not have any bookings matching this status.
                </p>
                <Link href="/find" className="btn btn-primary">
                  Browse Skilled Professionals
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {bookings.map((b) => (
                  <div key={b.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img 
                          src={b.provider_avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'} 
                          alt={b.provider_name}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>{b.provider_name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 700 }}>
                              #{b.booking_number}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            {b.service_title} &bull; {b.service_category}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        {getStatusBadge(b.status)}
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                          Booked on {new Date(b.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Task Description */}
                    <div style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '1rem', lineHeight: 1.5 }}>
                      <strong>Requirement:</strong> {b.task_description}
                    </div>

                    {/* Scheduled Slot & Location */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.75rem',
                      background: '#F8FAFC',
                      padding: '0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                        <Calendar size={16} color="#1D4ED8" />
                        <span><strong>Date:</strong> {b.scheduled_date}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                        <Clock size={16} color="#1D4ED8" />
                        <span><strong>Time:</strong> {b.scheduled_time_slot}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                        <MapPin size={16} color="#1D4ED8" />
                        <span><strong>Location:</strong> {b.city || b.district}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F4C81' }}>
                        <DollarSign size={16} color="#0F4C81" />
                        <span>
                          <strong>Amount:</strong> {b.final_amount > 0 ? `Rs. ${b.final_amount.toLocaleString()}` : (b.pricing_type === 'quote' ? 'Quotation Required' : `Rs. ${b.initial_quote_estimate.toLocaleString()}`)}
                        </span>
                      </div>
                    </div>

                    {/* AWAITING BOOKING FEE PAYMENT BANNER */}
                    {(b.status === 'awaiting_payment' || b.booking_fee_status === 'unpaid') && b.status !== 'cancelled' && b.status !== 'declined' && (
                      <div style={{
                        background: '#FFFBEB',
                        border: '1.5px solid #F59E0B',
                        borderRadius: '10px',
                        padding: '0.9rem 1rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}>
                        <div style={{ flex: '1 1 280px' }}>
                          <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                            Action Required: Awaiting Booking Fee Payment (LKR {parseFloat(b.booking_fee_amount || 350).toLocaleString('en-LK', { minimumFractionDigits: 2 })})
                          </div>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#78350F', lineHeight: 1.45 }}>
                            This booking is unconfirmed and has not been submitted to the provider yet. Paying the platform booking fee changes its status to <strong>Pending Provider Acceptance</strong>. Payment enables the request to proceed; it does not automatically confirm provider availability.
                          </p>
                        </div>
                        <button
                          onClick={() => setBookingForFeePayment(b)}
                          className="btn btn-primary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <CreditCard size={14} />
                          <span>Pay Booking Fee</span>
                        </button>
                      </div>
                    )}

                    {/* QUOTATION DETAILS CARD (If Quote mode & awaiting approval) */}
                    {b.status === 'awaiting_quote_approval' && b.quote_details && (
                      <div style={{
                        background: '#FFFBEB',
                        border: '1.5px solid #FCD34D',
                        borderRadius: '10px',
                        padding: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 800, color: '#92400E', fontSize: '0.95rem' }}>
                            Formal Quotation Submitted by Provider:
                          </span>
                          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F3866' }}>
                            Rs. {b.quote_details.amount.toLocaleString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#78350F', marginBottom: '0.5rem' }}>
                          <strong>Breakdown:</strong> {b.quote_details.breakdown}
                        </p>
                        <div style={{ fontSize: '0.75rem', color: '#92400E', display: 'flex', gap: '1.5rem' }}>
                          <span><strong>Estimated Duration:</strong> {b.quote_details.estimatedDays}</span>
                          <span><strong>Valid Until:</strong> {b.quote_details.validUntil}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => {
                            setChatRecipient({ id: b.provider_id, name: b.provider_name });
                            setChatBookingId(b.id);
                            setChatModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          <MessageSquare size={14} />
                          <span>Message {b.provider_name.split(' ')[0]}</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {/* 0. If Awaiting Booking Fee Payment -> Pay Booking Fee Button */}
                        {(b.status === 'awaiting_payment' || b.booking_fee_status === 'unpaid') && b.status !== 'cancelled' && b.status !== 'declined' && (
                          <button
                            onClick={() => setBookingForFeePayment(b)}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <CreditCard size={14} />
                            <span>Pay Booking Fee</span>
                          </button>
                        )}

                        {/* 1. If Awaiting Quote Approval -> Approve Button */}
                        {b.status === 'awaiting_quote_approval' && (
                          <button 
                            onClick={() => handleApproveQuote(b.id)}
                            disabled={actionLoading}
                            className="btn btn-primary btn-sm"
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve Quotation</span>
                          </button>
                        )}

                        {/* 2. If Awaiting Completion Confirmation -> Confirm Completion Button */}
                        {['awaiting_completion', 'in_progress'].includes(b.status) && (
                          <button 
                            onClick={() => handleConfirmCompletion(b.id)}
                            disabled={actionLoading}
                            className="btn btn-success btn-sm"
                          >
                            <CheckCircle2 size={14} />
                            <span>Confirm Completion & Pay Direct</span>
                          </button>
                        )}

                        {/* 3. If Completed -> Leave Review Button */}
                        {b.status === 'completed' && (
                          b.review_id ? (
                            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Star size={14} fill="#059669" color="#059669" />
                              <span>Reviewed ({b.review_rating}★)</span>
                            </span>
                          ) : (
                            <button 
                              onClick={() => {
                                setSelectedBookingForReview(b);
                                setReviewModalOpen(true);
                              }}
                              className="btn btn-accent btn-sm"
                            >
                              <Star size={14} />
                              <span>Rate & Review Provider</span>
                            </button>
                          )
                        )}

                        {/* 4. Cancel Button */}
                        {['awaiting_payment', 'pending', 'confirmed', 'awaiting_quote_approval'].includes(b.status) && (
                          <button 
                            onClick={() => handleCancelBooking(b.id)}
                            disabled={actionLoading}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#DC2626' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              My Customer Profile
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Update your contact address and mobile number so service providers can reach you easily.
            </p>

            <div className="card">
              {profileSaved && (
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="form-control"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Email Address (Read-only)</label>
                    <input 
                      type="email" 
                      disabled 
                      className="form-control"
                      value={user.email}
                      style={{ background: '#F1F5F9', color: '#64748B' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input 
                      type="tel" 
                      className="form-control"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">District</label>
                    <select 
                      className="form-control"
                      value={profileDistrict}
                      onChange={(e) => setProfileDistrict(e.target.value)}
                    >
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Town / City</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Street Address</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Save Profile Details
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 3. PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', color: '#0F172A' }}>Payments &amp; Receipts</h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                View your Jobzy platform booking fee payments, refund status, and printable receipts.
              </p>
            </div>

            {paymentsLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94A3B8' }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                <p>Loading payment history…</p>
              </div>
            ) : paymentTxns.length === 0 ? (
              <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B' }}>
                <CreditCard size={36} style={{ margin: '0 auto 0.75rem', color: '#94A3B8' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.35rem' }}>No Platform Payments Yet</h3>
                <p style={{ fontSize: '0.875rem' }}>Any Jobzy booking fee payments and refunds will appear here with downloadable receipts.</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <tr>
                        {['Transaction Ref', 'Fee Type', 'Amount (LKR)', 'Status', 'Date', 'Receipt'].map(h => (
                          <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748B', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paymentTxns.map((txn, idx) => (
                        <tr key={txn.id} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                          <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#0F172A' }}>{txn.transaction_reference}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>Customer Booking Fee (v{txn.fee_version || 1})</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                            LKR {parseFloat(txn.amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: txn.status === 'successful' ? '#DCFCE7' : txn.status === 'refunded' ? '#FEF3C7' : txn.status === 'failed' ? '#FEE2E2' : '#F1F5F9',
                              color: txn.status === 'successful' ? '#166534' : txn.status === 'refunded' ? '#92400E' : txn.status === 'failed' ? '#B91C1C' : '#475569'
                            }}>
                              {txn.status?.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748B' }}>{txn.created_at?.split('T')[0]}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            {(txn.status === 'successful' || txn.status === 'refunded') && (
                              <button
                                onClick={() => setViewReceiptTxnId(txn.id)}
                                style={{ fontSize: '0.78rem', color: '#0F766E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                              >
                                <Receipt size={14} /> View Receipt
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          booking={selectedBookingForReview}
          onReviewSuccess={() => {
            fetchBookings();
            setReviewModalOpen(false);
          }}
        />
      )}

      {/* Message Modal */}
      {chatRecipient && (
        <MessageModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.name}
          bookingId={chatBookingId}
        />
      )}

      {/* Receipt Modal */}
      {viewReceiptTxnId && (
        <ReceiptModal
          isOpen={!!viewReceiptTxnId}
          onClose={() => setViewReceiptTxnId(null)}
          transactionId={viewReceiptTxnId}
        />
      )}

      {/* Pay Booking Fee Modal (for retrying/completing unpaid booking fee) */}
      {bookingForFeePayment && (
        <CheckoutModal
          isOpen={!!bookingForFeePayment}
          onClose={() => setBookingForFeePayment(null)}
          feeType="customer_booking"
          relatedId={bookingForFeePayment.id}
          title="Customer Platform Booking Request Fee"
          subtitle={`Booking #${bookingForFeePayment.booking_number} with ${bookingForFeePayment.provider_name} — ${bookingForFeePayment.scheduled_date}`}
          providerName={bookingForFeePayment.provider_name}
          onSuccess={() => {
            setBookingForFeePayment(null);
            fetchBookings();
            if (activeTab === 'payments') fetchPayments();
          }}
        />
      )}
    </div>
  );
}
