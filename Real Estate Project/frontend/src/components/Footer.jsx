import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const navLinksCol1 = [
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Featured Properties", to: "/properties" },
    { label: "Prime Locations", to: "/locations" }
  ];

  const navLinksCol2 = [
    { label: "About us", to: "/about" },
    { label: "Contact us", to: "/contact" },
    { label: "Faq's", to: "/faq" },
    { label: "Categories", to: "/categories" },
    { label: "Saved Homes", to: "/favorites" }
  ];

  return (
    <footer className="bg-[#F5F6F8] pt-20 pb-10 border-t border-gray-100">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-10 lg:gap-8 pb-8">

          {/* Column 1: Brand Info & Socials */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <p className="text-[#161929] text-[14px] md:text-[16px] leading-relaxed mb-4 max-w-sm">
              Let us help you find the perfect home that will be the backdrop to your unique story. Contact us today to embark on this exciting journey together.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-6 text-[14px] font-semibold text-[#161829]">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#63c0ee] transition-colors">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#63c0ee] transition-colors">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#63c0ee] transition-colors">Instagram</a>
            </div>
          </div>

          {/* Column 2: Legal & Discovery */}
          <div className="lg:col-span-2 lg:pl-12">
            <h4 className="font-extrabold text-[20px] text-[#161829] mb-5 tracking-tight">
              Navigation:
            </h4>
            <ul className="space-y-2">
              {navLinksCol1.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-[#161929] hover:text-[#63c0ee] text-[14px] font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Corporate & Info */}
          <div className="lg:col-span-2 lg:pl-12">
            <h4 className="font-extrabold text-[20px] text-[#161829] mb-5 tracking-tight">
              Company:
            </h4>
            <ul className="space-y-2">
              {navLinksCol2.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-[#161929] hover:text-[#63c0ee] text-[14px] font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h4 className="font-extrabold text-[20px] text-[#161829] mb-1 tracking-tight">
                Phone
              </h4>
              <a
                href="tel:+18004567890"
                className="text-[#63c0ee] font-bold text-[14px] hover:underline inline-block"
              >
                +1 (800) 456-7890
              </a>
            </div>

            <div>
              <h4 className="font-extrabold text-[20px] text-[#161829] mb-1 tracking-tight">
                Email
              </h4>
              <a
                href="mailto:support@realestate-workdo.com"
                className="text-[#161929] hover:text-[#63c0ee] text-[14px] font-medium transition-colors inline-block"
              >
                support@realestate-workdo.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar Divider & Subfooter */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] md:text-[14px] text-[#161929] font-medium text-center sm:text-left">
            © {new Date().getFullYear()}, Realestate WorkDo, Powered by WorkDo.io
          </p>

          {/* Payment Badges */}
          <div className="flex items-center space-x-2.5 flex-wrap justify-center">
            <div className="h-6 px-2.5 bg-white rounded border border-gray-200 flex items-center justify-center shadow-xs">
              <span className="font-black italic text-[#1A1F71] text-[11px] tracking-wider">VISA</span>
            </div>
            <div className="h-6 px-2.5 bg-white rounded border border-gray-200 flex items-center justify-center gap-0.5 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] inline-block opacity-90 -mr-1"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] inline-block opacity-90"></span>
            </div>
            <div className="h-6 px-2 bg-[#006FCF] rounded border border-[#006FCF] flex items-center justify-center shadow-xs">
              <span className="font-bold text-white text-[9px] tracking-tight">AMEX</span>
            </div>
            <div className="h-6 px-2.5 bg-white rounded border border-gray-200 flex items-center justify-center shadow-xs">
              <span className="font-extrabold italic text-[#003087] text-[10px]">Pay<span className="text-[#0079C1]">Pal</span></span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
