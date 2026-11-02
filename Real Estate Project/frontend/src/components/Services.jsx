import React from 'react';
import { Building, Store, Factory, ArrowRightSquare } from 'lucide-react';

export default function Services() {
  const services = [
    {
      id: 1,
      icon: Building,
      title: "Reliable Home",
      text: "Whether you're in need of reliable home repair and maintenance services, efficient home cleaning and organization."
    },
    {
      id: 2,
      icon: Store,
      title: "Efficient Home",
      text: "When it comes to home repair and maintenance, we understand the importance of a well-functioning home."
    },
    {
      id: 3,
      icon: Factory,
      title: "Expert Home",
      text: "Our home cleaning and organization services are designed to create a fresh and clutter-free living space."
    }
  ];

  return (
    <section className="bg-white py-20 border-b border-gray-100">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            
            return (
              <div 
                key={service.id}
                className="group border border-gray-200 rounded-xl p-10 flex flex-col items-center text-center cursor-pointer transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:bg-[#161829] hover:border-[#161829]"
              >
                {/* Icon Container */}
                <div className="mb-6 h-24 w-24 flex items-center justify-center">
                  <Icon 
                    size={72} 
                    strokeWidth={1.5} 
                    className="text-[#161829] group-hover:text-[#63c0ee] transition-colors duration-500" 
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-[22px] font-bold text-[#161829] group-hover:text-white transition-colors duration-500 mb-5 tracking-tight">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-[14px] font-medium text-gray-600 group-hover:text-white/80 transition-colors duration-500 leading-relaxed max-w-[90%] flex-grow mb-10">
                  {service.text}
                </p>
                
                {/* Button */}
                <button className="bg-[#63c0ee] text-[#161829] w-[200px] hover:opacity-90 font-bold text-[13px] tracking-wide px-6 py-3.5 rounded-md flex items-center justify-center gap-2 mt-auto transition-opacity duration-300">
                  Get Started <ArrowRightSquare size={16} strokeWidth={2.5} className="ml-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
