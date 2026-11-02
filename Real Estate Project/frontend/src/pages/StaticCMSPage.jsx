import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, Shield } from 'lucide-react';

export default function StaticCMSPage({ pageKey: propPageKey }) {
  const location = useLocation();
  const slug = propPageKey || (location.pathname.replace('/', '') || 'terms');
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/cms/${slug}`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#63c0ee] text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Documentation</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#161829] tracking-tight">
            {data?.title || (slug === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions')}
          </h1>
          <p className="text-xs text-gray-400 mt-2">
            Last Updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'October 2026'}
          </p>
        </div>

        <div className="p-8 md:p-12 rounded-3xl bg-gray-50/60 border border-gray-100 shadow-xs">
          <div className="prose max-w-none text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {data?.content || `
            Welcome to Realestate WorkDo. By accessing and using our luxury property discovery platform, you consent to our terms of service, acceptable usage guidelines, and privacy practices.
            
            1. Property Information & Availability
            All property listings, architectural renderings, square footages, bedroom counts, and asking prices are subject to prior sale, lease, withdrawal, or error. 
            
            2. Confidentiality & Privacy
            We value your personal privacy. Inquiries submitted through our forms are used exclusively to coordinate property showings with certified broker partners and will never be distributed to unauthorized third parties.
            
            3. Copyright & Intellectual Property
            All imagery, floorplans, photography, and branding assets featured on Realestate WorkDo are protected under international copyright law.
            `}
          </div>
        </div>
      </div>
    </div>
  );
}
