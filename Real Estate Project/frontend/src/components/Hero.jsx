import React, { useState } from 'react';
import { MapPin, Square, ChevronLeft, ChevronRight, CornerRightUp, Building2, Heart, ShoppingBag } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useCartWishlist } from '../context/CartWishlistContext';
import homeBanner from '../assets/home-banner.jpg';
import cardImg1 from '../assets/banner-card1_6752b9a1-1a89-4fc7-81ce-f43cc05eea5e.png';
import cardImg2 from '../assets/banner-card2_c436bfab-fa3a-42a9-bd00-425e6978c299.png';
import cardImg3 from '../assets/banner-card1_08a7e141-2c15-4e05-98e7-18d0888fdf94.png';
import cardImg4 from '../assets/hero_house2.png';

export default function Hero() {
  const [cardSwiper, setCardSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCart, isInWishlist, toggleWishlist } = useCartWishlist();

  const heroContent = [
    {
      id: 1,
      topTitle: 'Real Estate',
      bottomText: 'to make ',
      highlightText: 'invest',
      description: 'meticulously designed home that seamlessly combines modern elegance with ultimate comfort. Step into a world of luxurious living, where every detail has been carefully crafted to create an oasis of serenity.'
    },
    {
      id: 2,
      topTitle: 'Welcome to Your',
      bottomText: '',
      highlightText: 'Dream Home',
      description: 'This magnificent residence boasts an open-concept layout, allowing for seamless flow and an abundance of natural light. The spacious living area features soaring ceilings and large windows that offer breathtaking.'
    },
    {
      id: 3,
      topTitle: 'Luxury Living',
      bottomText: 'at ',
      highlightText: 'Its Finest',
      description: 'A picture is worth a thousand words, but the challenge for real estate agents is to write a listing description that entices the buyer into clicking through the home\'s online picture gallery.'
    }
  ];

  const cards = [
    {
      id: 1,
      type: 'House 60m2',
      title: 'in the city center',
      location: 'Warsaw, Poland',
      area: '80 m2',
      price: '$682,645',
      image: cardImg1,
      bottomColor: 'bg-[#161829]',
      textColor: 'text-white',
      priceColor: 'text-primary'
    },
    {
      id: 2,
      type: 'Apartment 40m2',
      title: 'in the city center',
      location: 'France, Paris',
      area: '75 m2',
      price: '$589,711.35',
      image: cardImg2,
      bottomColor: 'bg-[#161829]',
      textColor: 'text-white',
      priceColor: 'text-primary'
    },
    {
      id: 3,
      type: 'Modern Villa',
      title: 'near the beach',
      location: 'Miami, USA',
      area: '150 m2',
      price: '$1,450,000',
      image: cardImg3,
      bottomColor: 'bg-[#161829]',
      textColor: 'text-white',
      priceColor: 'text-primary'
    },
    // {
    //   id: 4,
    //   type: 'Penthouse suite',
    //   title: 'uptown view',
    //   location: 'London, UK',
    //   area: '120 m2',
    //   price: '$2,100,500',
    //   image: cardImg4,
    //   bottomColor: 'bg-[#161829]',
    //   textColor: 'text-white',
    //   priceColor: 'text-primary'
    // }
  ];

  const handlePrev = () => {
    cardSwiper?.slidePrev();
  };

  const handleNext = () => {
    cardSwiper?.slideNext();
  };

  return (
    <>
      <section
        className="relative overflow-hidden min-h-[550px] flex flex-col justify-center py-12"
        style={{ backgroundImage: `url(${homeBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >

        {/* Floating Building Icon Widget (Top Right) */}
        {/* <div className="absolute top-16 right-32 bg-white rounded-full p-4 shadow-lg z-20">
          <Building2 size={24} className="text-primaryText" />
        </div> */}

        <div className="container mx-auto px-10 relative z-10 flex flex-col lg:flex-row items-center gap-10">
          {/* Left Content - Custom Synchronized React Fade */}
          <div className="w-full lg:w-6/12 pt-5 flex flex-col justify-start min-h-[350px]">
            <span className="font-bold text-md text-primaryText mb-4 block tracking-wide">Investfunds</span>

            <div className="mb-5 w-full relative min-h-[250px]">
              {heroContent.map((content, idx) => (
                <div
                  key={content.id}
                  className={`absolute top-0 left-0 w-full transition-opacity duration-700 ease-in-out ${activeIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                >
                  <h1 className="text-[64px] font-bold text-primaryText leading-[1.1] mb-6 select-none">
                    {content.topTitle} <br />
                    {content.bottomText}
                    <span className="relative inline-block ml-3">
                      {content.highlightText}
                      <span className="absolute left-0 bottom-1 w-[120%] h-3 bg-white -z-10"></span>
                    </span>
                  </h1>
                  <p className="text-[15px] font-medium text-primaryText/90 max-w-[90%] leading-relaxed select-none">
                    {content.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <button className="bg-white text-primaryText px-6 py-3.5 rounded-md font-semibold text-sm flex items-center gap-3 hover:opacity-90 transition-opacity">
                  Get Started <CornerRightUp size={16} />
                </button>
                <a href="#" className="text-white hover:text-white/80 font-bold text-sm transition-colors cursor-pointer">
                  Get more informations
                </a>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handlePrev} className="w-10 h-10 border border-white/50 rounded-md flex items-center justify-center text-white hover:bg-white hover:text-primaryText transition-colors z-10">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNext} className="w-10 h-10 border border-white/50 rounded-md flex items-center justify-center text-white hover:bg-white hover:text-primaryText transition-colors z-10">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Infinite Swiper Slider */}
          <div className="w-full lg:w-6/12 mt-10 lg:mt-0 pb-10 overflow-hidden relative">
            <Swiper
              onSwiper={setCardSwiper}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex % heroContent.length)}
              spaceBetween={24}
              slidesPerView={2}
              loop={true}
              grabCursor={true}
              className="w-full !px-4 !py-6"
            >
              {cards.map((card) => (
                <SwiperSlide key={card.id}>
                  <div className="w-full flex flex-col group h-full select-none">
                    {/* Card Image Area */}
                    <div className="relative h-[300px] w-full rounded-t-2xl overflow-hidden">
                      <img src={card.image} alt={card.type} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/40"></div>

                      {/* Top Case Study */}
                      <div className="absolute top-5 left-5 z-10">
                        <span className="text-white text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer">
                          Case Study <span className="text-[10px]">»</span>
                        </span>
                      </div>

                      {/* Wishlist Heart */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist({
                            id: `hero-${card.id}`,
                            name: `${card.type} - ${card.title}`,
                            price: card.price,
                            image: card.image,
                            category: 'Hero Showcase',
                            rating: 5
                          });
                        }}
                        className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                          isInWishlist(`hero-${card.id}`)
                            ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                            : 'bg-white/80 hover:bg-white text-gray-700'
                        }`}
                        aria-label="Save to wishlist"
                        title={isInWishlist(`hero-${card.id}`) ? "In Wishlist (Click to remove)" : "Save to Wishlist"}
                      >
                        <Heart size={14} fill={isInWishlist(`hero-${card.id}`) ? 'currentColor' : 'none'} strokeWidth={2.5} />
                      </button>

                      {/* Bottom Info inside image */}
                      <div className="absolute bottom-5 left-5 right-5 text-white">
                        <h3 className="text-[22px] font-bold leading-tight mb-2">
                          {card.type} <br /> {card.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1.5 font-medium"><MapPin size={14} /> {card.location}</span>
                          <span className="flex items-center gap-1.5 font-medium"><Square size={14} /> {card.area}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Price Area & Reserve Button */}
                    <div className={`${card.bottomColor} ${card.textColor} p-5 rounded-b-2xl shadow-lg transition-colors duration-400 group-hover:bg-primary group-hover:text-primaryText flex items-center justify-between gap-3`}>
                      <div>
                        <div className="text-xs font-medium mb-0.5 opacity-90 transition-opacity">Sale Price:</div>
                        <div className={`${card.priceColor} text-[20px] font-bold transition-colors duration-400 group-hover:text-primaryText`}>{card.price}</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: `hero-${card.id}`,
                            name: `${card.type} - ${card.title}`,
                            price: card.price,
                            image: card.image,
                            category: 'Hero Showcase',
                            sqftOptions: [card.area]
                          }, card.area, 1, false);
                        }}
                        className="bg-white hover:bg-[#161829] text-[#161829] hover:text-white px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer flex-shrink-0"
                      >
                        <ShoppingBag size={13} />
                        <span>Reserve</span>
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}
