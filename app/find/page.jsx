'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SRI_LANKA_DISTRICTS } from '@/lib/sriLankaData';
import BookingModal from '@/components/BookingModal';
import { 
  Search, MapPin, Filter, Star, ShieldCheck, 
  ArrowUpDown, X, AlertCircle, Calendar, RefreshCw 
} from 'lucide-react';

function FindProfessionalsContent() {
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [district, setDistrict] = useState(searchParams.get('district') || 'all');
  const [town, setTown] = useState('');
  const [rating, setRating] = useState('0');
  const [pricingType, setPricingType] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // Booking modal
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d))
      .catch(console.error);
  }, []);

  // Fetch providers whenever filters change
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (category !== 'all') q.set('category', category);
      if (district !== 'all') q.set('district', district);
      if (town.trim()) q.set('town', town.trim());
      if (parseFloat(rating) > 0) q.set('rating', rating);
      if (pricingType !== 'all') q.set('pricingType', pricingType);
      if (sort) q.set('sort', sort);
      if (search.trim()) q.set('search', search.trim());

      const res = await fetch(`/api/providers?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProviders(data);
      }
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [category, district, rating, pricingType, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  const handleResetFilters = () => {
    setCategory('all');
    setDistrict('all');
    setTown('');
    setRating('0');
    setPricingType('all');
    setSort('relevance');
    setSearch('');
  };

  return (
    <div className="section" style={{ background: '#FAF9F6', minHeight: '80vh' }}>
      <div className="container">
        {/* Page Heading */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.4rem', color: '#142D4E', marginBottom: '0.5rem', fontWeight: 800 }}>
            Find Skilled Professionals in Sri Lanka
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem' }}>
            Compare credentials, authentic verified customer reviews, transparent pricing models, and book trusted specialists.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'end'
            }}>
              {/* Keyword Search */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Keyword or Trade</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Inverter, Wiring, Teak, O/L"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Service Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All Service Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">District</label>
                <select
                  className="form-control"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  <option value="all">All Sri Lanka Districts</option>
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Town */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Town or Suburb</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Nawala, Negombo"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                />
              </div>

              {/* Pricing Type */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Pricing Model</label>
                <select
                  className="form-control"
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value)}
                >
                  <option value="all">Any Pricing Model</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="fixed">Fixed-Price</option>
                  <option value="quote">Quotation Required</option>
                </select>
              </div>

              {/* Rating */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Minimum Rating</label>
                <select
                  className="form-control"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="0">Any Customer Rating</option>
                  <option value="4.5">4.5 Stars & Above</option>
                  <option value="4.0">4.0 Stars & Above</option>
                </select>
              </div>

              {/* Search button */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Search size={16} />
                  <span>Filter</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleResetFilters}
                  className="btn btn-secondary"
                  title="Reset all filters"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Bar (Count & Sorting) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.95rem', color: '#475569' }}>
            Showing <strong>{providers.length}</strong> skilled professionals matching your criteria
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Sort By:</span>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="relevance">Relevance & Verified</option>
              <option value="rating">Customer Rating (Highest)</option>
              <option value="price_low">Base Price (Lowest First)</option>
              <option value="price_high">Base Price (Highest First)</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <RefreshCw size={32} color="#1D4ED8" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: '#64748B' }}>Searching verified trade professionals across Sri Lanka...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <AlertCircle size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              No service professionals found
            </h3>
            <p style={{ color: '#64748B', maxWidth: '420px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
              We could not find any active professionals matching your specific combination of filters. Try broadening your district or trade category.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {providers.map((pro) => (
              <div key={pro.id} className="provider-card">
                <div className="provider-card-header">
                  <img 
                    src={pro.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200'} 
                    alt={pro.name} 
                    className="provider-avatar"
                  />
                  <div className="provider-info" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                      {pro.verification_status === 'approved' ? (
                        <span className="badge badge-verified">
                          <ShieldCheck size={12} />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="badge badge-pending">
                          <span>Under Review</span>
                        </span>
                      )}

                      {pro.is_sponsored === 1 && (
                        <span className="badge badge-sponsored">
                          <span>Sponsored</span>
                        </span>
                      )}
                    </div>

                    <h3>{pro.name}</h3>
                    <div className="provider-title">{pro.title}</div>
                    
                    <div className="provider-location">
                      <MapPin size={14} color="#64748B" />
                      <span>{pro.city}, {pro.district}</span>
                    </div>
                  </div>
                </div>

                <div className="provider-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="provider-rating">
                      <Star size={16} fill="#F59E0B" color="#F59E0B" />
                      <span>{pro.rating_avg > 0 ? pro.rating_avg.toFixed(1) : 'New'}</span>
                      <span style={{ color: '#94A3B8', fontWeight: 500, fontSize: '0.75rem' }}>
                        ({pro.review_count} reviews)
                      </span>
                    </div>
                    <span style={{ color: '#CBD5E1' }}>&bull;</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {pro.experience_years} yrs exp.
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {pro.bio.length > 115 ? pro.bio.substring(0, 112) + '...' : pro.bio}
                  </p>

                  <div className="provider-skills">
                    {pro.skills.slice(0, 3).map((sk, idx) => (
                      <span key={idx} className="skill-tag">{sk}</span>
                    ))}
                  </div>

                  <div className="provider-pricing-row">
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Rate:</span>
                    <div className="price-display">
                      {pro.pricing_type === 'hourly' && `Rs. ${pro.base_rate.toLocaleString()}/hr`}
                      {pro.pricing_type === 'fixed' && `Rs. ${pro.base_rate.toLocaleString()} fixed`}
                      {pro.pricing_type === 'quote' && 'Quote Required'}
                    </div>
                  </div>
                </div>

                <div className="provider-card-footer">
                  <Link 
                    href={`/providers/${pro.id}`} 
                    className="btn btn-secondary btn-sm"
                  >
                    View Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setSelectedProvider(pro);
                      setBookingModalOpen(true);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Request Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedProvider && (
        <BookingModal
          provider={selectedProvider}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          onBookingSuccess={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function FindProfessionalsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading search filters...</div>}>
      <FindProfessionalsContent />
    </Suspense>
  );
}
