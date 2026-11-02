import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <section className="bg-white pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Sky Blue Info Banner */}
          <div className="lg:col-span-5 bg-[#63c0ee] p-10 md:p-14 flex flex-col justify-center">
            <span className="text-[#161829] font-extrabold text-[13px] tracking-wider uppercase mb-3">
              Real Estate
            </span>
            <h2 className="text-[34px] md:text-[42px] font-extrabold leading-[1.1] tracking-tight">
              <span className="text-[#161829] block">Best instruments</span>
              <span className="text-white block">make cash</span>
            </h2>
          </div>

          {/* Right Column: Dark Subscription Box */}
          <div className="lg:col-span-7 bg-[#151926] p-10 md:p-14 flex items-center">
            {subscribed ? (
              <div className="text-emerald-400 font-semibold text-[15px] flex items-center gap-2">
                ✓ Thank you for subscribing to our newsletter!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row items-stretch sm:items-center border-b border-gray-600 pb-3 gap-4">
                <input 
                  type="email" 
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-white placeholder-gray-400 text-[14px] md:text-[15px] focus:outline-none flex-1 py-1 px-1"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-[#63c0ee] hover:bg-[#4eaade] text-white font-bold text-[13px] tracking-wide px-8 py-3 rounded transition-all whitespace-nowrap shadow-md hover:shadow-lg active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
