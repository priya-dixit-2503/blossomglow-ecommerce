import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Package,
  User,
  LogOut,
  ChevronDown,
  PhoneCall,
  Flame,
  Wand2,
  BookOpen,
  Gift,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Copy
} from 'lucide-react';
import { ANNOUNCEMENT_CONFIG } from '../config/announcements';
import { BRAND_CONFIG } from '../config/brandConfig';
import { UserProfile } from '../types';
import { CandleApiService } from '../services/api';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  currentUser?: UserProfile | null;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenContact: () => void;
  onOpenArchitecture: () => void;
  onOpenTracking?: () => void;
  onOpenScentQuiz?: () => void;
  onOpenCareGuide?: () => void;
  onOpenCustomBlender?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register' | 'admin') => void;
  onOpenOrderHistory?: () => void;
  onLogout?: () => void;
  onNavigateToHome: () => void;
  onNavigateToShop: (category?: string) => void;
  onNavigateToCollections: () => void;
  onNavigateToAbout: () => void;
  onNavigateToGifting: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  currentUser,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAdmin,
  onOpenContact,
  onOpenArchitecture,
  onOpenTracking,
  onOpenScentQuiz,
  onOpenCareGuide,
  onOpenCustomBlender,
  onOpenAuth,
  onOpenOrderHistory,
  onLogout,
  onNavigateToHome,
  onNavigateToShop,
  onNavigateToCollections,
  onNavigateToAbout,
  onNavigateToGifting,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [shopMegaOpen, setShopMegaOpen] = useState(false);
  const [activeAnnouncementIdx, setActiveAnnouncementIdx] = useState(0);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const shopMegaRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Check Spring Boot status periodically in background
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      const live = await CandleApiService.checkBackendHealth();
      if (isMounted) setIsBackendConnected(live);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-rotate announcement
  useEffect(() => {
    if (!ANNOUNCEMENT_CONFIG.autoRotate || ANNOUNCEMENT_CONFIG.announcements.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENT_CONFIG.announcements.length);
    }, ANNOUNCEMENT_CONFIG.rotationIntervalMs);
    return () => clearInterval(interval);
  }, []);

  // Click outside listener for flyouts
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopMegaRef.current && !shopMegaRef.current.contains(e.target as Node)) {
        setShopMegaOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentAnnouncement =
    ANNOUNCEMENT_CONFIG.announcements[activeAnnouncementIdx] || ANNOUNCEMENT_CONFIG.announcements[0];

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const categories = [
    {
      name: 'Pillar Candles',
      filterName: 'Pillar Candles',
      desc: 'Smokeless, long-burning organic soy pillars with hand-poured fluting',
      tag: 'Bestseller',
      icon: Flame,
    },
    {
      name: 'Jar & Container Candles',
      filterName: 'Jar & Container Candles',
      desc: 'Amber apothecary glass infused with therapeutic botanical oils',
      tag: 'Aromatherapy',
      icon: Sparkles,
    },
    {
      name: 'Floating & Urli Sets',
      filterName: 'Floating & Urli Sets',
      desc: 'Artisan lotus water blooms with hammered brass & copper finishes',
      tag: 'Festive',
      icon: Gift,
    },
    {
      name: 'Sculptural & Sacred Art',
      filterName: 'Sculptural Candles',
      desc: 'Buddha serenity, architectural ribbed, and organic botanical forms',
      tag: 'Artisan',
      icon: Wand2,
    },
    {
      name: 'Gift Hampers & Dough Bowls',
      filterName: 'Gift Hampers',
      desc: 'Solid Himalayan wood bowls & evil eye talisman luxury gift boxes',
      tag: 'Signature',
      icon: Gift,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* 1. ELEGANT ANNOUNCEMENT RIBBON */}
      {ANNOUNCEMENT_CONFIG.enabled && (
        <div className="bg-[#181513] text-[#FAF8F5] px-4 py-2 sm:py-2.5 text-xs border-b border-[#2A231E] relative overflow-hidden select-none">
          {/* Subtle warm glow background accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/20 via-amber-500/10 to-amber-950/20 pointer-events-none" />

          <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
            {/* Left: Artisan craft badge */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-amber-200/80 font-medium tracking-wider uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
              <span>100% Organic Soy Wax · Hand-Poured in India</span>
            </div>

            {/* Center: Rotating announcement with smooth luxury aesthetic */}
            <div className="mx-auto flex items-center justify-center gap-2.5 text-center text-xs">
              <span className="text-amber-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline tracking-wider font-semibold">
                  {currentAnnouncement.badge || 'BlossomGlow'}
                </span>
              </span>

              <span className="text-stone-500 hidden sm:inline">•</span>

              <span className="text-stone-200 font-light tracking-wide text-[11px] sm:text-xs">
                {currentAnnouncement.text}
              </span>

              {currentAnnouncement.code && (
                <button
                  onClick={(e) => handleCopyCode(currentAnnouncement.code!, e)}
                  className="hidden md:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 font-mono text-[10px] tracking-wider transition-colors cursor-pointer"
                  title="Click to copy promo code"
                >
                  {copiedCode === currentAnnouncement.code ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5 text-amber-400" />
                      <span>{currentAnnouncement.code}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Right: Customer Services & Discreet Specs */}
            <div className="hidden lg:flex items-center gap-4 text-[11px] text-stone-300">
              {onOpenTracking && (
                <button
                  onClick={onOpenTracking}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Package className="w-3.5 h-3.5 text-amber-400/90" />
                  <span>Track Order</span>
                </button>
              )}

              <button
                onClick={onOpenContact}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400/90" />
                <span>Concierge</span>
              </button>

              {/* Discreet Spring Boot / Architecture Spec Link */}
              <button
                onClick={onOpenArchitecture}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-colors text-[10px] font-mono cursor-pointer text-stone-400 hover:text-stone-200"
                title="View Spring Boot 8080 API Specs & Architecture"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{isBackendConnected ? 'API 8080' : 'API Specs'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN LUXURY NAVIGATION BAR */}
      <div className="relative bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_2px_15px_rgba(20,15,10,0.03)]">
        {/* Subtle gold hairline finish at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-[82px] flex items-center justify-between">
          {/* Left: Mobile Toggle & Brand Emblem */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-lg focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo & Insignia */}
            <button
              onClick={onNavigateToHome}
              className="group cursor-pointer focus:outline-none flex items-center gap-3 shrink-0 py-1 text-left"
            >
              {/* Bespoke Botanical Candle Flame Insignia */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-600/15 via-amber-500/10 to-amber-700/20 border border-amber-600/30 flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.12)] group-hover:shadow-[0_0_22px_rgba(217,119,6,0.28)] transition-all">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700 group-hover:scale-105 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Subtle botanical petal wings */}
                  <path
                    d="M12 2C12 2 7.5 6.5 7.5 11.5C7.5 13.8 8.5 15.8 10 17.2C8.8 16.7 7.9 15.6 7.4 14.3C6.4 11.6 7.8 8 7.8 8C7.8 8 4.5 10.2 4.5 14C4.5 17.8 7.6 20.8 11.5 20.8C11.7 20.8 11.8 20.8 12 20.8C12.2 20.8 12.3 20.8 12.5 20.8C16.4 20.8 19.5 17.8 19.5 14C19.5 10.2 16.2 8 16.2 8C16.2 8 17.6 11.6 16.6 14.3C16.1 15.6 15.2 16.7 14 17.2C15.5 15.8 16.5 13.8 16.5 11.5C16.5 6.5 12 2 12 2Z"
                    fill="url(#botanicalPetals)"
                    stroke="none"
                    opacity="0.22"
                  />
                  {/* Glowing Outer Candle Flame */}
                  <path
                    d="M12 3.5C12 3.5 8 7.8 8 12C8 14.4 9.8 16.5 12 16.5C14.2 16.5 16 14.4 16 12C16 7.8 12 3.5 12 3.5Z"
                    fill="url(#outerFlameGrad)"
                    stroke="#B45309"
                    strokeWidth="1.2"
                  />
                  {/* Warm Golden Candle Core */}
                  <path
                    d="M12 8.5C12 8.5 10 10.5 10 12.5C10 13.6 10.9 14.5 12 14.5C13.1 14.5 14 13.6 14 12.5C14 10.5 12 8.5 12 8.5Z"
                    fill="#FDE68A"
                  />
                  <defs>
                    <linearGradient id="outerFlameGrad" x1="12" y1="3.5" x2="12" y2="16.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F59E0B" />
                      <stop offset="0.6" stopColor="#D97706" />
                      <stop offset="1" stopColor="#92400E" />
                    </linearGradient>
                    <linearGradient id="botanicalPetals" x1="4.5" y1="2" x2="19.5" y2="20.8" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D97706" />
                      <stop offset="1" stopColor="#78350F" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col text-left leading-none">
                <span className="font-editorial text-2xl sm:text-[28px] font-medium tracking-[0.02em] text-stone-900 group-hover:text-amber-900 transition-colors whitespace-nowrap">
                  BlossomGlow
                </span>
                <span className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.28em] text-stone-500 font-medium block mt-1 whitespace-nowrap group-hover:text-amber-800 transition-colors">
                  Artisanal Botanical Candles
                </span>
              </div>
            </button>
          </div>

          {/* Center: Refined High-End Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-xs font-semibold uppercase tracking-[0.14em] text-stone-700">
            {/* Home Link */}
            <button
              onClick={onNavigateToHome}
              className="hover:text-stone-950 transition-colors cursor-pointer relative py-2 group"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-700 group-hover:w-full transition-all duration-300" />
            </button>

            {/* Shop Creations with Mega-Menu Flyout */}
            <div
              className="relative py-2"
              ref={shopMegaRef}
              onMouseEnter={() => setShopMegaOpen(true)}
              onMouseLeave={() => setShopMegaOpen(false)}
            >
              <button
                onClick={() => {
                  onNavigateToShop();
                  setShopMegaOpen(false);
                }}
                className="hover:text-stone-950 transition-colors cursor-pointer flex items-center gap-1 group"
              >
                <span>Shop Creations</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 transition-transform duration-200 ${
                    shopMegaOpen ? 'rotate-180 text-stone-900' : ''
                  }`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-700 group-hover:w-full transition-all duration-300" />
              </button>

              {/* Mega-Flyout Popover */}
              {shopMegaOpen && (
                <div className="absolute top-full -left-20 w-[580px] bg-[#FAF8F5] border border-stone-200/90 rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200/70">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-semibold">
                      Curated Candle Atelier
                    </span>
                    <button
                      onClick={() => {
                        onNavigateToShop();
                        setShopMegaOpen(false);
                      }}
                      className="text-[11px] font-semibold text-stone-600 hover:text-amber-800 flex items-center gap-1 transition-colors normal-case"
                    >
                      <span>View All Creations</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => {
                            onNavigateToShop(cat.filterName);
                            setShopMegaOpen(false);
                          }}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/60 hover:shadow-xs transition-all text-left group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                            <Icon className="w-4 h-4 text-amber-800" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case">
                                {cat.name}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-medium">
                                {cat.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 normal-case line-clamp-2 mt-0.5 leading-snug">
                              {cat.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Quick Feature bar in Flyout */}
                  <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600 normal-case">
                    <span className="flex items-center gap-1.5 text-stone-600">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Complimentary gift packaging on all orders
                    </span>
                    {onOpenScentQuiz && (
                      <button
                        onClick={() => {
                          setShopMegaOpen(false);
                          onOpenScentQuiz();
                        }}
                        className="text-amber-800 hover:text-amber-950 font-medium underline underline-offset-2 cursor-pointer"
                      >
                        Take Scent Quiz →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Curated Collections */}
            <button
              onClick={onNavigateToCollections}
              className="hover:text-stone-950 transition-colors cursor-pointer relative py-2 group"
            >
              <span>Collections</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-700 group-hover:w-full transition-all duration-300" />
            </button>

            {/* Gift Sets / Hampers */}
            <button
              onClick={onNavigateToGifting}
              className="hover:text-stone-950 transition-colors cursor-pointer relative py-2 group flex items-center gap-1.5"
            >
              <span>Gift Hampers</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[9px] font-mono font-medium tracking-normal">
                Curated
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-700 group-hover:w-full transition-all duration-300" />
            </button>

            {/* Custom Scent Lab / Candle Blender */}
            {onOpenCustomBlender && (
              <button
                onClick={onOpenCustomBlender}
                className="hover:text-amber-900 transition-colors cursor-pointer relative py-2 group flex items-center gap-1 text-amber-900"
              >
                <Wand2 className="w-3 h-3 text-amber-600" />
                <span>Custom Blend</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-700 group-hover:w-full transition-all duration-300" />
              </button>
            )}

            {/* Atelier Story / About */}
            <button
              onClick={onNavigateToAbout}
              className="hover:text-stone-950 transition-colors cursor-pointer relative py-2 group"
            >
              <span>Atelier</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-700 group-hover:w-full transition-all duration-300" />
            </button>

            {/* Candle Care Guide */}
            {onOpenCareGuide && (
              <button
                onClick={onOpenCareGuide}
                className="hover:text-stone-950 transition-colors cursor-pointer relative py-2 group text-stone-600"
              >
                <span>Care Guide</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-700 group-hover:w-full transition-all duration-300" />
              </button>
            )}
          </nav>

          {/* Right: Actions (Search, Fragrance Finder, Account, Wishlist, Shopping Bag) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
              aria-label="Search creations"
              title="Search candles & scents"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {/* Fragrance Finder / Scent Quiz Button */}
            {onOpenScentQuiz && (
              <button
                onClick={onOpenScentQuiz}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-600/20 text-amber-900 transition-colors text-xs font-medium cursor-pointer"
                title="Discover your signature botanical candle scent"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-[11px] font-semibold tracking-wider uppercase">Scent Quiz</span>
              </button>
            )}

            {/* Wishlist Button with Terracotta Counter */}
            <button
              onClick={onOpenWishlist}
              className="p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors relative cursor-pointer"
              aria-label="Wishlist"
              title="Saved Favorites"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Account / Sign In Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-stone-300/80 hover:border-amber-700/60 bg-white/70 hover:bg-white transition-all text-xs font-medium cursor-pointer shadow-2xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#29221C] text-amber-200 flex items-center justify-center font-bold text-[11px]">
                      {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:inline text-stone-800 max-w-[85px] truncate font-medium">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-[#FAF8F5] rounded-2xl shadow-xl border border-stone-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-stone-200/70">
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {currentUser.fullName}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-mono">
                          {currentUser.role === 'ROLE_ADMIN' ? 'Atelier Administrator' : 'Candle Connoisseur'}
                        </span>
                      </div>

                      <div className="py-1">
                        {onOpenOrderHistory && (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenOrderHistory();
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-200/60 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Package className="w-4 h-4 text-amber-800" />
                            <span>My Order History</span>
                          </button>
                        )}

                        {onOpenTracking && (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenTracking();
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-200/60 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Package className="w-4 h-4 text-stone-600" />
                            <span>Live Courier Tracker</span>
                          </button>
                        )}

                        {currentUser.role === 'ROLE_ADMIN' && (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenAdmin();
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-amber-900 font-medium hover:bg-amber-100/60 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-700" />
                            <span>Admin Management Panel</span>
                          </button>
                        )}
                      </div>

                      <div className="border-t border-stone-200/70 my-1" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-300 hover:border-amber-700 text-stone-700 hover:text-amber-900 hover:bg-stone-50 transition-colors text-xs font-medium cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Bag: Chic Deep Espresso Obsidian & Golden Accent */}
            <button
              onClick={onOpenCart}
              className="p-2 sm:px-3.5 sm:py-2 text-[#FAF8F5] bg-[#1C1815] hover:bg-[#2A231E] rounded-full transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group ml-1"
              aria-label="Shopping Cart"
              title="View Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4.5 h-4.5 text-amber-300 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-amber-400 text-stone-950 rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase text-amber-100">
                Bag
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-stone-300 shadow-2xl px-5 py-6 space-y-5 animate-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Quick Mobile Search */}
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch();
            }}
            className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-500 text-xs cursor-pointer shadow-2xs"
          >
            <Search className="w-4 h-4 text-stone-400" />
            <span>Search botanical candles, scents, gifts...</span>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 pb-4 border-b border-stone-200 text-sm font-semibold uppercase tracking-wider text-stone-800">
            <button
              onClick={() => {
                onNavigateToHome();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-xl hover:bg-stone-200/50 transition-colors"
            >
              Home
            </button>

            <div className="py-2 px-3 text-[11px] font-mono text-amber-800 font-bold uppercase tracking-widest">
              Candle Collections
            </div>

            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  onNavigateToShop(cat.filterName);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-4 rounded-xl hover:bg-white text-xs font-medium normal-case flex items-center justify-between text-stone-700 hover:text-stone-950 transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  {cat.tag}
                </span>
              </button>
            ))}

            <button
              onClick={() => {
                onNavigateToGifting();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-xl hover:bg-stone-200/50 text-amber-900 transition-colors"
            >
              Luxury Gift Hampers
            </button>

            {onOpenCustomBlender && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomBlender();
                }}
                className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-stone-200/50 text-amber-900 flex items-center gap-2 transition-colors"
              >
                <Wand2 className="w-4 h-4 text-amber-700" />
                <span>Custom Candle Blender</span>
              </button>
            )}

            {onOpenScentQuiz && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenScentQuiz();
                }}
                className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-stone-200/50 text-amber-900 flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Fragrance Aura Quiz</span>
              </button>
            )}

            {onOpenCareGuide && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCareGuide();
                }}
                className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-stone-200/50 text-stone-700 flex items-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Candle Care Guide</span>
              </button>
            )}

            <button
              onClick={() => {
                onNavigateToAbout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-xl hover:bg-stone-200/50 transition-colors"
            >
              Atelier Story &amp; Craft
            </button>

            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-xl hover:bg-stone-200/50 transition-colors"
            >
              Contact Concierge
            </button>
          </div>

          {/* Mobile Footer Actions */}
          <div className="space-y-3 pt-1 text-xs">
            {onOpenTracking && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 hover:border-amber-300 flex items-center justify-between text-stone-800 font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-700" />
                  Track Existing Order
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenArchitecture();
              }}
              className="w-full py-2 px-3 rounded-xl bg-stone-100 text-stone-500 text-[11px] font-mono flex items-center justify-between"
            >
              <span>Spring Boot 8080 API Specs</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
