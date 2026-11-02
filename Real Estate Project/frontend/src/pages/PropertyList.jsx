import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, MapPin, Bed, Bath, Square, 
  Heart, ArrowRight, Eye, Check, X, Filter 
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export default function PropertyList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleWishlist, isInWishlist } = useCartWishlist();

  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('locationId') || '');
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || '');
  const [sort, setSort] = useState('featured');
  const [priceMax, setPriceMax] = useState('');

  // Fetch properties and taxonomies
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (selectedLocation) params.append('locationId', selectedLocation);
      if (purpose) params.append('purpose', purpose);
      if (sort) params.append('sort', sort);
      if (priceMax) params.append('maxPrice', priceMax);

      const res = await fetch(`http://localhost:5000/api/properties?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || data || []);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedCategory, selectedLocation, purpose, sort]);

  useEffect(() => {
    // Fetch categories & locations for filter dropdowns
    fetch('http://localhost:5000/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d || []))
      .catch(console.error);

    fetch('http://localhost:5000/api/locations')
      .then(r => r.json())
      .then(d => setLocations(d || []))
      .catch(console.error);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedLocation('');
    setPurpose('');
    setSort('featured');
    setPriceMax('');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link to="/" className="hover:text-[#63c0ee] transition">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Properties</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#161829] tracking-tight">
            Explore Luxury Properties
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover architectural masterpieces, penthouses, and private estates.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative lg:col-span-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, street, or city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee] focus:border-transparent transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Category Select */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee] text-gray-700 cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Location Select */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee] text-gray-700 cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.city})</option>
                ))}
              </select>
            </div>

            {/* Purpose Select */}
            <div>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee] text-gray-700 cursor-pointer"
              >
                <option value="">All Purposes</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>

          </div>

          {/* Active Filter Chips & Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-hidden"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              {(search || selectedCategory || selectedLocation || purpose) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold ml-2 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <span className="text-xs font-semibold text-gray-500">
              Showing <strong>{properties.length}</strong> available properties
            </span>
          </div>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#63c0ee] border-t-transparent" />
            <p className="text-sm text-gray-400 mt-3">Loading luxury listings...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-xs">
            <h3 className="text-lg font-bold text-gray-800 mb-2">No matching properties found</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any listings matching your current filter criteria. Try adjusting your search keywords or resetting your filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-[#63c0ee] hover:bg-[#52aada] text-white font-semibold text-sm rounded-xl transition cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => {
              const favorited = isInWishlist(prop.id);
              return (
                <div
                  key={prop.id}
                  className="group bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                    <img
                      src={prop.primary_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-[#161829]/80 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {prop.purpose}
                      </span>
                      {prop.category_name && (
                        <span className="bg-[#63c0ee] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                          {prop.category_name}
                        </span>
                      )}
                    </div>

                    {/* Heart button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(prop)}
                      className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition shadow-md cursor-pointer ${
                        favorited
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/80 backdrop-blur-xs text-gray-700 hover:bg-white hover:text-rose-500'
                      }`}
                      title={favorited ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Price */}
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-2xl font-extrabold text-[#161829]">
                          ${Number(prop.price).toLocaleString()}
                        </span>
                        {prop.purpose === 'For Rent' && (
                          <span className="text-xs text-gray-400 font-semibold">/ month</span>
                        )}
                      </div>

                      {/* Title */}
                      <Link to={`/property/${prop.id}`}>
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#63c0ee] transition line-clamp-1">
                          {prop.title}
                        </h2>
                      </Link>

                      {/* Address */}
                      <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#63c0ee]" />
                        <span>{prop.address || `${prop.location_city || 'Prime'}, US`}</span>
                      </p>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 py-4 mt-4 border-y border-gray-100 text-center">
                        <div className="flex flex-col items-center">
                          <span className="flex items-center gap-1 text-xs font-bold text-gray-800">
                            <Bed className="w-3.5 h-3.5 text-gray-400" />
                            {prop.bedrooms || 3}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">Beds</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-gray-100">
                          <span className="flex items-center gap-1 text-xs font-bold text-gray-800">
                            <Bath className="w-3.5 h-3.5 text-gray-400" />
                            {prop.bathrooms || 2}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">Baths</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="flex items-center gap-1 text-xs font-bold text-gray-800">
                            <Square className="w-3.5 h-3.5 text-gray-400" />
                            {prop.areaSqFt || 1800}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">Sq Ft</span>
                        </div>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <Link
                      to={`/property/${prop.id}`}
                      className="mt-5 w-full py-2.5 rounded-xl bg-gray-50 hover:bg-[#63c0ee] text-gray-800 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-2"
                    >
                      <span>View Full Property Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
