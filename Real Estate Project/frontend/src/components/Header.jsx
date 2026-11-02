import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  User,
  ShoppingCart,
  Heart,
  X,
  ArrowUpRight,
  Home,
  Store,
  Building2,
  Warehouse,
  Building,
  Menu
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import menuProductImg from '../assets/menu-product.png';
import shop1 from '../assets/shop_img1.png';
import shop2 from '../assets/shop_img2.png';
import shop3 from '../assets/shop_img3.png';
import shop4 from '../assets/shop_img4.png';
import enFlag from '../assets/en.svg';
import arFlag from '../assets/ar.svg';
import deFlag from '../assets/de.svg';
import esFlag from '../assets/es.svg';
import usdFlag from '../assets/usd.svg';

export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { cartTotalCount, wishlistCount, openCart, openWishlist } = useCartWishlist();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [selectedLang, setSelectedLang] = useState({ code: 'gb', name: 'English', flag: enFlag });
  const [selectedCurrency, setSelectedCurrency] = useState({ code: 'us', name: 'USD', symbol: '$', flag: usdFlag });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const currencyMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target)) {
        setCurrencyMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageOptions = [
    { code: 'gb', name: 'English', flag: enFlag },
    { code: 'ae', name: 'العربية', flag: arFlag },
    { code: 'de', name: 'Deutsch', flag: deFlag },
    { code: 'es', name: 'Español', flag: esFlag },
  ];

  const currencyOptions = [
    { code: 'us', name: 'USD', symbol: '$', flag: usdFlag },
    { code: 'eu', name: 'EUR', symbol: '€', flag: 'https://flagcdn.com/w20/eu.png' },
    { code: 'gb', name: 'GBP', symbol: '£', flag: enFlag },
  ];

  const serviceItems = [
    { id: 1, icon: Home },
    { id: 2, icon: Store },
    { id: 3, icon: Building2 },
    { id: 4, icon: Warehouse },
    { id: 5, icon: Building },
    { id: 6, icon: Building },
  ];

  return (
    <>
      {/* 1. Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-[#56B4E9] text-white text-center py-2.5 px-4 text-[14px] font-normal relative z-50 select-none">
          <span>It is a long established fact that a reader will be distracted by the readable.</span>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Close Announcement"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. Main Navigation Bar (Sky Blue #63c0ee matching screenshot) */}
      <div className="bg-white relative z-40">
        <div className="container mx-auto px-6 lg:px-10">
          <header className="flex justify-between items-center py-4 gap-4">

            {/* Logo Image from assets */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src={logo}
                alt="Real Estate WorkDo"
                className="h-[24px] w-auto object-contain cursor-pointer"
              />
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="relative hidden md:block w-64 lg:w-72"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, cities..."
                className="w-full px-5 py-2 rounded-full bg-white/40 border border-[#161829]/20 text-[#161829] placeholder-[#161829]/70 focus:bg-white focus:outline-hidden pr-10 text-[13px] font-normal transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#161829] hover:opacity-75 transition-opacity cursor-pointer"
                aria-label="Submit Search"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Navigation Links with standard Dropdowns */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
              {/* Main Page Dropdown */}
              <div className="group relative py-2">
                <Link
                  to="/"
                  className="font-medium text-[14px] text-[#161829] hover:text-[#63c0ee] transition-colors"
                >
                  Main Page
                </Link>
                <div className="fixed left-0 right-0 top-auto pt-4 w-full opacity-0 invisible -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                  <div className="w-full bg-white shadow-xl border-t border-gray-100">
                    <div className="container mx-auto flex justify-between px-10 py-8 gap-10">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#161829] mb-4 text-[15px]">Villa</h3>
                        <ul className="flex flex-col gap-3 text-sm text-[#666666]">
                          <li><Link to="/properties?search=Bestseller" className="hover:text-[#63c0ee] transition-colors">Bestseller</Link></li>
                          <li><Link to="/properties?search=Farm" className="hover:text-[#63c0ee] transition-colors">Farm Vila</Link></li>
                          <li><Link to="/properties?search=Luxury" className="hover:text-[#63c0ee] transition-colors">Luxury Properties</Link></li>
                          <li><Link to="/properties?search=Royal" className="hover:text-[#63c0ee] transition-colors">Royal House</Link></li>
                        </ul>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#161829] mb-4 text-[15px]">Featured Estates</h3>
                        <ul className="flex flex-col gap-3 text-sm text-[#666666]">
                          <li><Link to="/properties?search=Darth%20Vader" className="hover:text-[#63c0ee] transition-colors">Darth Vader House A-24</Link></li>
                          <li><Link to="/properties?search=Family%20Villas" className="hover:text-[#63c0ee] transition-colors">Family Villas C-92</Link></li>
                          <li><Link to="/properties?search=Meadow%20View" className="hover:text-[#63c0ee] transition-colors">Meadow View D-205</Link></li>
                          <li><Link to="/properties?search=Noble%20Park" className="hover:text-[#63c0ee] transition-colors">Noble Park B-106</Link></li>
                          <li><Link to="/properties?search=White%20House" className="hover:text-[#63c0ee] transition-colors">The White House J-54</Link></li>
                        </ul>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#161829] mb-4 text-[15px]">Apartments</h3>
                        <ul className="flex flex-col gap-3 text-sm text-[#666666]">
                          <li><Link to="/properties?search=Penthouse" className="hover:text-[#63c0ee] transition-colors">Waterfront Penthouse</Link></li>
                          <li><Link to="/properties?search=Loft" className="hover:text-[#63c0ee] transition-colors">Urban Tower Loft</Link></li>
                          <li><Link to="/properties?purpose=For%20Rent" className="hover:text-[#63c0ee] transition-colors">Properties for Rent</Link></li>
                          <li><Link to="/properties?purpose=For%20Sale" className="hover:text-[#63c0ee] transition-colors">Properties for Sale</Link></li>
                        </ul>
                      </div>
                      <div className="flex-1 flex justify-end">
                        <Link to="/properties">
                          <img
                            src={menuProductImg}
                            alt="House"
                            className="w-[300px] h-[200px] object-cover rounded-lg shadow-xs hover:scale-102 transition-transform"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop / Properties Link */}
              <div className="group relative py-2">
                <Link
                  to="/properties"
                  className="font-medium text-[14px] text-[#161829] hover:text-[#63c0ee] transition-colors"
                >
                  Shop
                </Link>
                <div className="fixed left-0 right-0 top-auto pt-4 w-full opacity-0 invisible -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                  <div className="w-full bg-white shadow-xl border-t border-gray-100">
                    <div className="container mx-auto flex justify-center gap-8 px-10 py-8">
                      <Link to="/properties?search=Villa" className="flex flex-col items-center gap-4 group/item w-[220px]">
                        <img
                          src={shop1}
                          alt="Bestseller"
                          className="w-full h-[200px] object-cover rounded-lg group-hover/item:scale-102 transition-transform duration-300"
                        />
                        <span className="text-sm font-semibold text-[#161829] group-hover/item:text-[#63c0ee] transition-colors">
                          Bestseller
                        </span>
                      </Link>
                      <Link to="/properties?search=Farm" className="flex flex-col items-center gap-4 group/item w-[220px]">
                        <img
                          src={shop2}
                          alt="Farm Vila"
                          className="w-full h-[200px] object-cover rounded-lg group-hover/item:scale-102 transition-transform duration-300"
                        />
                        <span className="text-sm font-semibold text-[#161829] group-hover/item:text-[#63c0ee] transition-colors">
                          Farm Vila
                        </span>
                      </Link>
                      <Link to="/properties?search=Luxury" className="flex flex-col items-center gap-4 group/item w-[220px]">
                        <img
                          src={shop3}
                          alt="Luxury Properties"
                          className="w-full h-[200px] object-cover rounded-lg group-hover/item:scale-102 transition-transform duration-300"
                        />
                        <span className="text-sm font-semibold text-[#161829] group-hover/item:text-[#63c0ee] transition-colors">
                          Luxury Properties
                        </span>
                      </Link>
                      <Link to="/properties?search=Royal" className="flex flex-col items-center gap-4 group/item w-[220px]">
                        <img
                          src={shop4}
                          alt="Royal House"
                          className="w-full h-[200px] object-cover rounded-lg group-hover/item:scale-102 transition-transform duration-300"
                        />
                        <span className="text-sm font-semibold text-[#161829] group-hover/item:text-[#63c0ee] transition-colors">
                          Royal House
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/categories"
                className="font-medium text-[14px] text-[#161829] hover:text-[#63c0ee] transition-colors"
              >
                Service
              </Link>

              <Link
                to="/locations"
                className="font-medium text-[14px] text-[#161829] hover:text-[#63c0ee] transition-colors"
              >
                Locations
              </Link>

              {/* Pages Dropdown */}
              <div className="group relative py-2">
                <span
                  className="font-medium text-[14px] text-[#161829] hover:text-[#63c0ee] transition-colors cursor-pointer"
                >
                  Pages
                </span>
                <div className="absolute left-0 top-full pt-2 z-50 opacity-0 invisible -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                  <div className="w-56 bg-white shadow-xl border border-gray-100 rounded-lg py-2">
                    <ul className="flex flex-col text-[14px] text-[#161829] font-medium">
                      <li><Link to="/about" className="block px-6 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors">About us</Link></li>
                      <li><Link to="/contact" className="block px-6 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors">Contact us</Link></li>
                      <li><Link to="/faq" className="block px-6 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors">Faq's</Link></li>
                      <li><Link to="/properties" className="block px-6 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors">All Properties</Link></li>
                      <li><Link to="/categories" className="block px-6 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors">Categories</Link></li>
                      <li><Link to="/locations" className="block px-6 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors">Locations</Link></li>
                      <li><Link to="/favorites" className="block px-6 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors">Saved Watchlist</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>

            {/* Right Side Icons & Selectors */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* User Account Dropdown */}
              <div
                ref={userMenuRef}
                className="group relative py-2"
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setLangMenuOpen(false);
                    setCurrencyMenuOpen(false);
                  }}
                  className="text-[#161829] hover:text-[#63c0ee] transition-colors cursor-pointer flex items-center p-1 relative"
                  aria-label="User Account"
                  title={isAuthenticated ? `Logged in as ${user.firstName}` : 'Account'}
                >
                  <User size={20} />
                  {isAuthenticated && (
                    <span className="absolute top-1 right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-[-8px] top-full pt-2 z-50 transition-all duration-300 ease-out ${
                    userMenuOpen
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto'
                  }`}
                >
                  <div className="w-52 bg-white shadow-xl border border-gray-100 rounded-lg py-2 overflow-hidden">
                    {isAuthenticated ? (
                      <div>
                        <div className="px-5 py-2.5 border-b border-gray-100 bg-gray-50/70">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Signed In</p>
                          <p className="text-[14px] font-bold text-[#161829] truncate">{user.firstName} {user.lastName || ''}</p>
                          <p className="text-[12px] text-gray-500 truncate">{user.email}</p>
                        </div>
                        <ul className="flex flex-col text-[14px] text-[#161829] font-medium pt-1">
                          <li>
                            <button
                              type="button"
                              onClick={() => {
                                setUserMenuOpen(false);
                                openAuthModal('profile');
                              }}
                              className="w-full text-left px-5 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors cursor-pointer"
                            >
                              My Profile
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              onClick={() => {
                                setUserMenuOpen(false);
                                openWishlist();
                              }}
                              className="w-full text-left px-5 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors cursor-pointer flex items-center justify-between"
                            >
                              <span>Quick Wishlist</span>
                              <span className="bg-[#63c0ee]/15 text-[#63c0ee] text-xs font-bold px-2 py-0.5 rounded-full">
                                {wishlistCount}
                              </span>
                            </button>
                          </li>
                          <li>
                            <Link
                              to="/favorites"
                              onClick={() => setUserMenuOpen(false)}
                              className="block px-5 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors"
                            >
                              Saved Properties
                            </Link>
                          </li>
                          <li className="border-t border-gray-100 mt-1 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setUserMenuOpen(false);
                                logout();
                              }}
                              className="w-full text-left px-5 py-2.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                            >
                              Log out
                            </button>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <ul className="flex flex-col text-[14px] text-[#161829] font-medium">
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              openAuthModal('login');
                            }}
                            className="w-full text-left px-5 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors cursor-pointer"
                          >
                            Log in
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              openAuthModal('register');
                            }}
                            className="w-full text-left px-5 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors cursor-pointer"
                          >
                            Create Account
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              openWishlist();
                            }}
                            className="w-full text-left px-5 py-2.5 hover:bg-gray-50 hover:text-[#63c0ee] transition-colors cursor-pointer flex items-center justify-between"
                          >
                            <span>Wishlist</span>
                            <span className="bg-[#63c0ee]/15 text-[#63c0ee] text-xs font-bold px-2 py-0.5 rounded-full">
                              {wishlistCount}
                            </span>
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Language Selector */}
              <div
                ref={langMenuRef}
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setUserMenuOpen(false);
                  setCurrencyMenuOpen(false);
                }}
                onMouseLeave={() => setLangMenuOpen(false)}
                className="group relative cursor-pointer hidden sm:flex items-center gap-1.5 border border-[#161829]/25 px-3 py-1.5 rounded-md hover:border-[#161829] transition-colors text-[13px] font-medium text-[#161829]"
              >
                <img
                  src={selectedLang.flag}
                  alt={selectedLang.name}
                  className="w-[18px] object-contain shadow-2xs"
                />
                <span>{selectedLang.name}</span>
                <ChevronDown
                  size={14}
                  className={`text-[#161829] transition-transform duration-200 ${
                    langMenuOpen ? 'rotate-180' : 'group-hover:rotate-180'
                  }`}
                />

                <div
                  className={`absolute left-0 top-full pt-2 z-50 transition-all duration-300 ease-out ${
                    langMenuOpen
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto'
                  }`}
                >
                  <div className="w-40 bg-white shadow-xl border border-gray-100 rounded-lg py-1.5">
                    <ul className="flex flex-col text-[13px] text-[#161829]">
                      {languageOptions.map((lang) => (
                        <li
                          key={lang.code}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLang(lang);
                            setLangMenuOpen(false);
                          }}
                          className={`px-4 py-2 hover:bg-gray-50 hover:text-[#63c0ee] flex items-center gap-3 transition-colors cursor-pointer ${
                            selectedLang.code === lang.code ? 'bg-gray-50/80 text-[#63c0ee] font-medium' : ''
                          }`}
                        >
                          <img src={lang.flag} alt={lang.name} className="w-[18px] object-contain shadow-2xs" />
                          {lang.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Currency Selector */}
              <div
                ref={currencyMenuRef}
                onClick={() => {
                  setCurrencyMenuOpen(!currencyMenuOpen);
                  setUserMenuOpen(false);
                  setLangMenuOpen(false);
                }}
                onMouseLeave={() => setCurrencyMenuOpen(false)}
                className="group relative cursor-pointer hidden sm:flex items-center gap-1.5 border border-[#161829]/25 px-3 py-1.5 rounded-md hover:border-[#161829] transition-colors text-[13px] font-medium text-[#161829]"
              >
                <img
                  src={selectedCurrency.flag}
                  alt={selectedCurrency.name}
                  className="w-[18px] object-contain shadow-2xs"
                />
                <span>{selectedCurrency.name}</span>
                <ChevronDown
                  size={14}
                  className={`text-[#161829] transition-transform duration-200 ${
                    currencyMenuOpen ? 'rotate-180' : 'group-hover:rotate-180'
                  }`}
                />

                <div
                  className={`absolute left-0 top-full pt-2 z-50 transition-all duration-300 ease-out ${
                    currencyMenuOpen
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto'
                  }`}
                >
                  <div className="w-36 bg-white shadow-xl border border-gray-100 rounded-lg py-1.5">
                    <ul className="flex flex-col text-[13px] text-[#161829]">
                      {currencyOptions.map((currency) => (
                        <li
                          key={currency.code}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCurrency(currency);
                            setCurrencyMenuOpen(false);
                          }}
                          className={`px-4 py-2 hover:bg-gray-50 hover:text-[#63c0ee] flex items-center justify-between transition-colors cursor-pointer ${
                            selectedCurrency.code === currency.code ? 'bg-gray-50/80 text-[#63c0ee] font-medium' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={currency.flag} alt={currency.name} className="w-[18px] object-contain shadow-2xs" />
                            <span>{currency.name}</span>
                          </div>
                          <span className="text-gray-400 text-xs font-normal">{currency.symbol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Wishlist Icon */}
              {/* <button
                type="button"
                onClick={openWishlist}
                className="relative cursor-pointer flex items-center justify-center border border-[#161829]/25 bg-white/20 hover:bg-white/30 rounded-md w-10 h-10 transition-colors"
                aria-label="Wishlist"
                title="View Saved Properties"
              >
                <Heart size={19} className="text-[#161829]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button> */}

              {/* Cart Icon */}
              <button
                type="button"
                onClick={openCart}
                className="relative cursor-pointer flex items-center justify-center border border-[#161829]/25 bg-white/20 hover:bg-white/30 rounded-md w-10 h-10 transition-colors"
                aria-label="Cart"
                title="View Shopping Cart"
              >
                <ShoppingCart size={19} className="text-[#161829]" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#161829] text-white rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {cartTotalCount}
                </span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-[#161829] p-1"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </header>

          {/* Mobile Search Input */}
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Product..."
                className="w-full px-4 py-2 rounded-full bg-white/50 border border-[#161829]/20 text-[#161829] placeholder-[#161829]/70 focus:bg-white focus:outline-none text-xs"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#161829]">
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 shadow-xl">
            <ul className="flex flex-col gap-3 text-sm font-medium text-[#161829]">
              <li><a href="#" className="block py-1 text-[#63c0ee]">Main Page</a></li>
              <li><a href="#" className="block py-1 hover:text-[#63c0ee]">Shop</a></li>
              <li><a href="#" className="block py-1 hover:text-[#63c0ee]">Services</a></li>
              <li><a href="#" className="block py-1 hover:text-[#63c0ee]">Offers</a></li>
              <li><a href="#" className="block py-1 hover:text-[#63c0ee]">Pages</a></li>
              <li className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('profile');
                      }}
                      className="w-full text-left py-1.5 text-gray-800 hover:text-[#63c0ee] flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-semibold text-[#161829]">Hi, {user.firstName || 'User'}</span>
                      <span className="text-xs bg-[#63c0ee]/15 text-[#63c0ee] px-2 py-0.5 rounded font-bold">Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left py-1 text-rose-600 hover:text-rose-700 text-sm cursor-pointer"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="w-full text-left py-1 text-gray-700 hover:text-[#63c0ee] cursor-pointer"
                    >
                      Log in
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('register');
                      }}
                      className="w-full text-left py-1 text-gray-700 hover:text-[#63c0ee] cursor-pointer"
                    >
                      Create Account
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWishlist();
                  }}
                  className="w-full text-left py-1 text-gray-700 hover:text-[#63c0ee] flex items-center justify-between cursor-pointer"
                >
                  <span>Wishlist</span>
                  <span className="bg-[#63c0ee]/15 text-[#63c0ee] text-xs font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCart();
                  }}
                  className="w-full text-left py-1 text-gray-700 hover:text-[#63c0ee] flex items-center justify-between cursor-pointer"
                >
                  <span>Shopping Cart</span>
                  <span className="bg-[#161829] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartTotalCount}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* 3. Sub Header for Services (div.main-navigationbar 1366x71 matching screenshot exactly) */}
      <div className="main-navigationbar bg-white border-b border-[#6e0ee] border-t border-gray-200">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-[50px] overflow-x-auto no-scrollbar">
            {serviceItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className={`cursor-pointer group flex items-center justify-center gap-3 px-2 lg:px-4 flex-1 h-full ${index !== serviceItems.length - 1 ? 'border-r border-gray-200' : ''
                    }`}
                >
                  <IconComponent
                    size={20}
                    strokeWidth={1}
                    className="text-[#161829] group-hover:text-[#63c0ee] transition-colors flex-shrink-0"
                  />
                  <div className="flex flex-col text-[13px] font-medium text-[#161829] leading-tight select-none">
                    <span>Carry out</span>
                    <span>your service</span>
                  </div>
                  <div className="bg-gray-100 text-gray-400 p-1 rounded-xs ml-1 group-hover:bg-[#161829] group-hover:text-white transition-all flex-shrink-0">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
