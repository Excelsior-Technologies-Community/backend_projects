import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';

export default function BrandTicker() {
  const swiperRef = useRef(null);
  const brands = Array(12).fill('Investfunds');

  return (
    <section className="bg-white py-12 border-b border-gray-100 overflow-hidden relative group">
      <div className="container mx-auto px-10 flex items-center gap-6">

        {/* Left Manual Arrow */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-8 h-8 flex-shrink-0 bg-[#63c0ee] text-white rounded flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 ease-in-out cursor-pointer z-10 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={18} strokeWidth={3} />
        </button>

        {/* Manual Swiper */}
        <div className="w-full overflow-hidden">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={80}
            slidesPerView={'auto'}
            loop={true}
            grabCursor={true}
            className="w-full flex items-center"
          >
            {brands.map((brand, index) => (
              <SwiperSlide key={index} className="!w-auto">
                <div className="text-[#161829] font-extrabold text-[22px] tracking-tight select-none">
                  {brand}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Manual Arrow */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-8 h-8 flex-shrink-0 bg-[#63c0ee] text-white rounded flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 ease-in-out cursor-pointer z-10 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </section>
  );
}
