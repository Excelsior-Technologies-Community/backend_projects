import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Users, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const [cms, setCms] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/cms/about')
      .then(res => res.json())
      .then(data => setCms(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 text-[#63c0ee] text-xs font-bold uppercase tracking-wider mb-3">
            Our Story & Heritage
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#161829] tracking-tight">
            {cms?.title || 'About Realestate WorkDo'}
          </h1>
          <p className="text-base text-gray-500 mt-4 leading-relaxed">
            {cms?.content || 'Pioneering digital real estate excellence and connecting discerning buyers with the finest residential properties worldwide.'}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="p-8 rounded-3xl bg-gray-50/70 border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#63c0ee]/15 text-[#63c0ee] flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Curated Portfolio</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every home in our catalog undergoes rigorous architectural verification and luxury specification auditing.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gray-50/70 border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#63c0ee]/15 text-[#63c0ee] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Private Escrow</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Confidential, white-glove closing processes overseen by licensed real estate attorneys and advisors.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gray-50/70 border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#63c0ee]/15 text-[#63c0ee] flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Global Advisory</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Multi-lingual property specialists offering virtual 3D walkthroughs and private flight arrangements for viewings.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-10 md:p-14 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to explore premier properties?</h2>
            <p className="text-slate-300 text-sm">Schedule a consultation with our real estate directors today.</p>
          </div>
          <Link
            to="/properties"
            className="px-6 py-3 rounded-xl bg-[#63c0ee] hover:bg-[#52aada] text-white font-semibold text-sm transition shadow-md shadow-[#63c0ee]/30 whitespace-nowrap"
          >
            Explore Listings
          </Link>
        </div>

      </div>
    </div>
  );
}
