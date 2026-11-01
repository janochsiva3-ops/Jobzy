'use client';
import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '5rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #0B2545 0%, #0F4C81 100%)', color: '#fff', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2.6rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 800 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#CBD5E1' }}>
            Jobzy Sri Lanka Marketplace Terms & Conditions
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem', maxWidth: '850px' }}>
        {/* DRAFT CONTENT CALLOUT */}
        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #FCD34D',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={22} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#92400E', fontSize: '0.95rem' }}>DRAFT CONTENT NOTICE:</strong>
            <p style={{ color: '#78350F', fontSize: '0.85rem', marginTop: '0.2rem', lineHeight: 1.5 }}>
              The terms outlined below are development draft guidelines prepared for legal review in accordance with Sri Lankan commercial and consumer protection legislation. These terms govern the current prototype stage.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '2.5rem', lineHeight: 1.8, color: '#334155' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.5rem' }}>1. Platform Role & Scope</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Jobzy operates as a digital intermediary connecting independent service professionals ("Providers") with consumers and businesses ("Customers") in Sri Lanka. Jobzy does not employ providers directly; providers operate as autonomous registered tradespeople.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.5rem' }}>2. Booking Appointments & Confirmations</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Submitting a booking request does not constitute a confirmed appointment. Requested dates and times are considered confirmed strictly when the provider accepts the request. Confirmed bookings are automatically protected against overlapping slots.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.5rem' }}>3. Direct Payment Terms</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Payment for services is made directly from the Customer to the Provider upon job completion in Cash or Direct Bank Transfer. Platform commission is recorded in internal accounting ledgers without claiming online payment gateway collection.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.5rem' }}>4. Cancellation Policy</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Free cancellation is permitted up to 12 hours prior to the scheduled booking slot. Repeated late cancellations or no-shows may lead to temporary account suspension.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.5rem' }}>5. Authentic Review Policy</h2>
          <p style={{ fontSize: '0.95rem' }}>
            Reviews may only be submitted by customers who have completed an actual booking with the provider. Exactly one review per completed booking is permitted to maintain integrity and prevent fraudulent reputation inflation.
          </p>
        </div>
      </div>
    </div>
  );
}
