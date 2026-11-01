'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SRI_LANKA_DISTRICTS } from '@/lib/sriLankaData';
import {
  Search, MapPin, ShieldCheck, Star, Clock, CheckCircle2,
  ArrowRight, ChevronDown, ChevronUp, Zap, Droplet, Hammer,
  GraduationCap, Cpu, Wrench, Sparkles, MessageSquare,
  HelpCircle, UserCheck, AlertCircle
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const [featuredPros, setFeaturedPros] = useState([]);
  const [loadingPros, setLoadingPros] = useState(true);

  // Search form state
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchDistrict, setSearchDistrict] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/providers/featured');
        if (res.ok) {
          const data = await res.json();
          setFeaturedPros(data);
        }
      } catch (err) {
        console.error('Error loading featured professionals:', err);
      } finally {
        setLoadingPros(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = searchKeyword.trim().toLowerCase();

    // Match if entered text matches one of our defined categories
    const matchedCat = categoriesList.find(
      (c) => c.name.toLowerCase() === trimmed || c.slug.toLowerCase() === trimmed
    );

    if (matchedCat) {
      params.set('category', matchedCat.slug);
    } else if (searchKeyword.trim()) {
      params.set('search', searchKeyword.trim());
    }

    if (searchDistrict !== 'all') {
      params.set('district', searchDistrict);
    }

    router.push(`/find?${params.toString()}`);
  };

  // 8 Specific Service Categories required by specification with photographs
  const categoriesList = [
    {
      name: 'Electricians',
      slug: 'electricians',
      icon: <Zap size={26} />,
      image: '/images/categories/electricians.jpg',
      alt: 'Professional electrician in safety gear working on electrical wiring and panel',
      desc: 'Wiring, power fixtures, circuit repairs, and safety installations'
    },
    {
      name: 'Plumbers',
      slug: 'plumbers',
      icon: <Droplet size={26} />,
      image: '/images/categories/plumbers.jpg',
      alt: 'Professional plumber repairing water pipes and drainage fittings under a sink',
      desc: 'Leak repairs, pipe installations, drainage, and bathroom fittings'
    },
    {
      name: 'Carpenters',
      slug: 'carpenters',
      icon: <Hammer size={26} />,
      image: '/images/categories/carpenters.jpg',
      alt: 'Skilled carpenter crafting and repairing custom wooden furniture in a workshop',
      desc: 'Custom woodwork, furniture repairs, roofing, and door/window fittings'
    },
    {
      name: 'Teachers and Tutors',
      slug: 'teachers-and-tutors',
      icon: <GraduationCap size={26} />,
      image: '/images/categories/teachers-and-tutors.jpg',
      alt: 'Dedicated tutor guiding students through academic coursework and study materials',
      desc: 'School subjects, academic tuition, language lessons, and exam preparation'
    },
    {
      name: 'Appliance Repair',
      slug: 'appliance-repair',
      icon: <Wrench size={26} />,
      image: '/images/categories/appliance-repair.jpg',
      alt: 'Certified technician repairing household appliance and cooling systems',
      desc: 'Air conditioner servicing, washing machines, and refrigerator repairs'
    },
    {
      name: 'Technicians',
      slug: 'technicians',
      icon: <Cpu size={26} />,
      image: '/images/categories/technicians.jpg',
      alt: 'Electronics technician testing circuit boards and repairing electronic equipment',
      desc: 'Computer systems, networking, electronics, and technical troubleshooting'
    },
    {
      name: 'Cleaning',
      slug: 'cleaners',
      icon: <Sparkles size={26} />,
      image: '/images/categories/cleaners.jpg',
      alt: 'Professional cleaning specialist sanitizing and maintaining home spaces',
      desc: 'Residential house cleaning, commercial spaces, and post-construction cleanup'
    },
    {
      name: 'Other Services',
      slug: 'other-services',
      icon: <UserCheck size={26} />,
      image: '/images/categories/other-services.jpg',
      alt: 'Versatile handyman performing general property maintenance and home repairs',
      desc: 'Specialized trades, maintenance, and custom skilled service requirements'
    }
  ];

  // Accurate FAQs matching actual website features and policies
  const faqs = [
    {
      q: 'How do I find a professional?',
      a: 'Use the search form at the top of the homepage or visit the Find Professionals page. You can filter by service category, district or town, minimum rating, and pricing type to find verified specialists available in your area.'
    },
    {
      q: 'How do I request a booking?',
      a: 'Browse the professional’s profile to review their experience, qualifications, and pricing terms. Click "Request Booking" to submit your service address, preferred date and time, and a description of the task directly to the provider.'
    },
    {
      q: 'When is my booking confirmed?',
      a: 'A booking request is not confirmed immediately upon submission. It is confirmed only after the service provider reviews your task requirements, checks their schedule, and accepts the request through their dashboard.'
    },
    {
      q: 'How are prices and quotations handled?',
      a: 'Providers list their pricing basis as an hourly rate, a fixed fee for standard jobs, or quotation required. For complex or custom jobs, providers can discuss details via messaging and issue an itemized quotation before commencing work.'
    },
    {
      q: 'How do I become a service provider?',
      a: 'Click "Become a Service Provider" to create your specialist account. Select your trade categories, set your pricing basis and service coverage areas, and upload your National Identity Card (NIC) and trade credentials for verification.'
    },
    {
      q: 'What happens after provider registration?',
      a: 'Once submitted, our administration team inspects your identity documents and qualifications. After administrator approval, your profile becomes publicly listed on Jobzy and you can begin receiving and managing customer booking requests.'
    }
  ];

  return (
    <div className="home-page-container">
      {/* 1. HERO SECTION */}
      <section className="hero-clean-section">
        <div className="container">
          <div className="hero-clean-content">
            <h1 className="hero-clean-title">
              Find the Right Professional for Every Job.
            </h1>
            <p className="hero-clean-subtitle">
              Connect with local electricians, plumbers, carpenters, tutors and more. Explore their profiles and request a service through Jobzy.
            </p>

            {/* Prominent Search Form */}
            <form className="hero-search-wrapper" onSubmit={handleSearchSubmit}>
              <div className="search-field-pill">
                <Search size={18} color="#1D4ED8" />
                <input
                  type="text"
                  placeholder="Service category or keyword (e.g. Electrician, Plumbing)"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  aria-label="Search by service or keyword"
                  id="hero-search-input"
                  list="service-category-options"
                />
                <datalist id="service-category-options">
                  <option value="Electricians" />
                  <option value="Plumbers" />
                  <option value="Carpenters" />
                  <option value="Teachers and Tutors" />
                  <option value="Appliance Repair" />
                  <option value="Technicians" />
                  <option value="Cleaning" />
                  <option value="Other Services" />
                </datalist>
              </div>

              <div className="search-field-pill">
                <MapPin size={18} color="#1D4ED8" />
                <select
                  value={searchDistrict}
                  onChange={(e) => setSearchDistrict(e.target.value)}
                  aria-label="Select district or town"
                  id="hero-district-select"
                >
                  <option value="all">All Districts & Towns</option>
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" id="btn-hero-find">
                <span>Find Professionals</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Group Photograph of Skilled Service Professionals (Illustration of categories) */}
            <div className="hero-photo-container">
              <img
                src="/images/service-professionals-group.jpg"
                alt="Illustration of service categories: skilled Sri Lankan professionals including an electrician, plumber, carpenter, tutor, appliance technician, computer specialist, cleaning professional, and maintenance worker"
                loading="eager"
                decoding="async"
              />
              <div className="hero-photo-caption">
                Connecting you with skilled professionals for everyday needs.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICE CATEGORIES */}
      <section className="section" id="categories" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="section-title">
            <h2>Service Categories</h2>
            <p>Explore trusted skilled trades and choose the specialist best suited for your task.</p>
          </div>

          <div className="cat-grid-clean">
            {categoriesList.map((cat) => (
              <Link
                key={cat.slug}
                href={`/find?category=${cat.slug}`}
                className="cat-item-card"
                id={`cat-link-${cat.slug}`}
              >
                <div className="cat-item-image-wrapper">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    className="cat-item-image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="cat-item-body">
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                  <span className="cat-item-link-text">
                    <span>Browse {cat.name}</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW JOBZY WORKS */}
      <section className="section" id="how-it-works" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-title">
            <h2>How Jobzy Works</h2>
            <p>A transparent and straightforward process to book skilled assistance in three clear steps.</p>
          </div>

          <div className="how-steps-grid">
            <div className="how-step-card">
              <div className="how-step-num">1</div>
              <div style={{ color: '#1D4ED8', marginBottom: '0.75rem' }}>
                <Search size={32} />
              </div>
              <h3>1. Find</h3>
              <p>
                Search for the service you need in your area. Filter by trade, district, and ratings to view available specialists.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-num">2</div>
              <div style={{ color: '#1D4ED8', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3>2. Choose</h3>
              <p>
                Compare professional profiles, transparent pricing in LKR, verified badges, and authentic customer reviews.
              </p>
            </div>

            <div className="how-step-card">
              <div className="how-step-num">3</div>
              <div style={{ color: '#1D4ED8', marginBottom: '0.75rem' }}>
                <Clock size={32} />
              </div>
              <h3>3. Book</h3>
              <p>
                Submit a request with your job details and preferred schedule, and receive confirmation once accepted by the provider.
              </p>
            </div>
          </div>

          {/* Explicit note that booking is not confirmed until accepted */}
          <div className="how-notice-box">
            <AlertCircle size={20} color="#1D4ED8" style={{ flexShrink: 0 }} />
            <div>
              <strong>Important Notice:</strong> Submitting a service request does not immediately confirm your appointment. Bookings are confirmed only after the service provider reviews your task and accepts the request.
            </div>
          </div>
        </div>
      </section>

      {/* 4. AVAILABLE PROFESSIONALS */}
      <section className="section" id="professionals" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="flex items-center justify-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2.25rem', color: '#0F172A', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                Available Professionals
              </h2>
              <p style={{ color: '#64748B', fontSize: '1.05rem', marginTop: '0.25rem' }}>
                Active specialists verified by administrator review and ready to assist.
              </p>
            </div>

            <Link href="/find" className="btn btn-secondary" id="btn-view-all-pros">
              <span>View All Professionals</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loadingPros ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner" />
              <p style={{ marginTop: '0.75rem', color: '#64748B' }}>Loading verified professionals...</p>
            </div>
          ) : featuredPros.length === 0 ? (
            /* When no approved providers exist in database */
            <div className="pro-empty-box">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
              <h3>Our professional community is growing.</h3>
              <p>
                Offer your skills and become one of the first service providers on Jobzy.
              </p>
              <Link href="/provider/register" className="btn btn-primary btn-lg" id="btn-become-pro-empty">
                <span>Become a Service Provider</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            /* Display actual approved, active providers from the database */
            <div className="grid-3">
              {featuredPros.map((pro) => {
                const initials = pro.name
                  ? pro.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                  : 'SP';
                const hasReviews = pro.review_count && pro.review_count > 0;

                return (
                  <div key={pro.id} className="pro-card-clean">
                    <div className="pro-card-top">
                      {pro.avatar ? (
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="pro-avatar-img"
                        />
                      ) : (
                        <div className="pro-avatar-fallback">
                          {initials}
                        </div>
                      )}

                      <div className="pro-meta">
                        {pro.verification_status === 'approved' && (
                          <div style={{ marginBottom: '0.25rem' }}>
                            <span className="badge badge-verified">
                              <ShieldCheck size={12} />
                              <span>Verified</span>
                            </span>
                          </div>
                        )}
                        <h3>{pro.name}</h3>
                        <div className="pro-service-tag">
                          {pro.title || pro.category_name || 'Skilled Specialist'}
                        </div>
                        <div className="pro-loc-row">
                          <MapPin size={13} color="#64748B" />
                          <span>{pro.city ? `${pro.city}, ` : ''}{pro.district || 'Sri Lanka'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pro-card-middle">
                      <div className="pro-rating-line">
                        {hasReviews ? (
                          <>
                            <Star size={15} fill="#F59E0B" color="#F59E0B" />
                            <strong style={{ color: '#0F172A' }}>{pro.rating_avg.toFixed(1)}</strong>
                            <span style={{ color: '#64748B' }}>({pro.review_count} {pro.review_count === 1 ? 'review' : 'reviews'})</span>
                          </>
                        ) : (
                          <span style={{ color: '#64748B', fontStyle: 'italic', fontSize: '0.85rem' }}>
                            No reviews yet
                          </span>
                        )}
                      </div>

                      <div className="pro-price-line">
                        {pro.pricing_type === 'hourly' && pro.base_rate
                          ? `Rs. ${pro.base_rate.toLocaleString()} / hour`
                          : pro.pricing_type === 'fixed' && pro.base_rate
                          ? `Rs. ${pro.base_rate.toLocaleString()} fixed`
                          : 'Request a quote'}
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                      <Link
                        href={`/providers/${pro.id}`}
                        className="btn btn-secondary"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. WHY CHOOSE JOBZY? */}
      <section className="section" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Jobzy?</h2>
            <p>Designed to help homeowners and businesses find dependable local services without guesswork.</p>
          </div>

          <div className="benefits-grid-4">
            <div className="benefit-card-clean">
              <div className="benefit-icon-wrapper">
                <MapPin size={24} />
              </div>
              <h3>Find local help</h3>
              <p>
                Search by service category and location across Sri Lanka’s districts to discover specialists near you.
              </p>
            </div>

            <div className="benefit-card-clean">
              <div className="benefit-icon-wrapper">
                <ShieldCheck size={24} />
              </div>
              <h3>Reviewed provider profiles</h3>
              <p>
                Providers complete an administrator identity and credential review before appearing publicly on Jobzy.
              </p>
            </div>

            <div className="benefit-card-clean">
              <div className="benefit-icon-wrapper">
                <Clock size={24} />
              </div>
              <h3>Convenient bookings</h3>
              <p>
                Submit service requests online and track their status from submission through to completion.
              </p>
            </div>

            <div className="benefit-card-clean">
              <div className="benefit-icon-wrapper">
                <MessageSquare size={24} />
              </div>
              <h3>Easy communication</h3>
              <p>
                Discuss service details, task specifications, and arrival times directly through website messaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. JOIN AS A SERVICE PROVIDER */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="join-provider-banner">
            <h2>Turn Your Skills into New Opportunities.</h2>
            <p className="join-desc">
              Create your professional profile, reach local customers and manage your booking requests through Jobzy.
            </p>
            <Link
              href="/provider/register"
              className="btn btn-accent btn-lg"
              id="btn-join-provider-section"
            >
              <span>Become a Service Provider</span>
              <ArrowRight size={18} />
            </Link>
            <p className="join-note-text">
              Provider registration is subject to administrator approval.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="section" id="faq" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about hiring professionals and offering services on Jobzy.</p>
          </div>

          <div className="faq-accordion-container">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="faq-accordion-item">
                  <button
                    className="faq-accordion-btn"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    id={`faq-btn-${index}`}
                  >
                    <span>{faq.q}</span>
                    <span style={{ color: '#1D4ED8', display: 'flex', alignItems: 'center' }}>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-accordion-body" id={`faq-body-${index}`}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
