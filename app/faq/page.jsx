'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How to request a booking',
      a: 'Browse our approved providers by service category and district, select your preferred date and time slot, and submit a booking request. The professional will review your request and confirm. If the job requires a custom quote, the provider will send you a price breakdown to approve before the appointment is confirmed.'
    },
    {
      q: 'How to register as a provider',
      a: 'Click "Become a Service Provider" to register. Enter your contact details, service categories, pricing model (hourly, fixed, or quotation required), and service areas. Then submit your National Identity Card (NIC) and trade credentials for administrator verification.'
    },
    {
      q: 'How administrator approval works',
      a: 'When you submit your registration, Jobzy automatically generates a permanent, unique identification number (e.g. JZ-SP-2026-000001). Our administration team inspects your identity and credentials. Once approved, your profile becomes publicly visible and ready to receive customer booking requests.'
    },
    {
      q: 'How quotations and payments work',
      a: 'For services with hourly or fixed rates, your estimate is displayed immediately. For custom projects, providers submit an itemized quotation through Jobzy for customer approval before work begins. All payments are made directly to the service provider in person upon verified completion in Sri Lankan Rupees (LKR) with no hidden fees.'
    },
    {
      q: 'How to cancel a booking',
      a: 'Customers can cancel free of charge up to 12 hours before the scheduled time slot directly from their customer dashboard. If you need to cancel later due to an emergency, please notify the provider via website chat immediately.'
    },
    {
      q: 'How to contact support',
      a: 'Our customer support helpdesk is available via telephone at +94 70 441 3635, email at support@jobzy.lk, and through the Contact page form. Our team is active Monday to Saturday from 8:00 AM to 7:00 PM.'
    }
  ];

  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '5rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #0B2545 0%, #0F4C81 100%)', color: '#fff', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 800 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Everything you need to know about hiring skilled professionals and offering your services on Jobzy Sri Lanka.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '3.5rem', maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="card"
                style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', transition: 'border-color 0.2s', borderColor: isOpen ? '#0F766E' : '#E2E8F0' }}
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#0F172A', fontWeight: 700 }}>
                    {faq.q}
                  </h3>
                  {isOpen ? <ChevronUp size={20} color="#0F766E" /> : <ChevronDown size={20} color="#64748B" />}
                </div>

                {isOpen && (
                  <p style={{ color: '#475569', lineHeight: 1.6, marginTop: '0.75rem', fontSize: '0.95rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
