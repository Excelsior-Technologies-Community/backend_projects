import React from 'react';
import { ArrowRightSquare, MapPin, Square, Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useCartWishlist } from '../context/CartWishlistContext';
import 'swiper/css';

import cardImg1 from '../assets/banner-card1_6752b9a1-1a89-4fc7-81ce-f43cc05eea5e.png';
import cardImg2 from '../assets/banner-card2_c436bfab-fa3a-42a9-bd00-425e6978c299.png';
import cardImg3 from '../assets/banner-card1_08a7e141-2c15-4e05-98e7-18d0888fdf94.png';
import cardImg4 from '../assets/hero_house2.png';

export default function BestPlaces() {
  const { addToCart, isInWishlist, toggleWishlist } = useCartWishlist();

  const apartmentCards = [
    {
      id: 101,
      image: cardImg1,
      name: "Apartment 40m2 in the city center",
      type: "Apartment 40m2",
      title: "in the city center",
      location: "China, Beijing",
      area: "75 m2",
      price: "$589,711.35",
      priceBg: "bg-[#161829]",
      priceColor: "text-[#63c0ee]",
      description: "In this headline, the listing agent lets the buyer know where the property is and what makes it special in short order. A buyer who's looking for a brick ranch...",
      btnBg: "bg-[#161829]",
      btnText: "text-white"
    },
    {
      id: 102,
      image: cardImg2,
      name: "House 50m2 in the city center",
      type: "House 50m2",
      title: "in the city center",
      location: "Japan, Tokyo",
      area: "75 m2",
      price: "$700,320.10",
      priceBg: "bg-[#63c0ee]",
      priceColor: "text-[#161829]",
      description: "This headline tells the buyer not only that the neighborhood is sought after, but also that it's a two-story brick home, which will carry a proportional pric...",
      btnBg: "bg-[#63c0ee]",
      btnText: "text-[#161829]"
    },
    {
      id: 103,
      image: cardImg3,
      name: "Villa 45m2 in the city center",
      type: "Villa 45m2",
      title: "in the city center",
      location: "Australia, Sydney",
      area: "75 m2",
      price: "$658,511.20",
      priceBg: "bg-[#161829]",
      priceColor: "text-[#63c0ee]",
      description: "In this headline, the listing agent lets the buyer know where the property is and what makes it special in short order. A buyer who's looking for a brick ranch...",
      btnBg: "bg-[#161829]",
      btnText: "text-white"
    },
    {
      id: 104,
      image: cardImg4,
      name: "Penthouse 60m2 in the city center",
      type: "Penthouse 60m2",
      title: "in the city center",
      location: "UK, London",
      area: "85 m2",
      price: "$820,000.00",
      priceBg: "bg-[#63c0ee]",
      priceColor: "text-[#161829]",
      description: "Step into an elevated luxury experience with breathtaking views, bespoke architectural finishes, and an unmatched urban lifestyle in London...",
      btnBg: "bg-[#63c0ee]",
      btnText: "text-[#161829]"
    }
  ];

  return (
    <section className="bg-white py-20 lg:py-24 border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Column: Heading & Text */}
        <div className="w-full lg:w-4/12 flex flex-col items-start pr-0 lg:pr-6">
          <span className="font-extrabold text-[13px] text-[#161829] mb-4 tracking-wider uppercase">
            Real Estate
          </span>

          <h2 className="text-[38px] md:text-[46px] font-extrabold text-[#161829] leading-[1.1] mb-6 tracking-tight">
            Best places <br />
            to <span className="text-[#63c0ee]">make invest</span>
          </h2>

          <p className="text-[14px] md:text-[15px] font-medium text-gray-500 leading-relaxed mb-8">
            Focus on two things in your real estate property description location and something unique about the house. If you're having a hard time getting started, let our collection inspire you.
          </p>

          <button className="bg-[#161829] hover:bg-opacity-90 text-white font-bold text-[13px] tracking-wide px-8 py-3.5 rounded flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
            Get Started <ArrowRightSquare size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Right Column: Swiper Carousel of Apartment Cards */}
        <div className="w-full lg:w-8/12">
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              1024: { slidesPerView: 2.2 }
            }}
            grabCursor={true}
            className="w-full"
          >
            {apartmentCards.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                  
                  {/* Top Image Box with Case Study badge & Wishlist Heart */}
                  <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                    <span className="absolute top-4 left-4 bg-black/40 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full z-10 flex items-center gap-1">
                      Case Study »
                    </span>

                    {/* Wishlist Heart */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          category: 'Best Places',
                          rating: 5
                        });
                      }}
                      className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                        isInWishlist(item.id)
                          ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                          : 'bg-white/80 hover:bg-white text-gray-700'
                      }`}
                      aria-label="Save to wishlist"
                      title={isInWishlist(item.id) ? "In Wishlist (Click to remove)" : "Save to Wishlist"}
                    >
                      <Heart size={14} fill={isInWishlist(item.id) ? 'currentColor' : 'none'} strokeWidth={2.5} />
                    </button>

                    <img 
                      src={item.image} 
                      alt={item.type} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Dark Card Overlay at bottom of Image */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#161829] via-[#161829]/90 to-transparent p-5 text-white">
                      <h4 className="text-[18px] font-bold leading-snug">
                        {item.type} <br />
                        <span className="font-medium text-[15px] text-gray-200">{item.title}</span>
                      </h4>

                      <div className="flex items-center gap-4 text-[12px] text-gray-300 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-[#63c0ee]" /> {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Square size={13} className="text-[#63c0ee]" /> {item.area}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Banner */}
                  <div className={`${item.priceBg} px-5 py-3 flex items-center justify-between`}>
                    <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wide">
                      Sale Price:
                    </span>
                    <span className={`text-[17px] font-extrabold ${item.priceColor}`}>
                      {item.price}
                    </span>
                  </div>

                  {/* Body Text & Button */}
                  <div className="p-5 flex flex-col flex-1 bg-white">
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-6 flex-1 line-clamp-3">
                      {item.description}
                    </p>

                    <button 
                      type="button"
                      onClick={() => addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        category: 'Best Places',
                        sqftOptions: [item.area]
                      }, item.area, 1, false)}
                      className={`${item.btnBg} ${item.btnText} font-bold text-[13px] tracking-wide px-6 py-2.5 rounded flex items-center justify-center gap-2 transition-all w-fit hover:opacity-90 shadow-xs cursor-pointer`}
                    >
                      Reserve Unit <ArrowRightSquare size={15} strokeWidth={2.5} />
                    </button>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
