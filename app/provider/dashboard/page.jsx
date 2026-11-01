'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SRI_LANKA_DISTRICTS } from '@/lib/sriLankaData';
import { formatSriLankaDateTime } from '@/lib/dateUtils';
import QuoteResponseModal from '@/components/QuoteResponseModal';
import MessageModal from '@/components/MessageModal';
import CheckoutModal from '@/components/CheckoutModal';
import ReceiptModal from '@/components/ReceiptModal';
import { 
  Calendar, DollarSign, Clock, CheckCircle2, AlertCircle, 
  MessageSquare, Star, ShieldCheck, Wrench, User, RefreshCw, 
  MapPin, Award, Check, X, FileText, TrendingUp, CreditCard, Receipt
} from 'lucide-react';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, providerProfile, token, loading: authLoading, fetchCurrentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'earnings' | 'services' | 'verification' | 'reviews' | 'billing'
  const [bookings, setBookings] = useState([]);
  const [earningsData, setEarningsData] = useState({ records: [], totals: { totalGross: 0, totalCommission: 0, totalNet: 0 } });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Quote & Chat modals
  const [selectedBookingForQuote, setSelectedBookingForQuote] = useState(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [chatBookingId, setChatBookingId] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  // Billing & Subscription tab state
  const [billingData, setBillingData] = useState(null);
  const [billingTransactions, setBillingTransactions] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [showSubCheckout, setShowSubCheckout] = useState(false);
  const [showRegCheckout, setShowRegCheckout] = useState(false);
  const [viewReceiptTxnId, setViewReceiptTxnId] = useState(null);

  // Profile edit states
  const [editTitle, setEditTitle] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPricingType, setEditPricingType] = useState('hourly');
  const [editBaseRate, setEditBaseRate] = useState(1800);
  const [editPricingDesc, setEditPricingDesc] = useState('');
  const [editTowns, setEditTowns] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Verification submission state
  const [newNic, setNewNic] = useState('');
  const [newCert, setNewCert] = useState('');
  const [verifSubmitted, setVerifSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/provider/login');
    }
    if (providerProfile) {
      setEditTitle(providerProfile.title || '');
      setEditBio(providerProfile.bio || '');
      setEditPricingType(providerProfile.pricing_type || 'hourly');
      setEditBaseRate(providerProfile.base_rate || 1800);
      setEditPricingDesc(providerProfile.pricing_description || '');
      setEditTowns(providerProfile.service_towns || '');
    }
  }, [user, providerProfile, authLoading]);

  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBookings(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/provider/earnings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEarningsData(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBilling = async () => {
    if (!token) return;
    setBillingLoading(true);
    try {
      const [subRes, txnRes] = await Promise.all([
        fetch('/api/payments/subscriptions', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/payments/transactions', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (subRes.ok) setBillingData(await subRes.json());
      if (txnRes.ok) {
        const txnData = await txnRes.json();
        setBillingTransactions(txnData.transactions || txnData || []);
      }
    } catch (err) {
      console.error('Billing fetch error:', err);
    } finally {
      setBillingLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchEarnings();
      fetchBilling();
    }
  }, [token]);

  // Provider response: Accept
  const handleAcceptBooking = async (bookingId) => {
    if (!confirm('Accept this booking? The slot will be reserved and confirmed for the customer.')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'accept' })
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else {
        alert(data.message);
        fetchBookings();
      }
    } catch (err) {
      alert('Error accepting booking.');
    } finally {
      setActionLoading(false);
    }
  };

  // Provider response: Decline
  const handleDeclineBooking = async (bookingId) => {
    const reason = prompt('Please state reason for declining:');
    if (!reason) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'decline', reason })
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else {
        alert(data.message);
        fetchBookings();
      }
    } catch (err) {
      alert('Error declining booking.');
    } finally {
      setActionLoading(false);
    }
  };

  // Provider workflow: Start Job (In Progress)
  const handleStartJob = async (bookingId) => {
    if (!confirm('Mark this job as In Progress?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/start-job`, {
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
      alert('Error updating status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Provider workflow: Request Completion Confirmation
  const handleRequestCompletion = async (bookingId) => {
    if (!confirm('Request completion confirmation from the customer?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/request-completion`, {
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
      alert('Error requesting completion.');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Profile & Services
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/providers/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle,
          bio: editBio,
          pricingType: editPricingType,
          baseRate: parseFloat(editBaseRate),
          pricingDescription: editPricingDesc,
          serviceTowns: editTowns
        })
      });
      if (res.ok) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
        fetchCurrentUser();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Verification document submission
  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    if (!newNic && !newCert) {
      alert('Please provide your NIC number or trade certificate reference.');
      return;
    }
    const docs = [
      { type: 'National Identity Card (NIC)', number: newNic, date: new Date().toISOString() },
      { type: 'Technical / Vocational Certificate', number: newCert, date: new Date().toISOString() }
    ];
    try {
      const res = await fetch('/api/providers/submit-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ documents: docs, notes: 'Resubmitted for administrator approval.' })
      });
      if (res.ok) {
        setVerifSubmitted(true);
        setTimeout(() => setVerifSubmitted(false), 4000);
        fetchCurrentUser();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading provider dashboard...</div>;

  if (!user || user.role !== 'provider') {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>Service Provider Account Required</h2>
        <p style={{ color: '#64748B', margin: '1rem 0 1.5rem 0' }}>
          This area is protected for registered Sri Lankan service providers.
        </p>
        <button onClick={() => router.push('/provider/login')} className="btn btn-primary">
          Log In as Provider
        </button>
      </div>
    );
  }

  const isVerified = providerProfile?.verification_status === 'approved';
  const regFeePaid = Boolean(providerProfile?.registration_fee_paid);
  const subRecord = billingData?.subscription || providerProfile?.subscription || null;
  const subStatus = subRecord?.status || 'none';
  const isSubscriptionSuspended =
    user?.status === 'suspended' &&
    (user?.suspension_type === 'subscription_unpaid' || user?.subscription_suspended === 1 || subStatus === 'suspended_unpaid');
  const isPastDueGrace = subStatus === 'past_due';
  const needsFirstSubscription = isVerified && (!subRecord || subStatus === 'pending');
  const canAcceptNewWork = isVerified && !isSubscriptionSuspended && (subStatus === 'active' || subStatus === 'past_due');

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div style={{ padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'} 
              alt={user.name} 
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {providerProfile?.category_name || 'Service Provider'}
              </div>
              {providerProfile?.confirmation_id && (
                <div style={{ fontSize: '0.7rem', color: '#1E40AF', fontWeight: 700, marginTop: '2px', fontFamily: 'monospace' }}>
                  ID: {providerProfile.confirmation_id}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {isSubscriptionSuspended && (
              <span className="badge badge-declined" style={{ width: '100%', justifyContent: 'center', background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FCA5A5' }}>
                <span>Suspended — Unpaid Subscription</span>
              </span>
            )}
            {isVerified ? (
              <span className="badge badge-verified" style={{ width: '100%', justifyContent: 'center' }}>
                <ShieldCheck size={14} />
                <span>Approved Provider</span>
              </span>
            ) : providerProfile?.verification_status === 'changes_requested' ? (
              <span className="badge" style={{ width: '100%', justifyContent: 'center', background: '#FFEDD5', color: '#9A3412', border: '1px solid #FDBA74' }}>
                <span>Changes Requested</span>
              </span>
            ) : providerProfile?.verification_status === 'rejected' ? (
              <span className="badge badge-declined" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Application Rejected</span>
              </span>
            ) : !regFeePaid ? (
              <span className="badge badge-pending" style={{ width: '100%', justifyContent: 'center', background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
                <span>Awaiting Registration Payment</span>
              </span>
            ) : (
              <span className="badge badge-pending" style={{ width: '100%', justifyContent: 'center', background: '#DBEAFE', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
                <span>Pending Admin Approval</span>
              </span>
            )}
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
              <span>Booking Requests ({bookings.length})</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item ${activeTab === 'earnings' ? 'active' : ''}`}
              onClick={() => setActiveTab('earnings')}
              style={{ width: '100%', textAlign: 'left' }}
            >
              <DollarSign size={18} />
              <span>Earnings & Commission Ledger</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
              style={{ width: '100%', textAlign: 'left' }}
            >
              <Wrench size={18} />
              <span>Profile, Rates & Services</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item ${activeTab === 'verification' ? 'active' : ''}`}
              onClick={() => setActiveTab('verification')}
              style={{ width: '100%', textAlign: 'left' }}
            >
              <ShieldCheck size={18} />
              <span>Verification Documents</span>
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
              style={{ width: '100%', textAlign: 'left' }}
            >
              <DollarSign size={18} />
              <span>Billing &amp; Subscription</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-main">
        {/* 1. SUBSCRIPTION SUSPENSION BANNER (Restricted Login Mode) */}
        {isSubscriptionSuspended && (
          <div style={{
            background: '#FEF2F2',
            border: '2px solid #EF4444',
            borderRadius: '10px',
            padding: '1.15rem 1.35rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: '1 1 320px' }}>
              <AlertCircle size={22} color="#B91C1C" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#991B1B', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  Account Status: Suspended — Unpaid Subscription
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#7F1D1D', fontWeight: 600, lineHeight: 1.5 }}>
                  Your account is suspended because your subscription payment is overdue. Pay your subscription to restore access.
                </p>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#991B1B', lineHeight: 1.45 }}>
                  Your public listing is hidden from search results and new booking requests cannot be accepted. You have restricted access to Billing &amp; Subscription, Payment History, <Link href="/contact" style={{ color: '#991B1B', textDecoration: 'underline', fontWeight: 700 }}>Support</Link>, and your existing bookings so you can fulfil or resolve ongoing jobs.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowSubCheckout(true)}
                className="btn btn-primary btn-sm"
                style={{ background: '#DC2626', borderColor: '#DC2626', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <CreditCard size={15} />
                <span>Pay Subscription</span>
              </button>
              <Link href="/contact" className="btn btn-secondary btn-sm">
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* 2. FIVE-DAY SUBSCRIPTION GRACE PERIOD WARNING BANNER */}
        {!isSubscriptionSuspended && isPastDueGrace && (
          <div style={{
            background: '#FFFBEB',
            border: '2px solid #F59E0B',
            borderRadius: '10px',
            padding: '1.1rem 1.35rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: '1 1 320px' }}>
              <AlertCircle size={22} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  Subscription Past Due — 5-Day Grace Period Active
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350F', lineHeight: 1.5 }}>
                  Your monthly subscription renewal of <strong>LKR {parseFloat(subRecord?.current_amount || billingData?.monthlyFee || 1500).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</strong> (due on <strong>{formatSriLankaDateTime(subRecord?.next_due_date, true)}</strong>) is unpaid. Your profile remains active during the 5-day grace period, but will be automatically suspended on <strong>{formatSriLankaDateTime(subRecord?.grace_period_end, true)}</strong> if payment is not verified.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSubCheckout(true)}
              className="btn btn-primary btn-sm"
              style={{ background: '#D97706', borderColor: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <CreditCard size={15} />
              <span>Pay Subscription</span>
            </button>
          </div>
        )}

        {/* 3. FIRST MONTHLY SUBSCRIPTION REQUIRED AFTER APPROVAL BANNER */}
        {!isSubscriptionSuspended && needsFirstSubscription && (
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #60A5FA',
            borderRadius: '10px',
            padding: '1.1rem 1.35rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: '1 1 320px' }}>
              <ShieldCheck size={22} color="#1D4ED8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#1E3A8A', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  Application Approved — First Monthly Subscription Required for Public Activation
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1E40AF', lineHeight: 1.5 }}>
                  Your provider registration has been approved by the administrator! Complete your first monthly subscription payment (<strong>LKR {parseFloat(billingData?.monthlyFee || subRecord?.current_amount || 1500).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</strong>) to activate your profile in public search listings and start receiving customer bookings.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSubCheckout(true)}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <CreditCard size={15} />
              <span>Pay Subscription</span>
            </button>
          </div>
        )}

        {/* 4. REGISTRATION PAYMENT / ADMIN APPROVAL BANNER */}
        {providerProfile?.verification_status !== 'approved' && (
          <div style={{
            background: !regFeePaid
              ? '#FEF3C7'
              : providerProfile?.verification_status === 'pending'
              ? '#EFF6FF'
              : providerProfile?.verification_status === 'changes_requested'
              ? '#FFF7ED'
              : '#FEE2E2',
            border: `1px solid ${
              !regFeePaid
                ? '#F59E0B'
                : providerProfile?.verification_status === 'pending'
                ? '#60A5FA'
                : providerProfile?.verification_status === 'changes_requested'
                ? '#EA580C'
                : '#EF4444'
            }`,
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: '1 1 320px' }}>
              <AlertCircle size={20} color={
                !regFeePaid
                  ? '#B45309'
                  : providerProfile?.verification_status === 'pending'
                  ? '#1D4ED8'
                  : providerProfile?.verification_status === 'changes_requested'
                  ? '#C2410C'
                  : '#B91C1C'
              } style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                  {!regFeePaid && 'Status: Awaiting Registration Payment'}
                  {regFeePaid && providerProfile?.verification_status === 'pending' && 'Status: Pending Admin Approval'}
                  {providerProfile?.verification_status === 'changes_requested' && 'Changes Requested on Your Provider Application'}
                  {providerProfile?.verification_status === 'rejected' && 'Application Not Approved'}
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', lineHeight: '1.5' }}>
                  {providerProfile?.confirmation_id && (
                    <span><strong>Your registration ID is {providerProfile.confirmation_id}. </strong></span>
                  )}
                  {!regFeePaid && (
                    <span>Please complete your one-time registration fee payment to submit your application for administrator review. You can edit your profile and credentials below, but your profile is not listed publicly until paid, approved by an administrator, and your first monthly subscription is active.</span>
                  )}
                  {regFeePaid && providerProfile?.verification_status === 'pending' && (
                    <span>Your registration fee has been verified. Your application is now Pending Admin Approval. Our administrator team will review your credentials manually.</span>
                  )}
                  {providerProfile?.verification_status === 'changes_requested' && (
                    <span>{providerProfile?.decision_reason || providerProfile?.verification_notes || 'Please update your profile information or verification documents as requested by the administrator.'}</span>
                  )}
                  {providerProfile?.verification_status === 'rejected' && (
                    <span>Reason: {providerProfile?.decision_reason || providerProfile?.verification_notes || 'Please contact administrator for further guidance.'}</span>
                  )}
                </p>
              </div>
            </div>
            {!regFeePaid && (
              <button
                onClick={() => setShowRegCheckout(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <CreditCard size={15} />
                <span>Pay Registration Fee</span>
              </button>
            )}
          </div>
        )}

        {/* 1. BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A' }}>Service Requests & Jobs</h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                  Manage incoming customer appointments, submit formal quotations, and update job progress.
                </p>
              </div>

              <Link href={`/providers/${user.id}`} target="_blank" className="btn btn-secondary btn-sm">
                View Public Profile &rarr;
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <RefreshCw size={24} color="#1D4ED8" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '0.5rem', color: '#64748B', fontSize: '0.85rem' }}>Loading assigned requests...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <Calendar size={40} color="#94A3B8" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '0.4rem' }}>
                  No service requests at the moment
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
                  Make sure your profile and availability are up to date so customers in your district can reach you.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {bookings.map((b) => (
                  <div key={b.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img 
                          src={b.customer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                          alt={b.customer_name}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>{b.customer_name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 700 }}>
                              #{b.booking_number}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            Phone: {b.customer_phone || 'Customer contact provided'}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className="badge" style={{
                          background: b.status === 'confirmed' ? '#DBEAFE' : (b.status === 'completed' ? '#D1FAE5' : '#FEF3C7'),
                          color: b.status === 'confirmed' ? '#1E40AF' : (b.status === 'completed' ? '#047857' : '#92400E')
                        }}>
                          {b.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                          Requested for {b.scheduled_date} ({b.scheduled_time_slot})
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '1rem', lineHeight: 1.5 }}>
                      <strong>Task Description:</strong> {b.task_description}
                    </div>

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
                      <div>
                        <strong>Service Address:</strong> {b.address || `${b.city}, ${b.district}`}
                      </div>
                      <div>
                        <strong>Pricing Basis:</strong> {b.pricing_type}
                      </div>
                      <div>
                        <strong>Agreed Amount:</strong> {b.final_amount > 0 ? `Rs. ${b.final_amount.toLocaleString()}` : 'Awaiting Quote'}
                      </div>
                    </div>

                    {/* Quotation card if in quotation mode */}
                    {b.quote_details && (
                      <div style={{
                        background: '#FFFBEB',
                        border: '1px solid #FCD34D',
                        borderRadius: '8px',
                        padding: '0.85rem',
                        fontSize: '0.85rem',
                        marginBottom: '1rem'
                      }}>
                        <strong>Quotation Provided:</strong> Rs. {b.quote_details.amount.toLocaleString()} &bull; 
                        <span style={{ color: '#78350F' }}> {b.quote_details.breakdown}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem' }}>
                      <button 
                        onClick={() => {
                          setChatRecipient({ id: b.customer_id, name: b.customer_name });
                          setChatBookingId(b.id);
                          setChatModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <MessageSquare size={14} />
                        <span>Message Customer</span>
                      </button>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {/* 1. If Pending -> Accept, Decline, or Prepare Quote */}
                        {b.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleAcceptBooking(b.id)}
                              disabled={actionLoading || !canAcceptNewWork}
                              title={!canAcceptNewWork ? 'Cannot accept new booking requests while subscription is unpaid or suspended' : 'Accept Appointment'}
                              className="btn btn-primary btn-sm"
                              style={!canAcceptNewWork ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                              <Check size={14} />
                              <span>Accept Appointment</span>
                            </button>
                            <button 
                              onClick={() => handleDeclineBooking(b.id)}
                              disabled={actionLoading}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#DC2626' }}
                            >
                              <X size={14} />
                              <span>Decline</span>
                            </button>
                          </>
                        )}

                        {/* If Quote mode requested & awaiting quote */}
                        {b.pricing_type === 'quote' && b.status === 'awaiting_quote_approval' && !b.quote_details && (
                          <button 
                            onClick={() => {
                              setSelectedBookingForQuote(b);
                              setQuoteModalOpen(true);
                            }}
                            disabled={!canAcceptNewWork}
                            className="btn btn-accent btn-sm"
                            style={!canAcceptNewWork ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                          >
                            <FileText size={14} />
                            <span>Prepare & Submit Quote</span>
                          </button>
                        )}

                        {/* 2. If Confirmed -> Start Job */}
                        {b.status === 'confirmed' && (
                          <button 
                            onClick={() => handleStartJob(b.id)}
                            disabled={actionLoading}
                            className="btn btn-primary btn-sm"
                          >
                            <Wrench size={14} />
                            <span>Start Work (Mark In Progress)</span>
                          </button>
                        )}

                        {/* 3. If In Progress -> Request Completion Confirmation */}
                        {b.status === 'in_progress' && (
                          <button 
                            onClick={() => handleRequestCompletion(b.id)}
                            disabled={actionLoading}
                            className="btn btn-success btn-sm"
                          >
                            <CheckCircle2 size={14} />
                            <span>Request Completion Confirmation</span>
                          </button>
                        )}

                        {b.status === 'awaiting_completion' && (
                          <span style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 600 }}>
                            Awaiting customer completion confirmation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. EARNINGS & LEDGER TAB */}
        {activeTab === 'earnings' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              Earnings & Platform Commission Ledger
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Jobzy tracks gross revenue, customer direct payment receipts, and single platform commission records without false online deductions.
            </p>

            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                  <DollarSign size={24} />
                </div>
                <div>
                  <div className="kpi-val">Rs. {earningsData.totals.totalGross.toLocaleString()}</div>
                  <div className="kpi-label">Gross Completed Volume</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div className="kpi-val">Rs. {earningsData.totals.totalCommission.toLocaleString()}</div>
                  <div className="kpi-label">Recorded Platform Fee (10%)</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon" style={{ background: '#D1FAE5', color: '#059669' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="kpi-val">Rs. {earningsData.totals.totalNet.toLocaleString()}</div>
                  <div className="kpi-label">Net Provider Balance</div>
                </div>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Booking Ref</th>
                    <th>Service</th>
                    <th>Customer Payment</th>
                    <th>Gross (LKR)</th>
                    <th>Platform Fee (10%)</th>
                    <th>Net Balance</th>
                    <th>Date Recorded</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.records.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>
                        No completed jobs in accounting ledger yet.
                      </td>
                    </tr>
                  ) : (
                    earningsData.records.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: '#1D4ED8' }}>
                            #{r.booking_number || 'JBZ-DIRECT'}
                          </span>
                        </td>
                        <td>{r.service_title || 'Completed Service'}</td>
                        <td>
                          <span className="badge badge-completed">Paid Direct</span>
                        </td>
                        <td>Rs. {r.gross_amount.toLocaleString()}</td>
                        <td style={{ color: '#D97706' }}>- Rs. {r.commission_amount.toLocaleString()}</td>
                        <td style={{ fontWeight: 700, color: '#059669' }}>
                          Rs. {r.net_provider_amount.toLocaleString()}
                        </td>
                        <td>{new Date(r.recorded_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PROFILE & SERVICES TAB */}
        {activeTab === 'services' && (
          <div style={{ maxWidth: '700px' }}>
            <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              Edit Professional Profile & Rates
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Keep your pricing model, professional bio, and service towns accurate for customers searching in your region.
            </p>

            <div className="card">
              {profileSaved && (
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  Professional profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label className="form-label">Professional Headline</label>
                  <input 
                    type="text" 
                    required 
                    className="form-control"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Pricing Model</label>
                    <select 
                      className="form-control"
                      value={editPricingType}
                      onChange={(e) => setEditPricingType(e.target.value)}
                    >
                      <option value="hourly">Hourly Rate (LKR)</option>
                      <option value="fixed">Fixed-Price Package</option>
                      <option value="quote">Quotation Required</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Base Rate (LKR)</label>
                    <input 
                      type="number" 
                      min="500"
                      step="100"
                      className="form-control"
                      value={editBaseRate}
                      onChange={(e) => setEditBaseRate(e.target.value)}
                      disabled={editPricingType === 'quote'}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pricing Explanation</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. Rs. 1,800/hr minimum 1 hour call-out. Materials billed with receipts."
                    value={editPricingDesc}
                    onChange={(e) => setEditPricingDesc(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Key Service Towns</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. Nugegoda, Dehiwala, Rajagiriya, Colombo 01-15"
                    value={editTowns}
                    onChange={(e) => setEditTowns(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Bio & Experience</label>
                  <textarea 
                    rows={4}
                    className="form-control"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Professional Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. VERIFICATION DOCUMENTS TAB */}
        {activeTab === 'verification' && (
          <div style={{ maxWidth: '650px' }}>
            <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              Verification Status & Credentials
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Jobzy administrators inspect submitted NICs, business registrations, and trade certificates before issuing the Verified Badge.
            </p>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: isVerified ? '#D1FAE5' : '#FEF3C7',
                  color: isVerified ? '#059669' : '#D97706',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#0F172A' }}>
                    Status: {providerProfile?.verification_status?.toUpperCase() || 'PENDING'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    {providerProfile?.verification_notes || 'Credentials on file for administrator review.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '1rem' }}>
                Upload / Update Credentials
              </h3>

              {verifSubmitted && (
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  Verification credentials submitted for administrator review!
                </div>
              )}

              <form onSubmit={handleSubmitVerification}>
                <div className="form-group">
                  <label className="form-label">National Identity Card (NIC) Number</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. 198224501234"
                    value={newNic}
                    onChange={(e) => setNewNic(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Vocational / Trade Certificate Reference</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. NVQ-4 Wireman #LIC-9842"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                  />
                </div>

                <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1rem' }}>
                  <strong>Confidentiality Notice:</strong> Verification documents are kept private and accessible only to authorized Jobzy administrators. They are never published on your public profile.
                </p>

                <button type="submit" className="btn btn-primary">
                  Submit Credentials for Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── BILLING & SUBSCRIPTION TAB ── */}
        {activeTab === 'billing' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.25rem', fontWeight: 700 }}>Billing &amp; Subscription</h2>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Manage your Jobzy platform fees, subscription, and payment receipts.</p>
            </div>

            {billingLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94A3B8' }}><RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} /><p>Loading billing info…</p></div>
            ) : (
              <>
                {/* Registration Fee Status */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.25rem' }}>One-Time Registration Fee</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: providerProfile?.registration_fee_paid ? '#059669' : '#DC2626' }}>
                        {providerProfile?.registration_fee_paid ? '✓ PAID' : '⚠ UNPAID'}
                      </div>
                      {providerProfile?.confirmation_id && (
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>Provider ID: {providerProfile.confirmation_id}</div>
                      )}
                    </div>
                    {!providerProfile?.registration_fee_paid && (
                      <button
                        onClick={() => setShowRegCheckout(true)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <CreditCard size={15} /> Pay Registration Fee
                      </button>
                    )}
                  </div>
                </div>

                {/* Subscription Status */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.25rem' }}>Monthly Platform Subscription</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem' }}>
                        Amount: LKR {parseFloat(billingData?.subscription?.current_amount || billingData?.monthlyFee || 1500).toLocaleString('en-LK', { minimumFractionDigits: 2 })} / month
                      </div>
                      {billingData?.subscription ? (
                        <>
                          <div style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: billingData.subscription.status === 'active'
                              ? '#059669'
                              : billingData.subscription.status === 'past_due'
                              ? '#D97706'
                              : '#DC2626'
                          }}>
                            {billingData.subscription.status === 'active'
                              ? '✓ Payment Status: Active'
                              : billingData.subscription.status === 'past_due'
                              ? '⚠ Payment Status: Past Due (5-Day Grace Period)'
                              : billingData.subscription.status === 'suspended_unpaid'
                              ? '⛔ Payment Status: Suspended — Unpaid Subscription'
                              : billingData.subscription.status === 'pending'
                              ? '⏳ Payment Status: Awaiting First Monthly Subscription Payment'
                              : `Payment Status: ${billingData.subscription.status?.toUpperCase()}`}
                          </div>
                          {billingData.subscription.current_period_start && billingData.subscription.current_period_end && (
                            <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.3rem' }}>
                              Current Billing Period: <strong>{formatSriLankaDateTime(billingData.subscription.current_period_start, false)} &rarr; {formatSriLankaDateTime(billingData.subscription.current_period_end, false)}</strong>
                            </div>
                          )}
                          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem' }}>
                            Due Date (Sri Lanka Time): <strong>{billingData.subscription.next_due_date ? formatSriLankaDateTime(billingData.subscription.next_due_date, true) : 'Upon first subscription payment'}</strong>
                          </div>
                          {billingData.subscription.status === 'past_due' && billingData.subscription.grace_period_end && (
                            <div style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: 700, marginTop: '0.25rem' }}>
                              Automatic Suspension Deadline (5-Day Grace Period): {formatSriLankaDateTime(billingData.subscription.grace_period_end, true)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{ fontSize: '0.875rem', color: '#DC2626', fontWeight: 600 }}>
                          {isVerified ? '⏳ Awaiting First Monthly Subscription Payment' : '⚠ Subscription activates after registration payment and admin approval'}
                        </div>
                      )}
                      {isVerified && billingData?.upcomingBillingPeriod && !billingData.upcomingBillingPeriod.alreadyPaidCurrentPeriod && (
                        <div style={{ fontSize: '0.76rem', color: '#0F766E', marginTop: '0.4rem', fontWeight: 600 }}>
                          Next payment covers: {billingData.upcomingBillingPeriod.periodStartFormatted} &rarr; {billingData.upcomingBillingPeriod.periodEndFormatted}
                        </div>
                      )}
                    </div>
                    {isVerified && (
                      billingData?.upcomingBillingPeriod?.alreadyPaidCurrentPeriod ? (
                        <span style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          background: '#DCFCE7',
                          color: '#166534',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}>
                          ✓ Current Period Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => setShowSubCheckout(true)}
                          className="btn btn-primary"
                          style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <CreditCard size={15} />
                          <span>Pay Subscription</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Payment History */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F1F5F9', fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                    Payment History
                  </div>
                  {billingTransactions.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>No payment records found.</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead style={{ background: '#F8FAFC' }}>
                          <tr>
                            {['Txn Reference', 'Type', 'Amount', 'Status', 'Date', 'Receipt'].map(h => (
                              <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {billingTransactions.map((txn, i) => (
                            <tr key={txn.id} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                              <td style={{ padding: '0.65rem 1rem', fontFamily: 'monospace', color: '#334155' }}>{txn.transaction_reference}</td>
                              <td style={{ padding: '0.65rem 1rem', color: '#475569', textTransform: 'capitalize' }}>{txn.fee_type?.replace(/_/g, ' ')}</td>
                              <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#0F172A' }}>LKR {parseFloat(txn.amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                              <td style={{ padding: '0.65rem 1rem' }}>
                                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
                                  background: txn.status === 'successful' ? '#DCFCE7' : txn.status === 'refunded' ? '#FEF9C3' : txn.status === 'failed' ? '#FEE2E2' : '#F1F5F9',
                                  color: txn.status === 'successful' ? '#166534' : txn.status === 'refunded' ? '#854D0E' : txn.status === 'failed' ? '#B91C1C' : '#475569'
                                }}>
                                  {txn.status?.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '0.65rem 1rem', color: '#64748B' }}>{txn.created_at?.split('T')[0]}</td>
                              <td style={{ padding: '0.65rem 1rem' }}>
                                {txn.status === 'successful' && (
                                  <button
                                    onClick={() => setViewReceiptTxnId(txn.id)}
                                    style={{ fontSize: '0.72rem', color: '#0F766E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                  >
                                    <Receipt size={13} /> View
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Quote Preparation Modal */}
      {selectedBookingForQuote && (
        <QuoteResponseModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          booking={selectedBookingForQuote}
          onQuoteSuccess={() => {
            fetchBookings();
            setQuoteModalOpen(false);
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

      {/* Subscription Checkout */}
      {showSubCheckout && (
        <CheckoutModal
          isOpen={showSubCheckout}
          onClose={() => setShowSubCheckout(false)}
          feeType="provider_subscription"
          relatedId={user?.id}
          title="Monthly Platform Subscription"
          subtitle="Renew or activate your monthly provider listing subscription."
          onSuccess={() => { fetchBilling(); fetchCurrentUser(); }}
        />
      )}

      {/* Registration Fee Checkout */}
      {showRegCheckout && (
        <CheckoutModal
          isOpen={showRegCheckout}
          onClose={() => setShowRegCheckout(false)}
          feeType="provider_registration"
          relatedId={providerProfile?.confirmation_id}
          title="Provider One-Time Registration Fee"
          subtitle="Your profile is under review. Payment does not grant automatic approval."
          onSuccess={() => { fetchBilling(); fetchCurrentUser(); }}
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
    </div>
  );
}
