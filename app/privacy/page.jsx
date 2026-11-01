'use client';
import React from 'react';
import { AlertCircle, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '5rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #0B2545 0%, #0F4C81 100%)', color: '#fff', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2.6rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 800 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#CBD5E1' }}>
            Personal Data Protection & Security Guidelines
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
              This draft privacy policy is prepared for review in compliance with Sri Lanka’s Personal Data Protection Act No. 9 of 2022 (PDPA).
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '2.5rem', lineHeight: 1.8, color: '#334155' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.5rem' }}>1. Collection of Information</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            We collect personal information required to facilitate service marketplace connections, including customer name, email address, phone number, and service location. For service providers, we collect professional trade credentials, experience, and identification documents for verification purposes.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.5rem' }}>2. Confidentiality of Verification Documents</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <strong>Critical Security Guarantee:</strong> All National Identity Cards (NICs), Business Registration copies, and vocational certificates submitted by providers are kept strictly confidential. They are stored securely and accessible only to authorized administrators for credential vetting. They are never published on public profile pages or shared with customers.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.5rem' }}>3. Direct In-App Messaging Privacy</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Direct messages exchanged between customers and providers are private and linked to specific booking appointments. We do not sell or monetize personal message contents with third-party advertisers.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.5rem' }}>4. Data Retention & User Rights</h2>
          <p style={{ fontSize: '0.95rem' }}>
            Users may request profile corrections, review moderation audits, or account deletion by submitting a formal request to our Colombo privacy officer at <code>privacy@jobzy.lk</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
