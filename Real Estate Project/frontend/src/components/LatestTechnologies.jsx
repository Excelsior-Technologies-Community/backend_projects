import React from 'react';
import { ArrowRightSquare, MapPin, Square } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import imgParkView from '../assets/image_8.png';
import imgHarborGate from '../assets/image_10.png';
import imgResidences from '../assets/image_11.png';
import imgApartment from '../assets/image_7.png';
import imgSunPlaza from '../assets/image_9.png';
import imgIvyHouse from '../assets/banner-card1_6752b9a1-1a89-4fc7-81ce-f43cc05eea5e.png';

export default function LatestTechnologies() {
  const propertyCards = [
    {
      id: 1,
      image: imgParkView,
      type: "Park View 44m2",
      title: "in the city center",
      location: "Arabia, Riyadh",
      area: "80 m2",
      price: "$500.84"
    },
    {
      id: 2,
      image: imgHarborGate,
      type: "Harbor Gate 40m2",
      title: "in the city center",
      location: "Germany, Berlin",
      area: "85 m2",
      price: "$685.45"
    },
    {
      id: 3,
      image: imgResidences,
      type: "Residences 30m2",
      title: "in the city center",
      location: "UK, London",
      area: "75 m2",
      price: "$650.46"
    },
    {
      id: 4,
      image: imgApartment,
      type: "Apartment 40m2",
      title: "in the city center",
      location: "Russia, Moscow",
      area: "75 m2",
      price: "$589,711.35"
    },
    {
      id: 5,
      image: imgSunPlaza,
      type: "Sun Plaza 20m2",
      title: "in the city center",
      location: "Emirates, Dubai",
      area: "75 m2",
      price: "$400.11"
    },
    {
      id: 6,
      image: imgIvyHouse,
      type: "Ivy House 44m2",
      title: "in the city center",
      location: "Korea, Seoul",
      area: "70 m2",
      price: "$889,620.00"
    }
  ];

  return (
    <section className="bg-white py-20 lg:py-24 border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="font-extrabold text-[13px] text-[#161829] mb-3 tracking-wider uppercase block">
              Real Estate
            </span>
            <h2 className="text-[34px] md:text-[44px] font-extrabold text-[#161829] leading-tight tracking-tight">
              The Latest Technologies
            </h2>
          </div>

          <p className="text-[14px] md:text-[15px] font-medium text-gray-500 leading-relaxed max-w-lg lg:mb-1">
            home also offers a range of desirable features, such as a dedicated home office for remote work, a media room for entertainment, and a three-car garage for convenience.
          </p>

          <button className="bg-[#63c0ee] hover:bg-[#4eaade] text-[#161829] font-bold text-[13px] tracking-wide px-7 py-3 rounded-md flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 self-start lg:self-end">
            Show More <ArrowRightSquare size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Carousel of Property Cards */}
        <Swiper
          spaceBetween={24}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.2 }
          }}
          grabCursor={true}
          className="w-full !overflow-visible"
        >
          {propertyCards.map((item) => (
            <SwiperSlide key={item.id} className="h-auto">
              <div className="flex flex-col bg-[#161829] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1.5 border border-gray-100/10">
                
                {/* Image Container with Badges and Overlay */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-gray-900">
                  <span className="absolute top-4 left-4 bg-black/45 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full z-10 flex items-center gap-1">
                    Case Study »
                  </span>

                  <img 
                    src={item.image} 
                    alt={item.type} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay at Bottom of Image */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#161829] via-[#161829]/85 to-transparent p-5 text-white">
                    <h4 className="text-[17px] font-bold leading-snug">
                      {item.type} <br />
                      <span className="font-normal text-[14px] text-gray-200">{item.title}</span>
                    </h4>

                    <div className="flex items-center gap-4 text-[12px] text-gray-300 mt-3 pt-1 border-t border-white/10">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin size={13} className="text-[#63c0ee]" /> {item.location}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Square size={13} className="text-[#63c0ee]" /> {item.area}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Sale Price Bar */}
                <div className="bg-[#161829] px-5 py-3.5 flex items-center justify-between border-t border-white/10">
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                    Sale Price:
                  </span>
                  <span className="text-[16px] font-extrabold text-[#63c0ee]">
                    {item.price}
                  </span>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
