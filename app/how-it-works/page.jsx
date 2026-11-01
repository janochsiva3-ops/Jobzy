'use client';
import React from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Clock, Star, CheckCircle2, DollarSign, MessageSquare, ArrowRight, UserCheck, Check } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0B2545 0%, #0F4C81 100%)', color: '#fff', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 800 }}>
            How Jobzy Works
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Connecting homeowners and businesses in Sri Lanka with certified skilled professionals in three simple steps.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '3.5rem', maxWidth: '850px' }}>
        {/* For Customers */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer Journey
          </span>
          <h2 style={{ fontSize: '2rem', color: '#0F172A', marginTop: '0.25rem', fontWeight: 800 }}>
            Book a Professional in 3 Steps
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
          {/* Step 1 */}
          <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              background: '#EFF6FF',
              color: '#1D4ED8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
              flexShrink: 0
            }}>
              1
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: 700 }}>
                1. Find
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Search by service category (Electrical, Plumbing, Carpentry, Teaching & Tuition, Appliance Repair, Technical Support, Cleaning) and your district or town in Sri Lanka.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              background: '#EFF6FF',
              color: '#1D4ED8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
              flexShrink: 0
            }}>
              2
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: 700 }}>
                2. Choose
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Compare detailed specialist profiles, verified administrator badges, years of experience, transparent pricing in LKR (hourly, fixed, or quote required), and authentic customer reviews.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              background: '#EFF6FF',
              color: '#1D4ED8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
              flexShrink: 0
            }}>
              3
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: 700 }}>
                3. Book
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Send a direct booking request with your location and task details. Once confirmed or quotation approved, communicate directly with your professional and settle payment upon verified completion.
              </p>
            </div>
          </div>
        </div>

        {/* For Providers */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }} id="provider-guide">
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Provider Pathway
          </span>
          <h2 style={{ fontSize: '2rem', color: '#0F172A', marginTop: '0.25rem', fontWeight: 800 }}>
            For Skilled Service Providers
          </h2>
        </div>

        <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#EFF6FF', color: '#1D4ED8', borderRadius: '8px', padding: '0.5rem', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <strong style={{ color: '#0F172A', fontSize: '1.05rem' }}>1. Register and Submit Credentials:</strong>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.3rem', lineHeight: 1.5 }}>
                  Provide your trade category, experience, service areas, and pricing model. Submit your National Identity Card (NIC) and vocational certificates for manual verification.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#EFF6FF', color: '#1D4ED8', borderRadius: '8px', padding: '0.5rem', flexShrink: 0 }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong style={{ color: '#0F172A', fontSize: '1.05rem' }}>2. Permanent Registration ID & Admin Approval:</strong>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.3rem', lineHeight: 1.5 }}>
                  Jobzy generates your unique identification number (e.g. JZ-SP-2026-000001). Our administration team inspects all documents. Upon approval, you receive the official Verified Badge.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#EFF6FF', color: '#1D4ED8', borderRadius: '8px', padding: '0.5rem', flexShrink: 0 }}>
                <Clock size={20} />
              </div>
              <div>
                <strong style={{ color: '#0F172A', fontSize: '1.05rem' }}>3. Receive Bookings & Manage Jobs:</strong>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.3rem', lineHeight: 1.5 }}>
                  Accept or decline customer requests, send written quotations for custom projects, update job status, and manage your weekly availability.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#EFF6FF', color: '#1D4ED8', borderRadius: '8px', padding: '0.5rem', flexShrink: 0 }}>
                <DollarSign size={20} />
              </div>
              <div>
                <strong style={{ color: '#0F172A', fontSize: '1.05rem' }}>4. Direct LKR Payment & Reputation Building:</strong>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.3rem', lineHeight: 1.5 }}>
                  Receive full direct payment from customers upon work completion. Earn verified reviews from confirmed bookings to build long-term trust.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/find" className="btn btn-secondary btn-lg">
            Find Professionals
          </Link>
          <Link href="/provider/register" className="btn btn-primary btn-lg">
            <span>Become a Service Provider</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
