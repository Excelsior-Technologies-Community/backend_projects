import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight, Heart, RefreshCw, Eye, ChevronDown, Star, Check } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import 'swiper/css';

import p1_img1 from '../assets/1_3704aed9-4ae6-414a-b0ed-95ec47e19a0b_600x600.png';
import p1_img2 from '../assets/2_55c53266-a706-4d1e-b78d-388963ee22de_600x600.png';
import p2_img1 from '../assets/1_600x600.png';
import p2_img2 from '../assets/2_600x600.png';
import p3_img1 from '../assets/1_2366d2e8-e3d8-40cd-b6c9-c6a92538670e_600x600.png';
import p3_img2 from '../assets/2_053b13a7-daa5-49c6-8a89-cbae65aea382_600x600.png';
import p4_img1 from '../assets/1_37a9cf7c-0609-4e7a-9358-c00ba0bb57e7_600x600.png';
import p4_img2 from '../assets/2_a1c84790-b42a-4248-9c4f-e3206e8c8989_600x600.png';
import p5_img1 from '../assets/1_fcb7d6ba-48c9-49b5-b5fa-65fbe6576bfd_600x600.png';
import p5_img2 from '../assets/2_b6b0d95e-02ee-4fd4-876b-b931dee955f3_600x600.png';
import p6_img1 from '../assets/1_8c387548-6a1e-4930-890a-cec2491c0d60_600x600.png';
import p6_img2 from '../assets/2_506d5c09-fb36-4f3b-a486-c308b3a3e455_600x600.png';
import p7_img1 from '../assets/1_f26220d0-23df-49cc-8ab9-2ef5f66b891a_600x600.png';
import p7_img2 from '../assets/2_61148aae-df8e-43e1-ba9c-e44ab2770905_600x600.png';
import p8_img1 from '../assets/1_f4b79814-9043-4021-bae2-9fdb152c6064_600x600.png';
import p8_img2 from '../assets/2_19953475-0f8b-407d-ac5a-7dd58652c06e_600x600.png';

const initialProducts = [
  {
    id: 1,
    name: "The Never-Ending Story C...",
    category: "Real Estate",
    rating: 3,
    isNew: true,
    price: "$8,500.00",
    oldPrice: "$8,060.00",
    sqftOptions: ["1100 sq fit", "1350 sq fit", "1600 sq fit"],
    image1: p1_img1,
    image2: p1_img2
  },
  {
    id: 2,
    name: "MiniPalais D-703",
    category: "Real Estate",
    rating: 4,
    isNew: false,
    price: "$10,000.00",
    oldPrice: "$11,000.00",
    sqftOptions: ["1300 sq fit", "1500 sq fit", "1800 sq fit"],
    image1: p2_img1,
    image2: p2_img2
  },
  {
    id: 3,
    name: "Wheelwright Cottage...",
    category: "Real Estate",
    rating: 4,
    isNew: true,
    price: "$9,090.00",
    oldPrice: null,
    sqftOptions: ["1800 sq fit", "2200 sq fit", "2600 sq fit"],
    image1: p3_img1,
    image2: p3_img2
  },
  {
    id: 4,
    name: "The White House...",
    category: "Real Estate",
    rating: 5,
    isNew: false,
    price: "$3,600,000.00",
    oldPrice: null,
    sqftOptions: ["1800 sq fit", "2000 sq fit", "3000 sq fit"],
    image1: p4_img1,
    image2: p4_img2
  },
  {
    id: 5,
    name: "Luxury Seaside Villa",
    category: "Real Estate",
    rating: 5,
    isNew: true,
    price: "$15,200.00",
    oldPrice: "$16,500.00",
    sqftOptions: ["2200 sq fit", "2800 sq fit", "3200 sq fit"],
    image1: p5_img1,
    image2: p5_img2
  },
  {
    id: 6,
    name: "Meadow View D - 205",
    category: "Real Estate",
    rating: 5,
    isNew: true,
    price: "$940,000.00",
    oldPrice: "$990,000.00",
    sqftOptions: ["1600 sq fit", "2000 sq fit", "2400 sq fit"],
    image1: p6_img1,
    image2: p6_img2
  },
  {
    id: 7,
    name: "Family Villas C-92",
    category: "Real Estate",
    rating: 4,
    isNew: false,
    price: "$1,250,000.00",
    oldPrice: null,
    sqftOptions: ["1200 sq fit", "1500 sq fit", "1900 sq fit"],
    image1: p7_img1,
    image2: p7_img2
  },
  {
    id: 8,
    name: "Darth Vader House A- 24",
    category: "Real Estate",
    rating: 5,
    isNew: true,
    price: "$1,850,000.00",
    oldPrice: "$2,100,000.00",
    sqftOptions: ["2500 sq fit", "3200 sq fit", "4000 sq fit"],
    image1: p8_img1,
    image2: p8_img2
  }
];

export default function TrendingProducts() {
  const swiperRef = useRef(null);
  const { addToCart, isInWishlist, toggleWishlist, openQuickView } = useCartWishlist();
  const [selectedSqftMap, setSelectedSqftMap] = useState({});
  const [addedMap, setAddedMap] = useState({});
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    fetch('http://localhost:5000/api/properties?limit=12')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        const list = data.properties || data;
        if (Array.isArray(list) && list.length > 0) {
          const fallbackImages = [p1_img1, p2_img1, p3_img1, p4_img1, p5_img1, p6_img1, p7_img1, p8_img1];
          const fallbackHover = [p1_img2, p2_img2, p3_img2, p4_img2, p5_img2, p6_img2, p7_img2, p8_img2];
          
          const mapped = list.map((item, idx) => ({
            id: item.id,
            name: item.title,
            category: item.category_name || item.type || "Real Estate",
            rating: 4 + (idx % 2),
            isNew: Boolean(item.featured),
            price: `$${Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            oldPrice: null,
            sqftOptions: item.areaSqFt 
              ? [`${Math.max(item.areaSqFt - 400, 800)} sq fit`, `${item.areaSqFt} sq fit`, `${item.areaSqFt + 500} sq fit`]
              : ["1200 sq fit", "1600 sq fit", "2000 sq fit"],
            image1: item.primary_image || fallbackImages[idx % fallbackImages.length],
            image2: item.primary_image || fallbackHover[idx % fallbackHover.length],
            description: item.description,
            address: item.address,
            slug: item.slug
          }));
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Using default initial products:', err);
      });
  }, []);

  const handleSqftChange = (productId, value) => {
    setSelectedSqftMap((prev) => ({ ...prev, [productId]: value }));
  };

  const handleAddToCart = (product) => {
    const sqft = selectedSqftMap[product.id] || product.sqftOptions[0];
    addToCart(product, sqft, 1, false);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section id="trending-products" className="bg-white py-20 border-b border-gray-100 relative group overflow-hidden">
      <div className="container mx-auto px-10">
        
        {/* Section Header */}
        <h2 className="text-[34px] font-extrabold text-[#161829] mb-10 tracking-tight">
          Trending Products
        </h2>

        <div className="relative">
          {/* Left Manual Arrow */}
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-2 top-[40%] -translate-y-1/2 w-10 h-10 flex-shrink-0 bg-[#63c0ee] hover:bg-[#4eaade] text-white rounded flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer z-20 opacity-0 group-hover:opacity-100 shadow-md"
            aria-label="Previous Products"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>

          {/* Cards Slider */}
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            loop={true}
            grabCursor={true}
            className="w-full pb-4"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <div className="flex flex-col h-full bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  
                  {/* Image Container with Hover Swap */}
                  <div className="relative h-[240px] w-full overflow-hidden group/image p-3 pb-0">
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      {/* Image 1 (Default) */}
                      <img 
                        src={product.image1} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-100 group-hover/image:opacity-0" 
                      />
                      {/* Image 2 (Hover) */}
                      <img 
                        src={product.image2} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover/image:opacity-100" 
                      />
                      
                      {/* New Badge */}
                      {product.isNew && (
                        <div className="absolute top-3 left-3 bg-[#63c0ee] text-[#161829] text-[11px] font-bold px-2.5 py-0.5 rounded shadow-sm z-10 tracking-wide">
                          New
                        </div>
                      )}

                      {/* Action Icons (Hover Reveal) */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover/image:translate-x-0 group-hover/image:opacity-100 transition-all duration-300 ease-in-out z-10">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                            isInWishlist(product.id)
                              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                              : 'bg-white text-[#63c0ee] hover:bg-[#63c0ee] hover:text-white'
                          }`}
                          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                          title={isInWishlist(product.id) ? "In Wishlist (Click to remove)" : "Save to Wishlist"}
                        >
                          <Heart size={14} strokeWidth={2.5} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currIdx = product.sqftOptions.indexOf(selectedSqftMap[product.id] || product.sqftOptions[0]);
                            const nextIdx = (currIdx + 1) % product.sqftOptions.length;
                            handleSqftChange(product.id, product.sqftOptions[nextIdx]);
                          }}
                          className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#63c0ee] hover:bg-[#63c0ee] hover:text-white shadow-md transition-colors cursor-pointer"
                          aria-label="Cycle layout option"
                          title="Cycle layout option"
                        >
                          <RefreshCw size={14} strokeWidth={2.5} />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openQuickView(product);
                          }}
                          className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#63c0ee] hover:bg-[#63c0ee] hover:text-white shadow-md transition-colors cursor-pointer"
                          aria-label="Quick view"
                          title="Quick View Property"
                        >
                          <Eye size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Category */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#63c0ee]"></div>
                      <span className="text-xs font-semibold text-[#161829]">{product.category}</span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={13} 
                          className={star <= product.rating ? "text-[#63c0ee] fill-[#63c0ee]" : "text-[#63c0ee] fill-transparent"} 
                        />
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-[17px] text-[#161829] hover:text-[#63c0ee] transition-colors tracking-tight mb-4 line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Actionable Size Selector Option */}
                    <div className="relative mb-2">
                      <select 
                        value={selectedSqftMap[product.id] || product.sqftOptions[0]}
                        onChange={(e) => handleSqftChange(product.id, e.target.value)}
                        className="w-full appearance-none bg-transparent border border-gray-200 rounded text-gray-700 font-medium text-[13px] px-3 py-2 cursor-pointer hover:border-[#63c0ee] focus:outline-none focus:border-[#63c0ee] transition-colors shadow-sm"
                      >
                        {product.sqftOptions.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-col mt-3 mb-5">
                      <div className="flex items-end gap-2">
                        <span className="text-[#63c0ee] font-bold text-[17px]">{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-gray-400 line-through text-[13px] font-medium opacity-80 pb-0.5">
                            {product.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button 
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`w-full font-bold text-[13px] tracking-wide py-3 rounded transition-all mt-auto shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        addedMap[product.id]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#63c0ee] hover:bg-[#4eaade] text-[#161829]'
                      }`}
                    >
                      {addedMap[product.id] ? (
                        <>
                          <Check size={16} strokeWidth={3} /> Added to Cart!
                        </>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right Manual Arrow */}
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-2 top-[40%] -translate-y-1/2 w-10 h-10 flex-shrink-0 bg-[#63c0ee] hover:bg-[#4eaade] text-white rounded flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer z-20 opacity-0 group-hover:opacity-100 shadow-md"
            aria-label="Next Products"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>

      </div>
    </section>
  );
}
