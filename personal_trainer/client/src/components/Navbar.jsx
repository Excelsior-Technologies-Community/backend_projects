import React, { useState } from 'react';
import { 
  ShoppingCart, 
  User, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Menu, 
  X,
  Heart
} from 'lucide-react';
import { useAuth, useCartWishlist } from '../context/AppContext';

// Flag & Currency SVG Assets
import enFlag from '../assets/en.svg';
import arFlag from '../assets/ar.svg';
import deFlag from '../assets/de.svg';
import esFlag from '../assets/es.svg';
import audCurrency from '../assets/aud.svg';
import cadCurrency from '../assets/cad.svg';
import inrCurrency from '../assets/inr.svg';
import usdCurrency from '../assets/usd.svg';

// Collections Mega Menu Images
import crossTrainerImg from '../assets/woman-working-out-gym.webp';
import gymEquipmentImg from '../assets/kettlebell-fitness-still-life.webp';
import proteinPowderImg from '../assets/flat-lay-protein-powder-supplement-pills-weights-yellow-background.webp';
import treadmillsImg from '../assets/hightech-treadmill-modern-welllit-gym-environment.webp';

export const Navbar = ({ currentTab, setTab, onOpenAuthModal, onOpenCartDrawer }) => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, wishlist, compareList, setCompareModalOpen } = useCartWishlist();
  
  const [mobileOpen, setMobileOpen] = useState(false);

  // Active Dropdown state
  const [activeDropdown, setActiveDropdown] = useState(null); // 'pages', 'blog', 'collections', 'lang', 'curr', 'user'

  // Selected Language & Currency
  const [selectedLang, setSelectedLang] = useState({ code: 'en', name: 'English', flag: enFlag });
  const [selectedCurr, setSelectedCurr] = useState({ code: 'INR', symbol: '₹', icon: inrCurrency });

  const languages = [
    { code: 'en', name: 'English', flag: enFlag },
    { code: 'ar', name: 'العربية', flag: arFlag },
    { code: 'de', name: 'Deutsch', flag: deFlag },
    { code: 'es', name: 'Español', flag: esFlag }
  ];

  const currencies = [
    { code: 'AUD', symbol: '$', icon: audCurrency, label: 'AUD $' },
    { code: 'CAD', symbol: '$', icon: cadCurrency, label: 'CAD $' },
    { code: 'INR', symbol: '₹', icon: inrCurrency, label: 'INR ₹' },
    { code: 'USD', symbol: '$', icon: usdCurrency, label: 'USD $' }
  ];

  const pagesList = [
    { name: 'ABOUT US', tab: 'about' },
    { name: 'CONTACT US', tab: 'contact' },
    { name: "FAQ'S", tab: 'about' },
    { name: 'SERVICES', tab: 'memberships' },
    { name: 'SHIPPING & DELIVERY', tab: 'about' },
    { name: 'PRIVACY POLICY', tab: 'about' },
    { name: 'TERMS & CONDITIONS', tab: 'about' }
  ];

  const blogList = [
    { name: 'ARTICLE PAGE', tab: 'contact' },
    { name: 'BLOG PAGE', tab: 'contact' }
  ];

  const collectionItems = [
    { name: 'CROSS TRAINER', image: crossTrainerImg, catId: 'cat-1' },
    { name: 'GYM EQUIPMENT', image: gymEquipmentImg, catId: 'cat-1' },
    { name: 'PROTIEN POWEDER', image: proteinPowderImg, catId: 'cat-2' },
    { name: 'TREDMILLS', image: treadmillsImg, catId: 'cat-1' }
  ];

  return (
    <header 
      style={{ position: 'sticky', top: 0, zIndex: 100 }}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {/* 1. Top Announcement Bar */}
      <div style={{
        background: '#d4ff00',
        color: '#000000',
        fontWeight: 700,
        fontSize: '0.85rem',
        padding: '0.55rem 1rem',
        textAlign: 'center',
        letterSpacing: '0.02em',
        transition: 'background 0.3s ease'
      }}>
        10% Discount On The First Order In Dietary!
      </div>

      {/* 2. Main Navigation Bar */}
      <div style={{
        background: '#000000',
        padding: '0 2rem',
        position: 'relative'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '75px'
        }}>
          {/* Brand Logo */}
          <div 
            onClick={() => setTab('home')}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#ffffff',
              lineHeight: 1
            }}>
              TRAINER
            </div>
            <div style={{
              fontSize: '0.62rem',
              letterSpacing: '0.35em',
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase',
              marginTop: '2px',
              fontWeight: 600
            }}>
              PERSONAL
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', gap: '2rem', alignItems: 'center', height: '100%' }} className="desktop-nav">
            <style>{`
              @media (min-width: 992px) {
                .desktop-nav { display: flex !important; }
                .mobile-toggle { display: none !important; }
              }
            `}</style>

            {/* PLANS */}
            <button
              onClick={() => setTab('memberships')}
              onMouseEnter={() => setActiveDropdown(null)}
              style={{
                color: currentTab === 'memberships' ? '#d4ff00' : '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '1.5rem 0',
                transition: 'color 0.25s ease'
              }}
              onMouseEnterCapture={(e) => e.currentTarget.style.color = '#d4ff00'}
              onMouseLeave={(e) => {
                if (currentTab !== 'memberships') e.currentTarget.style.color = '#ffffff';
              }}
            >
              PLANS
            </button>

            {/* COLLECTIONS */}
            <div
              onMouseEnter={() => setActiveDropdown('collections')}
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <button
                onClick={() => setTab('shop')}
                style={{
                  color: activeDropdown === 'collections' || currentTab === 'shop' ? '#d4ff00' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '1.5rem 0',
                  position: 'relative',
                  transition: 'color 0.25s ease'
                }}
              >
                COLLECTIONS
                <span style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#d4ff00',
                  transform: activeDropdown === 'collections' ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </button>
            </div>

            {/* PAGES */}
            <div
              onMouseEnter={() => setActiveDropdown('pages')}
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <button
                onClick={() => setTab('about')}
                style={{
                  color: activeDropdown === 'pages' ? '#d4ff00' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '1.5rem 0',
                  position: 'relative',
                  transition: 'color 0.25s ease'
                }}
              >
                PAGES
                <span style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#d4ff00',
                  transform: activeDropdown === 'pages' ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </button>

              {/* Pages Dropdown */}
              <div 
                className={`dropdown-enter ${activeDropdown === 'pages' ? 'dropdown-active' : ''}`}
                style={{
                  position: 'absolute',
                  top: '75px',
                  left: '0',
                  width: '240px',
                  background: '#000000',
                  border: '1px solid #1c1c1c',
                  borderTop: '2px solid #d4ff00',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.95)',
                  zIndex: 200,
                  padding: '0.8rem 0'
                }}
              >
                {pagesList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setTab(item.tab);
                      setActiveDropdown(null);
                    }}
                    style={{
                      padding: '0.65rem 1.5rem',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#d4ff00';
                      e.currentTarget.style.paddingLeft = '1.75rem';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.paddingLeft = '1.5rem';
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            {/* BLOG */}
            <div
              onMouseEnter={() => setActiveDropdown('blog')}
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <button
                onClick={() => setTab('contact')}
                style={{
                  color: activeDropdown === 'blog' ? '#d4ff00' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '1.5rem 0',
                  position: 'relative',
                  transition: 'color 0.25s ease'
                }}
              >
                BLOG
                <span style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#d4ff00',
                  transform: activeDropdown === 'blog' ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </button>

              {/* Blog Dropdown */}
              <div 
                className={`dropdown-enter ${activeDropdown === 'blog' ? 'dropdown-active' : ''}`}
                style={{
                  position: 'absolute',
                  top: '75px',
                  left: '0',
                  width: '210px',
                  background: '#000000',
                  border: '1px solid #1c1c1c',
                  borderTop: '2px solid #d4ff00',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.95)',
                  zIndex: 200,
                  padding: '0.8rem 0'
                }}
              >
                {blogList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setTab(item.tab);
                      setActiveDropdown(null);
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#d4ff00';
                      e.currentTarget.style.paddingLeft = '1.75rem';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.paddingLeft = '1.5rem';
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            {/* TRAINERS */}
            <button
              onClick={() => setTab('about')}
              onMouseEnter={() => setActiveDropdown(null)}
              style={{
                color: currentTab === 'about' ? '#d4ff00' : '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '1.5rem 0',
                transition: 'color 0.25s ease'
              }}
            >
              TRAINERS
            </button>
          </nav>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', height: '100%' }}>
            {/* Language Picker Dropdown */}
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveDropdown('lang')}
            >
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.4rem 0'
                }}
              >
                <img src={selectedLang.flag} alt={selectedLang.name} style={{ width: '18px', height: '13px', objectFit: 'cover' }} />
                <span>{selectedLang.name}</span>
                {activeDropdown === 'lang' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <div 
                className={`dropdown-enter ${activeDropdown === 'lang' ? 'dropdown-active' : ''}`}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '150px',
                  background: '#ffffff',
                  color: '#000000',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 250,
                  borderRadius: '2px',
                  padding: '0.3rem 0'
                }}
              >
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      setActiveDropdown(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.55rem 1rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: selectedLang.code === lang.code ? '#f3f4f6' : 'transparent',
                      color: '#111827'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => {
                      if (selectedLang.code !== lang.code) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <img src={lang.flag} alt={lang.name} style={{ width: '18px', height: '13px', objectFit: 'cover' }} />
                    <span>{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Picker Dropdown */}
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveDropdown('curr')}
            >
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.4rem 0'
                }}
              >
                <img src={selectedCurr.icon} alt={selectedCurr.code} style={{ width: '18px', height: '13px', objectFit: 'cover' }} />
                <span>{selectedCurr.code}</span>
                {activeDropdown === 'curr' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <div 
                className={`dropdown-enter ${activeDropdown === 'curr' ? 'dropdown-active' : ''}`}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '140px',
                  background: '#ffffff',
                  color: '#000000',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 250,
                  borderRadius: '2px',
                  padding: '0.3rem 0'
                }}
              >
                {currencies.map(curr => (
                  <div
                    key={curr.code}
                    onClick={() => {
                      setSelectedCurr(curr);
                      setActiveDropdown(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.55rem 1rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: selectedCurr.code === curr.code ? '#e5e7eb' : 'transparent',
                      color: '#111827'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => {
                      if (selectedCurr.code !== curr.code) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <img src={curr.icon} alt={curr.code} style={{ width: '18px', height: '13px', objectFit: 'cover' }} />
                    <span>{curr.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* =========================================================================
                USER LOGO & HOVER DROPDOWN (Replicating Image A: Log in, Create Account, Wishlist, Compare)
               ========================================================================= */}
            <div 
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => setActiveDropdown('user')}
            >
              <button
                onClick={onOpenAuthModal}
                style={{
                  color: activeDropdown === 'user' ? '#d4ff00' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                title="Account Menu"
              >
                <User size={22} />
              </button>

              {/* User Hover Menu */}
              <div 
                className={`dropdown-enter ${activeDropdown === 'user' ? 'dropdown-active' : ''}`}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '180px',
                  background: '#000000',
                  border: '1px solid #1c1c1c',
                  borderTop: '2px solid #d4ff00',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.95)',
                  zIndex: 350,
                  padding: '0.6rem 0'
                }}
              >
                {user ? (
                  <>
                    <div style={{ padding: '0.6rem 1.2rem', borderBottom: '1px solid #1c1c1c', marginBottom: '0.3rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{user.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#d4ff00' }}>{user.role}</div>
                    </div>
                    <div
                      onClick={() => { setTab('profile'); setActiveDropdown(null); }}
                      style={{ padding: '0.55rem 1.2rem', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
                    >
                      My Profile &amp; Orders
                    </div>
                    {isAdmin && (
                      <div
                        onClick={() => { setTab('admin-dashboard'); setActiveDropdown(null); }}
                        style={{ padding: '0.55rem 1.2rem', color: '#d4ff00', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Admin Portal
                      </div>
                    )}
                    <div
                      onClick={() => { setTab('wishlist'); setActiveDropdown(null); }}
                      style={{ padding: '0.55rem 1.2rem', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
                    >
                      Wishlist ({wishlist.length})
                    </div>
                    <div
                      onClick={() => { setCompareModalOpen(true); setActiveDropdown(null); }}
                      style={{ padding: '0.55rem 1.2rem', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
                    >
                      Compare {compareList?.length > 0 && `(${compareList.length})`}
                    </div>
                    <div
                      onClick={() => { logout(); setActiveDropdown(null); }}
                      style={{ padding: '0.55rem 1.2rem', color: '#f43f5e', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', borderTop: '1px solid #1c1c1c', marginTop: '0.3rem' }}
                    >
                      Log Out
                    </div>
                  </>
                ) : (
                  <>
                    {/* Log in */}
                    <div
                      onClick={() => { onOpenAuthModal(); setActiveDropdown(null); }}
                      style={{
                        padding: '0.65rem 1.3rem',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#d4ff00';
                        e.currentTarget.style.paddingLeft = '1.5rem';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.paddingLeft = '1.3rem';
                      }}
                    >
                      Log in
                    </div>

                    {/* Create Account */}
                    <div
                      onClick={() => { onOpenAuthModal(); setActiveDropdown(null); }}
                      style={{
                        padding: '0.65rem 1.3rem',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#d4ff00';
                        e.currentTarget.style.paddingLeft = '1.5rem';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.paddingLeft = '1.3rem';
                      }}
                    >
                      Create Account
                    </div>

                    {/* Wishlist */}
                    <div
                      onClick={() => { setTab('wishlist'); setActiveDropdown(null); }}
                      style={{
                        padding: '0.65rem 1.3rem',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#d4ff00';
                        e.currentTarget.style.paddingLeft = '1.5rem';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.paddingLeft = '1.3rem';
                      }}
                    >
                      Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                    </div>

                    {/* Compare */}
                    <div
                      onClick={() => { setCompareModalOpen(true); setActiveDropdown(null); }}
                      style={{
                        padding: '0.65rem 1.3rem',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#d4ff00';
                        e.currentTarget.style.paddingLeft = '1.5rem';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.paddingLeft = '1.3rem';
                      }}
                    >
                      Compare {compareList?.length > 0 && `(${compareList.length})`}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* BOOK HERE Button */}
            <button
              onClick={() => setTab('memberships')}
              style={{
                background: '#d4ff00',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.82rem',
                letterSpacing: '0.05em',
                padding: '0.65rem 1.25rem',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#bfff00';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#d4ff00';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>BOOK HERE</span>
              <div style={{
                border: '1px dashed #000000',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowRight size={13} strokeWidth={3} />
              </div>
            </button>

            {/* Wishlist Header Trigger */}
            <button
              onClick={() => {
                setTab('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                position: 'relative',
                color: wishlist.length > 0 ? '#ff2d55' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: 'transparent',
                border: 'none'
              }}
              title="My Wishlist"
            >
              <Heart size={24} fill={wishlist.length > 0 ? '#ff2d55' : 'none'} strokeWidth={2} />
              {wishlist.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  background: '#ff2d55',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(255, 45, 85, 0.6)'
                }}>
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon with Slide Drawer Trigger */}
            <button
              onClick={onOpenCartDrawer}
              style={{
                position: 'relative',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.4rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              title="Open Cart Drawer"
            >
              <ShoppingCart size={24} />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                background: '#d4ff00',
                color: '#000000',
                fontSize: '0.65rem',
                fontWeight: 900,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: '#fff', padding: '0.4rem' }}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MEGA MENU: COLLECTIONS */}
        <div 
          className={`megamenu-wrapper ${activeDropdown === 'collections' ? 'megamenu-open' : ''}`}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#000000',
            borderTop: '2px solid #d4ff00',
            borderBottom: '1px solid #1c1c1c',
            boxShadow: '0 25px 50px rgba(0,0,0,0.98)',
            zIndex: 300
          }}
          onMouseEnter={() => setActiveDropdown('collections')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2rem'
            }}>
              {collectionItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setTab('shop');
                    setActiveDropdown(null);
                  }}
                  className="collection-card"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '230px',
                    overflow: 'hidden',
                    background: '#0a0a0a',
                    marginBottom: '1.2rem',
                    border: '1px solid #1c1c1c',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.6)'
                  }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </div>
                  <span style={{
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'color 0.25s ease'
                  }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          background: '#000000',
          borderBottom: '1px solid #222222',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <button
            onClick={() => { setTab('memberships'); setMobileOpen(false); }}
            style={{ textAlign: 'left', padding: '0.6rem 0', fontSize: '1rem', fontWeight: 700, color: '#fff' }}
          >
            PLANS
          </button>
          <button
            onClick={() => { setTab('shop'); setMobileOpen(false); }}
            style={{ textAlign: 'left', padding: '0.6rem 0', fontSize: '1rem', fontWeight: 700, color: '#fff' }}
          >
            COLLECTIONS
          </button>
          <button
            onClick={() => { setTab('about'); setMobileOpen(false); }}
            style={{ textAlign: 'left', padding: '0.6rem 0', fontSize: '1rem', fontWeight: 700, color: '#fff' }}
          >
            PAGES
          </button>
          <button
            onClick={() => { setTab('contact'); setMobileOpen(false); }}
            style={{ textAlign: 'left', padding: '0.6rem 0', fontSize: '1rem', fontWeight: 700, color: '#fff' }}
          >
            BLOG
          </button>
          <button
            onClick={() => { setTab('about'); setMobileOpen(false); }}
            style={{ textAlign: 'left', padding: '0.6rem 0', fontSize: '1rem', fontWeight: 700, color: '#fff' }}
          >
            TRAINERS
          </button>
        </div>
      )}
    </header>
  );
};
