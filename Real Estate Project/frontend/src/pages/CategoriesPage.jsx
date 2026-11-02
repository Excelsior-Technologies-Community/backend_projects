import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tags } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#63c0ee] text-xs font-bold uppercase tracking-wider mb-3">
            <Tags className="w-3.5 h-3.5" />
            <span>Property Portfolios</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#161829] tracking-tight">
            Browse By Category
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Explore diverse architectural forms, from standalone luxury villas to high-rise city lofts and private country estates.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/properties?categoryId=${cat.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="bg-[#63c0ee] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 inline-block">
                      {cat.property_count || 0} Properties
                    </span>
                    <h3 className="text-xl font-bold">{cat.name}</h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-xs leading-relaxed text-gray-500 line-clamp-2">
                    {cat.description || 'Explore premier listings available in this category with bespoke interior design.'}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#63c0ee] group-hover:translate-x-1 transition-transform">
                    <span>View Category Listings</span>
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
