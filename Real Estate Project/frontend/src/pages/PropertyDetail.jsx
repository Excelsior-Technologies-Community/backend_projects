import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail, 
  Send, CheckCircle2, ShieldCheck, Building, Waves, Dumbbell, 
  Trees, Cpu, Wifi, Car, Wind, Eye, ArrowLeft, Calendar
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';

const iconMap = {
  waves: Waves,
  'shield-check': ShieldCheck,
  dumbbell: Dumbbell,
  trees: Trees,
  cpu: Cpu,
  wifi: Wifi,
  car: Car,
  wind: Wind,
  eye: Eye
};

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useCartWishlist();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProperty(data);
        const firstImg = data.images?.[0]?.url || data.primary_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
        setActiveImage(firstImg);
      }
    } catch (err) {
      console.error('Failed to load property details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setInquiryError('');
    setInquirySuccess(false);

    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message || `I would like to schedule a viewing for ${property?.title || 'this property'}.`
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }

      setInquirySuccess(true);
      setFormData(prev => ({ ...prev, message: '' }));
    } catch (err) {
      setInquiryError(err.message || 'Submission error. Please try again.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#63c0ee] border-t-transparent" />
          <p className="text-sm text-gray-500 mt-3 font-medium">Retrieving architectural portfolio...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">The listing you are searching for might have been sold or archived.</p>
        <Link to="/properties" className="px-6 py-2.5 rounded-xl bg-[#63c0ee] text-white font-semibold text-sm">
          Browse All Properties
        </Link>
      </div>
    );
  }

  const favorited = isInWishlist(property.id);
  const images = property.images && property.images.length > 0
    ? property.images
    : [{ id: 1, url: property.primary_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' }];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#63c0ee] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Property Listings</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(property)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                favorited
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
              <span>{favorited ? 'Saved to Favorites' : 'Save Property'}</span>
            </button>
          </div>
        </div>

        {/* Property Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#161829] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {property.purpose || 'For Sale'}
              </span>
              <span className="bg-[#63c0ee] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {property.category_name || property.type || 'Villa'}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {property.status || 'Active'}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#161829] tracking-tight">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
              <MapPin className="w-4 h-4 text-[#63c0ee] flex-shrink-0" />
              <span>{property.address || `${property.location_name || ''}, ${property.location_city || 'USA'}`}</span>
            </p>
          </div>

          <div className="lg:text-right">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Offered At</p>
            <p className="text-3xl lg:text-4xl font-extrabold text-[#161829] tracking-tight">
              ${Number(property.price).toLocaleString()}
              {property.purpose === 'For Rent' && <span className="text-base text-gray-500 font-medium"> / mo</span>}
            </p>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-10">
          <div className="rounded-3xl overflow-hidden aspect-16/9 md:aspect-21/9 bg-gray-100 shadow-md border border-gray-100">
            <img
              src={activeImage}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition cursor-pointer ${
                    activeImage === img.url ? 'border-[#63c0ee] scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid: Specs, Overview & Sticky Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Specs, Description, Amenities */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <Bed className="w-5 h-5 text-[#63c0ee] mx-auto mb-1" />
                <p className="text-lg font-extrabold text-gray-900">{property.bedrooms || 3}</p>
                <p className="text-xs text-gray-500">Bedrooms</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <Bath className="w-5 h-5 text-[#63c0ee] mx-auto mb-1" />
                <p className="text-lg font-extrabold text-gray-900">{property.bathrooms || 2}</p>
                <p className="text-xs text-gray-500">Bathrooms</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <Square className="w-5 h-5 text-[#63c0ee] mx-auto mb-1" />
                <p className="text-lg font-extrabold text-gray-900">{Number(property.areaSqFt || 2400).toLocaleString()}</p>
                <p className="text-xs text-gray-500">Square Feet</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <Building className="w-5 h-5 text-[#63c0ee] mx-auto mb-1" />
                <p className="text-lg font-extrabold text-gray-900 truncate">{property.type || 'Villa'}</p>
                <p className="text-xs text-gray-500">Architecture</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs">
              <h2 className="text-xl font-bold text-[#161829] mb-4">About this Property</h2>
              <div className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                {property.description || 'Welcome to this distinguished architectural estate offering high ceilings, master suite accommodations, private outdoor pool and entertainment amenities.'}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs">
              <h2 className="text-xl font-bold text-[#161829] mb-4">Features & Luxury Amenities</h2>
              {property.amenities && property.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((am) => {
                    const IconComponent = iconMap[am.icon] || ShieldCheck;
                    return (
                      <div
                        key={am.id}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50/80 border border-gray-100 text-xs font-semibold text-gray-800"
                      >
                        <IconComponent className="w-4 h-4 text-[#63c0ee] flex-shrink-0" />
                        <span>{am.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Private Swimming Pool', '24/7 Security Concierge', 'Gym & Wellness Spa', 'Private Landscaped Garden', 'Smart Automation System', 'Multi-Car Garage'].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-800">
                      <ShieldCheck className="w-4 h-4 text-[#63c0ee]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location & Neighborhood */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs">
              <h2 className="text-xl font-bold text-[#161829] mb-2">Location & Neighborhood</h2>
              <p className="text-xs text-gray-500 mb-4">{property.address || 'Beverly Hills, California'}</p>
              <div className="h-64 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-[#63c0ee] text-white flex items-center justify-center shadow-lg mb-2 z-10 animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-900 z-10">{property.location_name || property.title}</p>
                <p className="text-xs text-gray-500 z-10">{property.location_city || 'Metropolitan Area'}, {property.location_country || 'USA'}</p>
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#63c0ee_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Inquiry Form with Automated Email Notifications */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#161829]">Schedule a Viewing</h3>
                  <p className="text-xs text-gray-400">Direct broker consultation</p>
                </div>
                <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#63c0ee] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </span>
              </div>

              {inquirySuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-emerald-900 mb-1">Inquiry Dispatched!</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    A confirmation email has been sent to <strong>{formData.email}</strong>. Our designated luxury advisor will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setInquirySuccess(false)}
                    className="mt-4 text-xs font-semibold text-emerald-800 underline hover:no-underline cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {inquiryError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                      {inquiryError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="eleanor@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Message</label>
                    <textarea
                      rows="3"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="I am interested in scheduling a private tour..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full py-3 rounded-xl bg-[#63c0ee] hover:bg-[#52aada] active:bg-[#439acb] text-white font-semibold text-sm transition shadow-lg shadow-[#63c0ee]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submittingInquiry ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Viewing Inquiry</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    🔒 By clicking Send, your inquiry is dispatched to our brokerage and logged in MySQL with automated email notifications.
                  </p>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1 font-semibold text-gray-700">
                  <Phone className="w-3.5 h-3.5 text-[#63c0ee]" />
                  <span>+1 (800) 456-7890</span>
                </span>
                <span className="text-[11px] bg-gray-50 px-2 py-1 rounded-md">
                  Verified Brokerage
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
