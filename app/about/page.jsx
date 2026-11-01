'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0B2545 0%, #0F4C81 100%)', color: '#fff', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 800 }}>
            Empowering Skilled Professionals Across Sri Lanka
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Jobzy was created to eliminate the friction in finding reliable, verified trade professionals, tutors, and technicians throughout our island nation.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '3.5rem', maxWidth: '900px' }}>
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '1rem', fontWeight: 800 }}>
            Our Purpose
          </h2>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            In Sri Lanka, finding an honest electrician, a certified plumber, or a qualified tutor has historically depended on word-of-mouth or unverified contacts. Homeowners face uncertain pricing, while skilled master artisans often struggle to showcase their credentials.
          </p>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem' }}>
            <strong>Jobzy</strong> bridges this gap with a modern digital platform. We provide transparent pricing models in Sri Lankan Rupees (LKR), verify National Identity Cards and trade credentials before granting verification badges, and allow customers and providers to communicate directly without intermediate transaction hold-ups.
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
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
              Rigorous Verification
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
              NICs and vocational certificates (NVQ, CEB, NAITA) are inspected by administrators before issuing the Verified Badge.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
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
              Community Trust
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
              Reviews are restricted to customers with verified completed bookings, maintaining authentic feedback scores.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
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
              <MapPin size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: 700 }}>
              Island-Wide Reach
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
              Serving Northern, Western, Central, Southern, Eastern, and North Western provinces with localized district and town filters.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/find" className="btn btn-primary btn-lg">
            <span>Explore Skilled Professionals</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
