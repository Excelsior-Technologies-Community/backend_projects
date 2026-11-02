import React from 'react';
import { ArrowRightSquare, BarChart2, Info, Heart, ShoppingBag } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import cb1 from '../assets/cb1.png';
import cb2 from '../assets/cb2.png';

export default function InvestFund() {
  const { addToCart, isInWishlist, toggleWishlist } = useCartWishlist();
  const funds = [
    {
      id: 1,
      title: "Villa40m2",
      location: "Italy // Rome",
      price: "$ 40,500,00",
      percent: "+ 14.3%",
      image: cb1
    },
    {
      id: 2,
      title: "House 40m2",
      location: "Spain // Madrid",
      price: "$ 45,443,00",
      percent: "+ 11.5%",
      image: cb1
    },
    {
      id: 3,
      title: "Apartment 40m2",
      location: "Canada // Toronto",
      price: "$ 30,643,00",
      percent: "+ 15.3%",
      image: cb2
    }
  ];

  return (
    <section className="bg-white py-24 border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start">
          <span className="font-bold text-sm text-[#161829] mb-4 block tracking-wide">Investfunds</span>
          
          <h2 className="text-[52px] font-bold text-[#161829] leading-[1.1] mb-6 tracking-tight">
            Invest Fund <br />
            to <span className="text-[#63c0ee]">make cash</span>
          </h2>
          
          <p className="text-[15px] font-medium text-gray-500 leading-relaxed mb-10 max-w-[90%]">
            As you step inside, you are greeted by an open and inviting floor plan 
            filled with natural light. The spacious living room features elegant 
            hardwood floors, a cozy fireplace, and large windows that frame 
            picturesque views of the surrounding landscape.
          </p>
          
          <button className="bg-[#63c0ee] text-[#161829] hover:bg-opacity-90 font-bold text-sm px-6 py-3.5 rounded flex items-center justify-center gap-2 transition-all shadow-sm">
            Get Started <ArrowRightSquare size={16} strokeWidth={2.5} className="ml-1" />
          </button>
        </div>

        {/* Right Content - Interactive Fund Cards */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 p-4">
          {funds.map((fund) => {
            const fundKey = `fund-${fund.id}`;
            const inWishlist = isInWishlist(fundKey);
            return (
              <div 
                key={fund.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:pr-6 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ease-in-out hover:bg-[#63c0ee] hover:-translate-x-3 hover:shadow-2xl gap-4 sm:gap-2"
              >
                {/* Image & Title/Location */}
                <div className="flex items-center gap-4">
                  <img 
                    src={fund.image} 
                    alt={fund.title} 
                    className="w-16 h-16 rounded-xl object-cover shadow-sm flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[17px] font-bold text-[#161829] group-hover:text-white transition-colors duration-300 truncate">
                      {fund.title}
                    </span>
                    <span className="text-[13px] font-medium text-gray-500 group-hover:text-white/90 transition-colors duration-300">
                      {fund.location}
                    </span>
                  </div>
                </div>

                {/* Price, Metric & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div className="flex flex-col items-start sm:items-end">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[16px] text-[#63c0ee] group-hover:text-white transition-colors duration-300">
                        {fund.price}
                      </span>
                      <BarChart2 size={16} strokeWidth={2} className="text-[#161829] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex items-center gap-1 text-[12px] font-bold text-emerald-600 group-hover:text-white/95 transition-colors duration-300">
                      <span>{fund.percent}</span>
                      <Info size={12} strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist({
                          id: fundKey,
                          name: `Fund - ${fund.title}`,
                          price: fund.price,
                          image: fund.image,
                          category: 'Investment Fund',
                          rating: 5
                        });
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                        inWishlist
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-100 group-hover:bg-white text-gray-700 hover:text-rose-500'
                      }`}
                      title={inWishlist ? "In Wishlist (Click to remove)" : "Save Fund to Wishlist"}
                    >
                      <Heart size={14} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2.5} />
                    </button>

                    {/* Add to Cart / Invest Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: fundKey,
                          name: `Fund - ${fund.title}`,
                          price: fund.price,
                          image: fund.image,
                          category: 'Investment Fund',
                          sqftOptions: ['Standard Share']
                        }, 'Standard Share', 1, false);
                      }}
                      className="bg-[#161829] group-hover:bg-white group-hover:text-[#161829] text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      title="Invest in this Fund"
                    >
                      <ShoppingBag size={12} />
                      <span>Invest</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
