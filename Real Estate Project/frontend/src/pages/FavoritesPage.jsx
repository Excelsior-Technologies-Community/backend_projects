import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Bed, Bath, Square, MapPin } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export default function FavoritesPage() {
  const { wishlist, removeFromWishlist } = useCartWishlist();

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link to="/" className="hover:text-[#63c0ee] transition">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Saved Properties</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#161829] tracking-tight">
                My Saved Properties
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Your private watchlist of shortlisted residences and estates.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-[#63c0ee] border border-blue-100">
              {wishlist.length} Saved {wishlist.length === 1 ? 'Home' : 'Homes'}
            </span>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-xs max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Properties Yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              You haven't saved any estates to your favorites list. Browse our luxury portfolio and click the heart icon on any home to save it for later.
            </p>
            <Link
              to="/properties"
              className="px-6 py-3 rounded-xl bg-[#63c0ee] hover:bg-[#52aada] text-white font-semibold text-sm transition shadow-md shadow-[#63c0ee]/25 inline-flex items-center gap-2"
            >
              <span>Explore Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((prop) => (
              <div
                key={prop.id}
                className="group bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={prop.primary_image || prop.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                    alt={prop.title || prop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFromWishlist(prop.id)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center shadow-md transition cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-[#161829]">
                      ${Number(prop.price).toLocaleString()}
                    </span>
                    <Link to={`/property/${prop.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#63c0ee] transition mt-1 line-clamp-1">
                        {prop.title || prop.name}
                      </h3>
                    </Link>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-[#63c0ee]" />
                      <span>{prop.address || 'Beverly Hills, CA'}</span>
                    </p>
                  </div>

                  <Link
                    to={`/property/${prop.id}`}
                    className="mt-6 w-full py-2.5 rounded-xl bg-gray-50 hover:bg-[#63c0ee] text-gray-800 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-2"
                  >
                    <span>View Property Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
