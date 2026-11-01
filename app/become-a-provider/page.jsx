'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, DollarSign, Users, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BecomeAProviderPage() {
  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0B2545 0%, #0F4C81 100%)', color: '#fff', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3rem', color: '#fff', marginBottom: '1.25rem', fontWeight: 800 }}>
            Put Your Skills to Work on Jobzy
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '2rem' }}>
            Connect with homeowners, property managers, and businesses seeking certified electricians, plumbers, carpenters, tutors, and technicians across Sri Lanka.
          </p>

          <Link
            href="/provider/register"
            className="btn btn-primary btn-lg"
          >
            <span>Start Provider Registration</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="container" style={{ marginTop: '3.5rem', maxWidth: '900px' }}>
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              background: '#EFF6FF',
              color: '#1D4ED8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <DollarSign size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: 700 }}>
              Direct LKR Payments
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
              Customers pay you directly in cash or bank transfer upon job satisfaction. Zero intermediate hold-ups.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              background: '#EFF6FF',
              color: '#1D4ED8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: 700 }}>
              Official Verified Badge
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
              Stand out from unverified competition. Your NIC and trade qualifications earn you an administrator-verified badge.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              background: '#EFF6FF',
              color: '#1D4ED8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <Users size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: 700 }}>
              Full Control of Your Schedule
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
              Set your operating hours, define your service districts and towns, and accept or decline requests on your terms.
            </p>
          </div>
        </div>

        {/* Requirements Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '1.25rem', fontWeight: 800 }}>
            Registration Requirements for Sri Lankan Providers
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#475569', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#0F766E" />
              <span>Valid National Identity Card (NIC) number for identity verification.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#0F766E" />
              <span>Technical or vocational certification where applicable (e.g., NVQ Level 3/4, CEB Wireman License, City & Guilds).</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#0F766E" />
              <span>Active Sri Lankan mobile phone number for direct customer booking coordination.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle2 size={18} color="#0F766E" />
              <span>Commitment to transparent pricing, punctuality, and quality workmanship.</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link
            href="/provider/register"
            className="btn btn-primary btn-lg"
          >
            Create Your Professional Profile Now
          </Link>
        </div>
      </div>
    </div>
  );
}
