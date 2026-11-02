import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import 'swiper/css';
import johnDoe from '../assets/john-doe.png';

export default function Testimonials() {
  const swiperRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      rating: '4.5',
      text: "The support we received from the team throughout the buying process was exceptional. We're extremely satisfied.",
      author: "Jessica",
      company: "Company Ltd.",
      avatar: johnDoe
    },
    {
      id: 2,
      rating: '4.5',
      text: "The neighborhood is peaceful, and the sense of community is something I value deeply. It's truly a wonderful area.",
      author: "Jennifer",
      company: "Company Ltd.",
      avatar: johnDoe
    },
    {
      id: 3,
      rating: '4.5',
      text: "Proud homeowner and mother of two, Emily Johnson is a successful businesswoman who values a strong, vibrant community.",
      author: "Emily",
      company: "Company Ltd.",
      avatar: johnDoe
    },
    {
      id: 4,
      rating: '4.5',
      text: "Living in this community has been an absolute pleasure. The amenities are top-notch, and the sense of security is great.",
      author: "Johnson",
      company: "Company Ltd.",
      avatar: johnDoe
    },
    {
      id: 5,
      rating: '5.0',
      text: "Absolutely stunning architecture and a wonderfully managed property. I could not have asked for a better experience.",
      author: "Sarah",
      company: "Real Estate Co.",
      avatar: johnDoe
    }
  ];

  // Helper to render stars based on rating (4.5 renders 4 blue, 1 gray)
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          className={i <= Math.floor(parseFloat(rating)) ? "text-[#63c0ee] fill-[#63c0ee]" : "text-gray-300 fill-gray-300"}
        />
      );
    }
    return stars;
  };

  return (
    <section className="bg-white py-16 border-b border-gray-100 overflow-hidden relative group">
      <div className="container mx-auto px-10 flex items-center gap-6 relative">
        
        {/* Left Manual Arrow (Visible only on hover) */}
        <button 
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex-shrink-0 bg-[#63c0ee] text-white rounded flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 ease-in-out cursor-pointer z-20 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>

        {/* Manual Swiper */}
        <div className="w-full">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={0}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            loop={true}
            grabCursor={true}
            className="w-full border-t border-b border-l border-gray-100"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <div className="flex flex-col h-full bg-white p-6 border-r border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  
                  {/* Top Header: Rating & Quote */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-extrabold text-[#161829]">{item.rating}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#161829] mb-1">Rating / 5.0</span>
                        <div className="flex items-center gap-0.5">
                          {renderStars(item.rating)}
                        </div>
                      </div>
                    </div>
                    <Quote className="text-[#63c0ee]" size={28} fill="#63c0ee" fillOpacity={0.2} strokeWidth={1} />
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-sm font-medium text-[#161829]/80 leading-relaxed mb-6 flex-grow line-clamp-4">
                    {item.text}
                  </p>

                  {/* Author Information */}
                  <div className="flex items-center gap-2 mt-auto">
                    <img src={item.avatar} alt={item.author} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                    <span className="text-xs font-bold text-[#161829]">{item.author}</span>
                    <span className="text-xs font-medium text-gray-500">// {item.company}</span>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Manual Arrow (Visible only on hover) */}
        <button 
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex-shrink-0 bg-[#63c0ee] text-white rounded flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 ease-in-out cursor-pointer z-20 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>

      </div>
    </section>
  );
}
