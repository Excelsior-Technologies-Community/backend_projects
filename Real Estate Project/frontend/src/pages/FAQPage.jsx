import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultFaqs = [
  {
    q: 'How do I schedule an in-person viewing of a luxury estate?',
    a: 'You can submit a viewing request directly on any property detail page using the inquiry form, or call our concierge desk at +1 (800) 456-7890. A licensed advisor will arrange a private tour, chauffeur, or virtual 3D session according to your schedule.'
  },
  {
    q: 'Can international buyers purchase property through Realestate WorkDo?',
    a: 'Yes. A substantial portion of our clientele are international buyers and family offices. We handle cross-border financial compliance, FIRPTA guidelines in the US, and coordinate with specialized escrow agents to make foreign acquisition effortless.'
  },
  {
    q: 'What is the verification process for listed properties?',
    a: 'Every property featured on our platform must pass title verification, architectural inspection, and independent valuation appraisals before listing approval by our editorial board.'
  },
  {
    q: 'How does the automated email notification service work?',
    a: 'Whenever you submit an inquiry, an instant confirmation detailing the property is delivered to your email, and our broker management desk is notified immediately to ensure a rapid response time.'
  },
  {
    q: 'Are your listed prices negotiable?',
    a: 'While our properties reflect current market evaluations, formal offers can be submitted directly through our advisors. We facilitate confidential negotiations between buyers and sellers.'
  }
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50/50 py-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#63c0ee] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Guidance</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#161829] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Everything you need to know about purchasing, listing, and touring properties on Realestate WorkDo.
          </p>
        </div>

        <div className="space-y-4">
          {defaultFaqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-gray-900 text-sm md:text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-[#63c0ee]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-white border border-gray-100 text-center shadow-xs">
          <h3 className="font-bold text-gray-900 text-base mb-1">Still have questions?</h3>
          <p className="text-xs text-gray-500 mb-4">Our dedicated concierge team is on standby to assist with your specific inquiries.</p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-[#63c0ee] hover:bg-[#52aada] text-white text-xs font-semibold shadow-md transition"
          >
            Contact Customer Support
          </Link>
        </div>

      </div>
    </div>
  );
}
