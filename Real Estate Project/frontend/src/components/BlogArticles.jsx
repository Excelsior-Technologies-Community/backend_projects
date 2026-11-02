import React from 'react';
import { ArrowRightSquare } from 'lucide-react';
import blogImg1 from '../assets/image_6.png';
import blogImg2 from '../assets/image_5.png';
import blogImg3 from '../assets/image_4.png';
import blogImg4 from '../assets/image_3.png';

export default function BlogArticles() {
  const articles = [
    {
      id: 1,
      badge: "Property",
      title: "Engel & Volkers Rea...",
      description: "At Engel & Völkers, we understand that buying or selling a property is more than just a transaction—it's ...",
      author: "WorkDo",
      date: "30 Mar 2023",
      image: blogImg1
    },
    {
      id: 2,
      badge: "Property",
      title: "Points Over...",
      description: "the notion of exclusivity. Breaking away from traditional high-rise living, Points Over Penthouses...",
      author: "WorkDo",
      date: "30 Mar 2023",
      image: blogImg2
    },
    {
      id: 3,
      badge: "Property",
      title: "Landmark Real...",
      description: "Landmark Real Estate Properties is a distinguished real estate agency specializing in iconic and...",
      author: "WorkDo",
      date: "30 Mar 2023",
      image: blogImg3
    },
    {
      id: 4,
      badge: "Property",
      title: "Homes To The Moon",
      description: "Homes To The Moon, your gateway to a new frontier in real estate. We believe that the sky is not the limit...",
      author: "WorkDo",
      date: "30 Mar 2023",
      image: blogImg4
    }
  ];

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mb-14 flex flex-col items-center">
          <span className="font-extrabold text-[13px] text-[#161829] mb-3 tracking-wider uppercase">
            Real Estate
          </span>
          
          <h2 className="text-[36px] md:text-[44px] font-extrabold text-[#161829] leading-tight mb-4 tracking-tight">
            Blog & Articles
          </h2>
          
          <p className="text-[14px] md:text-[15px] font-medium text-gray-400 leading-relaxed max-w-2xl">
            We believe in building long-term relationships with our clients, providing ongoing support and assistance even after you've settled into your new home. Our goal is to ensure that you are completely satisfied with your decision and that your home remains a source of joy and fulfillment for years to come.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {articles.map((item) => (
            <article 
              key={item.id} 
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
            >
              {/* Card Image */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                <span className="absolute top-3 left-3 bg-[#63c0ee] text-[#161829] text-[11px] font-bold px-3 py-1 rounded shadow-sm z-10">
                  {item.badge}
                </span>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  loading="lazy"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-[17px] font-bold text-[#161829] mb-3 group-hover:text-[#63c0ee] transition-colors leading-snug">
                  {item.title}
                </h3>
                
                <p className="text-[13px] text-gray-400 leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                {/* Author & Date */}
                <div className="text-[12px] font-bold text-[#63c0ee] mb-5 tracking-wide">
                  {item.author} • {item.date}
                </div>

                {/* Read More Button */}
                <button 
                  className="bg-[#63c0ee] hover:bg-[#4eaade] text-white font-bold text-[13px] tracking-wide px-5 py-2.5 rounded flex items-center justify-center gap-2 transition-all w-fit shadow-sm"
                  aria-label={`Read more about ${item.title}`}
                >
                  Read More <ArrowRightSquare size={16} strokeWidth={2.5} />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
