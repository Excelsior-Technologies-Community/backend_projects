import React from 'react';
import { ArrowRightSquare, Monitor, BadgeDollarSign, Store, Calculator } from 'lucide-react';

export default function OasisResidence() {
  const cards = [
    {
      id: 1,
      icon: Monitor,
      title: "Your Private Retreat",
      desc: "home that blends timeless elegance with modern comforts. This meticulously designed...",
    },
    {
      id: 2,
      icon: BadgeDollarSign,
      title: "Living and...",
      desc: "The grand foyer welcomes you with its soaring ceilings, exquisite chandelier, and elegant staircase,...",
    },
    {
      id: 3,
      icon: Store,
      title: "A Chef's...",
      desc: "The spacious living area is an entertainer's delight, featuring a cozy fireplace, large windows tha...",
    },
    {
      id: 4,
      icon: Calculator,
      title: "The Whole Family",
      desc: "The gourmet kitchen is a culinary haven, boasting top-of-the-line stainless steel appliances, custo...",
    }
  ];

  return (
    <section className="bg-[#63c0ee] py-24">
      <div className="container mx-auto px-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mb-16 flex flex-col items-center">
          <span className="font-extrabold text-[13px] text-[#161829] mb-4 tracking-wider uppercase">
            Real Estate
          </span>
          
          <h2 className="text-[40px] md:text-[48px] font-extrabold text-[#161829] leading-[1.15] mb-6 tracking-tight">
            The Oasis Residence Your <br />
            <span className="text-white">Private Paradise Awaits</span>
          </h2>
          
          <p className="text-[14px] md:text-[15px] font-medium text-white/90 leading-relaxed max-w-2xl">
            Enjoy al fresco dining on the spacious patio, surrounded by lush landscaping and a 
            well-manicured lawn. The soothing sound of a gentle breeze rustling through the 
            trees creates an ambiance of serenity.
          </p>
        </div>

        {/* Features 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16 lg:px-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id}
                className="group border border-white/30 rounded-xl p-8 flex flex-col items-start transition-all duration-500 hover:bg-[#161829] hover:border-transparent hover:-translate-y-3 cursor-pointer hover:shadow-2xl h-full"
              >
                {/* Fixed Height Icon Container */}
                <div className="mb-6 h-12 w-12 flex items-center justify-start text-white group-hover:text-[#63c0ee] transition-colors duration-500">
                  <Icon size={46} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-[20px] font-bold text-white mb-4 tracking-tight transition-colors duration-500">
                  {card.title}
                </h3>
                
                <p className="text-[13px] font-medium text-white/90 leading-relaxed mb-8 flex-grow transition-colors duration-500">
                  {card.desc}
                </p>
                
                <button className="bg-white text-[#161829] font-bold text-[13px] tracking-wide px-6 py-2.5 rounded flex items-center gap-2 mt-auto hover:bg-opacity-90 transition-all shadow-sm">
                  Get started <ArrowRightSquare size={16} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Global Action Button */}
        <div className="flex justify-center w-full">
          <button className="bg-[#161829] text-white hover:bg-opacity-90 font-bold text-[13px] tracking-wide px-8 py-3.5 rounded-md flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            See all Collection <ArrowRightSquare size={16} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </section>
  );
}
