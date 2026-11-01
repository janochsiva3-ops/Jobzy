'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BookingModal from '@/components/BookingModal';
import MessageModal from '@/components/MessageModal';
import { 
  ShieldCheck, Star, MapPin, Calendar, Clock, DollarSign, 
  MessageSquare, Award, Wrench, CheckCircle2, AlertCircle, 
  ChevronRight, Phone, Mail, ArrowLeft
} from 'lucide-react';

export default function ProviderProfilePage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user, openAuth } = useAuth();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/providers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProvider(data);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '5rem' }}>
        <p>Loading professional profile...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Professional Profile Not Found</h2>
        <p style={{ color: '#64748B', margin: '1rem 0 2rem 0' }}>
          This provider profile does not exist or may have been deactivated.
        </p>
        <Link href="/find" className="btn btn-primary">
          Back to Directory
        </Link>
      </div>
    );
  }

  const isApproved = provider.verification_status === 'approved';

  return (
    <div style={{ background: '#FAF9F6', paddingBottom: '5rem' }}>
      {/* Breadcrumb Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748B' }}>
          <Link href="/find" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0F766E', fontWeight: 600 }}>
            <ArrowLeft size={14} />
            <span>Find Professionals</span>
          </Link>
          <ChevronRight size={14} />
          <span>{provider.category_name}</span>
          <ChevronRight size={14} />
          <span style={{ color: '#142D4E', fontWeight: 600 }}>{provider.name}</span>
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>
            <img 
              src={provider.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300'} 
              alt={provider.name}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #EFF6FF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            />

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                {/* VERIFICATION BADGE STRICTLY ONLY AFTER ADMIN APPROVAL */}
                {isApproved ? (
                  <span className="badge badge-verified">
                    <ShieldCheck size={14} />
                    <span>Jobzy Verified Professional</span>
                  </span>
                ) : (
                  <span className="badge badge-pending">
                    <span>Credentials Under Review</span>
                  </span>
                )}

                {provider.is_sponsored === 1 && (
                  <span className="badge badge-sponsored">
                    <span>{provider.sponsored_label || 'Sponsored Spotlight'}</span>
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: '2.2rem', color: '#0F172A', marginBottom: '0.3rem' }}>
                {provider.name}
              </h1>

              <div style={{ fontSize: '1.1rem', color: '#334155', fontWeight: 600, marginBottom: '0.6rem' }}>
                {provider.title}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.9rem', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={16} color="#1D4ED8" />
                  <span>{provider.city}, {provider.district}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={16} fill="#F59E0B" color="#F59E0B" />
                  <strong style={{ color: '#0F172A' }}>{provider.rating_avg.toFixed(1)}</strong>
                  <span>({provider.review_count} customer reviews)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Wrench size={16} color="#059669" />
                  <span>{provider.experience_years} Years Experience</span>
                </div>
              </div>
            </div>

            {/* Actions & Pricing Card */}
            <div style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '1.5rem',
              minWidth: '260px'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Pricing Basis
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F3866', marginBottom: '0.3rem' }}>
                {provider.pricing_type === 'hourly' && `Rs. ${provider.base_rate.toLocaleString()} / hr`}
                {provider.pricing_type === 'fixed' && `Rs. ${provider.base_rate.toLocaleString()} fixed`}
                {provider.pricing_type === 'quote' && 'Quotation Required'}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                {provider.pricing_description || 'Direct cash or bank payment upon completion.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button 
                  onClick={() => {
                    if (!user) openAuth('login');
                    else setBookingModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Request Booking
                </button>
                <button 
                  onClick={() => {
                    if (!user) openAuth('login');
                    else setMessageModalOpen(true);
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  <MessageSquare size={16} />
                  <span>Message Provider</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Body Content */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Left Column: Bio, Skills, Portfolio, Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Professional Description */}
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0F172A' }}>
                About {provider.name.split(' ')[0]}
              </h3>
              <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {provider.bio}
              </p>
            </div>

            {/* Skills & Specialties */}
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0F172A' }}>
                Specialized Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {provider.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    style={{
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: '1px solid #DBEAFE'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Qualifications & Certifications */}
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0F172A' }}>
                Qualifications & Credentials
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {provider.qualifications.length > 0 ? (
                  provider.qualifications.map((q, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#1E293B' }}>
                      <Award size={18} color="#D97706" />
                      <span>{q}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Standard vocational training registered.</p>
                )}
              </div>
            </div>

            {/* Customer Reviews & Ratings */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
                    Customer Reviews ({provider.reviews.length})
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Real ratings from customers with verified completed bookings.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFBEB', padding: '0.4rem 0.85rem', borderRadius: '10px', border: '1px solid #FEF3C7' }}>
                  <Star size={20} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#92400E' }}>
                    {provider.rating_avg.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#B45309' }}>/ 5.0</span>
                </div>
              </div>

              {provider.reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94A3B8' }}>
                  No customer reviews yet. Book this professional to be the first to share an evaluation!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {provider.reviews.map((rev) => (
                    <div key={rev.id} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <img 
                            src={rev.customer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                            alt={rev.customer_name} 
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                              {rev.customer_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              {rev.customer_city || 'Sri Lanka'} &bull; Verified Completed Service
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              size={14} 
                              fill={s <= rev.rating ? '#F59E0B' : 'transparent'} 
                              color={s <= rev.rating ? '#F59E0B' : '#CBD5E1'} 
                            />
                          ))}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, margin: '0.5rem 0' }}>
                        "{rev.review_text}"
                      </p>

                      {rev.response_text && (
                        <div style={{
                          background: '#F8FAFC',
                          borderLeft: '3px solid #1D4ED8',
                          padding: '0.6rem 0.85rem',
                          borderRadius: '0 8px 8px 0',
                          marginTop: '0.6rem',
                          fontSize: '0.85rem'
                        }}>
                          <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.2rem' }}>
                            Provider Response:
                          </strong>
                          <span style={{ color: '#475569' }}>{rev.response_text}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Service Areas & Availability Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Service Areas */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: '#0F172A' }}>
                Service Areas
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.75rem' }}>
                Districts covered:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                {provider.service_districts.map((d, idx) => (
                  <span 
                    key={idx}
                    style={{
                      background: '#F1F5F9',
                      color: '#334155',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {provider.service_towns && (
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', fontSize: '0.85rem', color: '#475569' }}>
                  <strong>Key Towns:</strong> {provider.service_towns}
                </div>
              )}
            </div>

            {/* Weekly Availability Schedule */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: '#0F172A' }}>
                Weekly Schedule
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
                {Object.entries(provider.availability || {}).map(([day, hours]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #F8FAFC' }}>
                    <span style={{ textTransform: 'capitalize', color: '#475569', fontWeight: 600 }}>{day}</span>
                    <span style={{ color: hours.toLowerCase().includes('closed') ? '#DC2626' : '#0F172A', fontWeight: 500 }}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Booking Guarantee */}
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#166534', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>Jobzy Payment Guarantee</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#15803D', lineHeight: 1.5 }}>
                Direct payment directly to the provider upon completion. Jobzy does not collect online card deductions upfront.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        provider={provider}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onBookingSuccess={() => setBookingModalOpen(false)}
      />

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        recipientId={provider.id}
        recipientName={provider.name}
      />
    </div>
  );
}
