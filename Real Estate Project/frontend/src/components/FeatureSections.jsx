import React from 'react';
import { ArrowRightSquare } from 'lucide-react';
import twoCol1 from '../assets/two-col1.jpg';
import twoCol2 from '../assets/two-col2.jpg';

export default function FeatureSections() {
  return (
    <>
      {/* First Section: Image Left, Text Right */}
      <section className="flex flex-col lg:flex-row w-full bg-white border-b border-gray-100">
        
        {/* Left Side: Full Width/Height Image */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto lg:min-h-[600px]">
          <img 
            src={twoCol1} 
            alt="Modern modular home" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Right Side: Text Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10 lg:p-20 xl:p-32">
          <div className="max-w-[450px] w-full flex flex-col items-start transition-transform duration-700 hover:translate-x-2">
            <span className="font-extrabold text-[13px] text-[#161829] mb-5 tracking-wider uppercase">Real Estate</span>
            
            <h2 className="text-[44px] lg:text-[52px] font-extrabold text-[#161829] leading-[1.05] mb-8 tracking-tight">
              The Perfect Home <br />
              <span className="text-[#63c0ee]">for Generations</span>
            </h2>
            
            <p className="text-[14px] font-medium text-gray-400 leading-[1.8] mb-12">
              The gourmet kitchen is a culinary masterpiece, boasting top-of-the-line 
              stainless steel appliances, sleek granite countertops, and ample cabinet 
              space. Whether you're a seasoned chef or simply enjoy cooking, this kitchen is 
              sure to inspire your culinary creations.
            </p>
            
            <button className="bg-[#161829] text-white hover:bg-opacity-90 font-bold text-[13px] tracking-wide px-8 py-3.5 rounded-md flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Get Started <ArrowRightSquare size={16} strokeWidth={2.5} className="ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Second Section: Text Left, Image Right */}
      <section className="flex flex-col lg:flex-row-reverse w-full bg-white border-b border-gray-100">
        
        {/* Right Side: Full Width/Height Image */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto lg:min-h-[600px]">
          <img 
            src={twoCol2} 
            alt="Woman working on laptop at sunny desk" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10 lg:p-20 xl:p-32">
          <div className="max-w-[450px] w-full flex flex-col items-start transition-transform duration-700 hover:-translate-x-2">
            <span className="font-extrabold text-[13px] text-[#161829] mb-5 tracking-wider uppercase">Real Estate</span>
            
            <h2 className="text-[44px] lg:text-[52px] font-extrabold text-[#161829] leading-[1.05] mb-8 tracking-tight">
              A Peaceful <br />
              <span className="text-[#63c0ee]">Sanctuary in Nature</span>
            </h2>
            
            <p className="text-[14px] font-medium text-gray-400 leading-[1.8] mb-12">
              As you step inside, you are greeted by an open and inviting floor plan filled 
              with natural light. The spacious living room features elegant hardwood floors, a 
              cozy fireplace, and large windows that frame picturesque views of the 
              surrounding landscape.
            </p>
            
            <button className="bg-[#161829] text-white hover:bg-opacity-90 font-bold text-[13px] tracking-wide px-8 py-3.5 rounded-md flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Get Started <ArrowRightSquare size={16} strokeWidth={2.5} className="ml-1" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
