import React from 'react';
import { ArrowRightSquare, BarChart2, Info, Heart, ShoppingBag } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import customBanner from '../assets/custom-banner.jpg';
import thumbVilla from '../assets/cb1.png';
import thumbApartment from '../assets/cb2.png';

export default function ComfortLiving() {
  const { addToCart, isInWishlist, toggleWishlist } = useCartWishlist();
  const statCards = [
    {
      id: 1,
      image: thumbVilla,
      title: "Villa 45m2",
      market: "NASDAQ // USA",
      price: "$ 350,340",
      growth: "+ 14.3%"
    },
    {
      id: 2,
      image: thumbApartment,
      title: "Apartment 40m2",
      market: "US // New York City",
      price: "$ 30,643,00",
      growth: "+ 15.3%"
    }
  ];

  return (
    <section className="bg-white py-20 lg:py-24 border-b border-gray-100">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-md">
            <span className="font-extrabold text-[13px] text-[#161829] mb-3 tracking-wider uppercase block">
              Real Estate
            </span>
            <h2 className="text-[36px] md:text-[46px] font-extrabold text-[#161829] leading-[1.1] tracking-tight">
              Ample Room for <br />
              <span className="text-[#63c0ee]">Comfortable Living</span>
            </h2>
          </div>

          <p className="text-[14px] md:text-[15px] font-medium text-gray-500 leading-relaxed max-w-xl lg:mb-1">
            We believe in building long-term relationships with our clients, providing ongoing support and assistance even after you've settled into your new home. Our goal is to ensure that you are completely satisfied with your decision.
          </p>

          <button className="bg-[#63c0ee] hover:bg-[#4eaade] text-white font-bold text-[13px] tracking-wide px-7 py-3 rounded-md flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 self-start lg:self-end">
            Get Started <ArrowRightSquare size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Two-Column Feature Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Big Feature Image */}
          <div className="lg:col-span-6 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-100 aspect-4/3 lg:aspect-auto lg:h-[500px] group">
              <img 
                src={customBanner} 
                alt="Woman relaxing comfortably in modern room" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right: Text and Stat Cards */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="font-extrabold text-[13px] text-[#161829] mb-3 tracking-wider uppercase block">
              Real Estate
            </span>

            <h2 className="text-[34px] md:text-[42px] font-extrabold text-[#161829] leading-[1.15] mb-5 tracking-tight">
              Where Comfort and <br />
              <span className="text-[#63c0ee]">Style Meet</span>
            </h2>

            <p className="text-[14px] md:text-[15px] font-medium text-gray-500 leading-relaxed mb-8">
              homes that boast exceptional craftsmanship, quality finishes, and thoughtful design. From the moment you step into one of our properties, you'll appreciate the attention to detail, the inviting atmosphere, and the sense of comfort that each home exudes.
            </p>

            {/* Stat Property Cards */}
            <div className="flex flex-col gap-4 w-full mb-8">
              {statCards.map((card) => {
                const cardKey = `comfort-${card.id}`;
                const inWishlist = isInWishlist(cardKey);
                return (
                  <div 
                    key={card.id}
                    className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-xs hover:shadow-md transition-all duration-300 gap-3"
                  >
                    {/* Left: Thumbnail & Name */}
                    <div className="flex items-center gap-4">
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-100 shadow-2xs flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-[15px] font-bold text-[#161829]">
                          {card.title}
                        </h4>
                        <p className="text-[12px] font-medium text-gray-400">
                          {card.market}
                        </p>
                      </div>
                    </div>

                    {/* Right: Price, Growth Metric & Action Buttons */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-5">
                      <div className="flex items-center gap-3">
                        <span className="text-[16px] font-extrabold text-[#63c0ee]">
                          {card.price}
                        </span>

                        <div className="flex items-center gap-1 text-[13px] font-bold text-emerald-600">
                          <span>{card.growth}</span>
                          <Info size={13} className="text-gray-300" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={() => toggleWishlist({
                            id: cardKey,
                            name: card.title,
                            price: card.price,
                            image: card.image,
                            category: 'Comfort Living',
                            rating: 5
                          })}
                          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                            inWishlist
                              ? 'bg-rose-500 border-rose-500 text-white'
                              : 'border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-300'
                          }`}
                          title={inWishlist ? "In Wishlist (Click to remove)" : "Save to Wishlist"}
                        >
                          <Heart size={14} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2} />
                        </button>

                        {/* Reserve Button */}
                        <button
                          type="button"
                          onClick={() => addToCart({
                            id: cardKey,
                            name: card.title,
                            price: card.price,
                            image: card.image,
                            category: 'Comfort Living',
                            sqftOptions: ['45m2 Layout']
                          }, '45m2 Layout', 1, false)}
                          className="bg-[#161829] hover:bg-[#63c0ee] hover:text-[#161829] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          title="Reserve Unit"
                        >
                          <ShoppingBag size={12} />
                          <span>Reserve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <button className="bg-[#63c0ee] hover:bg-[#4eaade] text-white font-bold text-[13px] tracking-wide px-7 py-3 rounded-md flex items-center gap-2 transition-all shadow-sm">
              Get Started <ArrowRightSquare size={16} strokeWidth={2.5} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
