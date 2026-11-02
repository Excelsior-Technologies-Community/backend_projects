import React from 'react';
import { ArrowRightSquare } from 'lucide-react';
import iconEcommerce from '../assets/ecommerce.png';
import iconStore from '../assets/store.png';

export default function LuxuriousMasterSuite() {
  const features = [
    {
      id: 1,
      icon: iconEcommerce,
      title: "Your Haven Awaits",
      desc: "At , we believe that a home is more than just a physical space it's a reflection of your unique personality and a sanctuary where cherished memories are created. We are dedicated to helping you find the perfect...",
    },
    {
      id: 2,
      icon: iconEcommerce,
      title: "Where Dreams Begin",
      desc: "These opening lines immediately communicate that the property is large, sits on a sizable lot, and is located in a prestigious neighborhood. With these kinds of details leading your property listing, buyers will be jumping...",
    },
    {
      id: 3,
      icon: iconEcommerce,
      title: "Our Home, Your Story",
      desc: "With our team of experienced professionals, we are committed to providing exceptional service and guiding you through every step of the home-buying journey. We understand that finding the right home is a significant...",
    },
    {
      id: 4,
      icon: iconStore,
      title: "A Place to Call Home",
      desc: "We take pride in offering homes that boast exceptional craftsmanship, quality finishes, and thoughtful design. From the moment you step into one of our properties, you'll appreciate the attention to detail, the inviting atmosphere, and the sense of comfort that each home exudes.",
    }
  ];

  return (
    <section className="bg-[#63c0ee] py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-md">
            <span className="font-extrabold text-[13px] text-[#161829] mb-3 tracking-wider uppercase block">
              Real Estate
            </span>
            <h2 className="text-[36px] md:text-[46px] font-extrabold text-[#161829] leading-[1.1] tracking-tight">
              Luxurious Master <br />
              Suite
            </h2>
          </div>

          <p className="text-[14px] md:text-[15px] font-medium text-white/95 leading-relaxed max-w-xl lg:mb-1">
            These titles highlight key features that are often sought after in a home, such as ample space, a well-equipped kitchen, a luxurious master suite, an inviting outdoor area, and the convenience of smart home technology.
          </p>

          <button className="bg-[#161829] hover:bg-black text-white font-bold text-[13px] tracking-wide px-7 py-3 rounded-md flex items-center justify-center gap-2 transition-all shadow-md shrink-0 self-start lg:self-end">
            Get Started <ArrowRightSquare size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* 2x2 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Card Icon & Title Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-lg bg-sky-50 flex items-center justify-center p-2.5 border border-[#63c0ee]/20 group-hover:bg-[#63c0ee]/10 transition-colors">
                    <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-[20px] md:text-[22px] font-extrabold text-[#161829] tracking-tight group-hover:text-[#63c0ee] transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[13px] md:text-[14px] font-normal text-gray-500 leading-relaxed mb-8">
                  {item.desc}
                </p>
              </div>

              {/* Action Button */}
              <button className="bg-[#63c0ee] hover:bg-[#4eaade] text-white font-bold text-[13px] tracking-wide px-6 py-2.5 rounded-md flex items-center justify-center gap-2 transition-all w-fit shadow-xs">
                Get Started <ArrowRightSquare size={15} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
