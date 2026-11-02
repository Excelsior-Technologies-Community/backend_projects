import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#63c0ee] text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Prime Destinations</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#161829] tracking-tight">
            Explore Prime Locations
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Browse coveted properties situated in the most sought-after metropolitan hubs and coastal enclaves.
          </p>
        </div>

        {/* Locations Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading locations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((loc) => (
              <Link
                key={loc.id}
                to={`/properties?locationId=${loc.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={loc.image || 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=800&q=80'}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="bg-[#63c0ee] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 inline-block">
                      {loc.property_count || 0} Listings
                    </span>
                    <h3 className="text-xl font-bold">{loc.name}</h3>
                    <p className="text-xs text-gray-200 mt-0.5">{loc.city}, {loc.country || 'USA'}</p>
                  </div>
                </div>

                <div className="p-5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    Explore neighborhood residences
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#63c0ee] group-hover:translate-x-1 transition-transform">
                    <span>View Properties</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
