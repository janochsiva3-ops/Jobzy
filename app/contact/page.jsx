'use client';
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '5rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #0B2545 0%, #0F4C81 100%)', color: '#fff', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 800 }}>
            Contact Jobzy Support
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Our customer helpdesk is available to assist homeowners, service providers, and business clients across Sri Lanka.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '3.5rem', maxWidth: '1000px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {/* Contact Details */}
          <div>
            <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '1.25rem', fontWeight: 800 }}>
              Official Helpdesk
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem' }}>
                <div style={{
                  width: '3.2rem',
                  height: '3.2rem',
                  background: '#EFF6FF',
                  color: '#1D4ED8',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Helpline Hotline</div>
                  <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>+94 70 441 3635</strong>
                  <div style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 600 }}>Mon - Sat: 8:00 AM - 7:00 PM</div>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem' }}>
                <div style={{
                  width: '3.2rem',
                  height: '3.2rem',
                  background: '#EFF6FF',
                  color: '#1D4ED8',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Support Inquiries</div>
                  <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>support@jobzy.lk</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Average response within 2 hours</div>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem' }}>
                <div style={{
                  width: '3.2rem',
                  height: '3.2rem',
                  background: '#EFF6FF',
                  color: '#1D4ED8',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Operations Center</div>
                  <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>Jobzy Lanka Pvt Ltd</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Kilinochchi, Sri Lanka</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card" style={{ padding: '2.25rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '1.25rem', fontWeight: 700 }}>
              Send Us a Direct Message
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <CheckCircle2 size={44} color="#0F766E" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: 700 }}>Message Sent Successfully!</h4>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  Thank you, <strong>{name}</strong>. Our Sri Lankan support helpdesk has received your inquiry and will reply to <strong>{email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Janochsiva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+94 7X XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">How can we assist you?</label>
                  <textarea
                    rows={4}
                    required
                    className="form-control"
                    placeholder="Describe your question, booking inquiry, or provider registration feedback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
