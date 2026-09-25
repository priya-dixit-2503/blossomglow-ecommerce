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
  Check,
  Copy,
  Layers,
  Compass,
  Star,
  Clock,
  Sparkle
} from 'lucide-react';
import { ANNOUNCEMENT_CONFIG } from '../config/announcements';
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

type ActiveDropdown = 'shop' | 'collections' | 'gifts' | 'custom' | 'story' | null;

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
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeAnnouncementIdx, setActiveAnnouncementIdx] = useState(0);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Accordion state for mobile menu
  const [mobileExpandedSection, setMobileExpandedSection] = useState<ActiveDropdown>('shop');

  const navContainerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Click outside & Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (menu: ActiveDropdown) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const currentAnnouncement =
    ANNOUNCEMENT_CONFIG.announcements[activeAnnouncementIdx] || ANNOUNCEMENT_CONFIG.announcements[0];

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Shop Categories
  const shopCategories = [
    {
      name: 'Pillar Candles',
      filterName: 'Pillar Candles',
      desc: 'Smokeless, long-burning organic soy pillars with hand-carved fluting',
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
      icon: Layers,
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

  // Signature Collections
  const collectionsList = [
    {
      name: 'Botanical Bloom Edition',
      notes: 'Damask Rose, Wild Jasmine & Amber',
      desc: 'Hand-sculpted 3D blooming roses crowned in organic soy wax',
      category: 'Gift Candles',
      highlight: 'Top Rated',
    },
    {
      name: 'Tropical Spice Sanctuary',
      notes: 'Cinnamon Bark, Cardamom & Reclaimed Coconut',
      desc: 'Poured in genuine reclaimed coastal coconut halves',
      category: 'Scented Candles',
      highlight: 'Eco-Luxury',
    },
    {
      name: 'Nirvana Sanctuary',
      notes: 'Sandalwood, Oudh & Golden Amber',
      desc: 'Peaceful sculpted Buddha in meditative Dhyana mudra',
      category: 'Meditation Candles',
      highlight: 'Zen Altar',
    },
    {
      name: 'Zenith Bloom Lotus',
      notes: 'White Lotus Petals & Green Bamboo',
      desc: 'Sculpted lotus flower petals with crackling wood wicks',
      category: 'Decorative Candles',
      highlight: 'New Arrival',
    },
    {
      name: 'Modernist Sanctuary',
      notes: 'Sea Salt, Sage & Crisp Citrus',
      desc: 'Architectural ribbed candle creating rhythmic geometric shadows',
      category: 'Home Décor Candles',
      highlight: 'Minimalist',
    },
    {
      name: 'Heritage Hearth Dough Bowls',
      notes: 'Smoked Vanilla, Pinecones & Warm Cedar',
      desc: 'Solid hand-carved reclaimed wood boat with dried botanicals',
      category: 'Scented Candles',
      highlight: 'Centerpiece',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all select-none">
      {/* 1. TOP ANNOUNCEMENT RIBBON */}
      {ANNOUNCEMENT_CONFIG.enabled && (
        <div className="bg-[#181513] text-[#FAF8F5] px-4 py-2 sm:py-2.5 text-xs border-b border-[#2A231E] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/20 via-amber-500/10 to-amber-950/20 pointer-events-none" />

          <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
            {/* Left: Artisan craft badge */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-amber-200/80 font-medium tracking-wider uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/90 animate-pulse" />
              <span>100% Organic Soy Wax · Hand-Poured in India</span>
            </div>

            {/* Center: Rotating announcement with promo code copy */}
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

            {/* Right: Quick Concierge, Live Tracking & API badge */}
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

      {/* 2. MAIN REDESIGNED LUXURY HEADER */}
      <div
        ref={navContainerRef}
        className="relative bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_2px_15px_rgba(20,15,10,0.03)]"
      >
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-[84px] flex items-center justify-between">
          {/* LEFT: Mobile Menu Button & BlossomGlow Logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-lg focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo & Insignia */}
            <button
              onClick={() => {
                closeAllMenus();
                onNavigateToHome();
              }}
              className="group cursor-pointer focus:outline-none flex items-center gap-3 py-1 text-left"
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
                  <path
                    d="M12 2C12 2 7.5 6.5 7.5 11.5C7.5 13.8 8.5 15.8 10 17.2C8.8 16.7 7.9 15.6 7.4 14.3C6.4 11.6 7.8 8 7.8 8C7.8 8 4.5 10.2 4.5 14C4.5 17.8 7.6 20.8 11.5 20.8C11.7 20.8 11.8 20.8 12 20.8C12.2 20.8 12.3 20.8 12.5 20.8C16.4 20.8 19.5 17.8 19.5 14C19.5 10.2 16.2 8 16.2 8C16.2 8 17.6 11.6 16.6 14.3C16.1 15.6 15.2 16.7 14 17.2C15.5 15.8 16.5 13.8 16.5 11.5C16.5 6.5 12 2 12 2Z"
                    fill="url(#botanicalPetals)"
                    stroke="none"
                    opacity="0.22"
                  />
                  <path
                    d="M12 3.5C12 3.5 8 7.8 8 12C8 14.4 9.8 16.5 12 16.5C14.2 16.5 16 14.4 16 12C16 7.8 12 3.5 12 3.5Z"
                    fill="url(#outerFlameGrad)"
                    stroke="#B45309"
                    strokeWidth="1.2"
                  />
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

          {/* CENTER: REORGANIZED CLEAN 5-ITEM LUXURY NAVIGATION WITH MEGA DROPDOWNS */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[13px] font-medium tracking-[0.14em] uppercase text-stone-800">
            {/* 1. SHOP MEGA MENU */}
            <div
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter('shop')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'shop' ? null : 'shop');
                  onNavigateToShop();
                }}
                className={`hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1.5 py-1 group ${
                  activeDropdown === 'shop' ? 'text-amber-900 font-semibold' : ''
                }`}
              >
                <span>Shop</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-250 ${
                    activeDropdown === 'shop' ? 'rotate-180 text-amber-900' : 'text-stone-400 group-hover:text-stone-700'
                  }`}
                />
                <span
                  className={`absolute bottom-3 left-0 h-[2px] bg-amber-700 transition-all duration-300 ${
                    activeDropdown === 'shop' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* Shop Mega Dropdown */}
              {activeDropdown === 'shop' && (
                <div
                  className="absolute top-full -left-20 w-[640px] bg-[#FAF8F5] border border-stone-200/90 rounded-2xl shadow-[0_20px_45px_rgba(28,24,20,0.14)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => handleMouseEnter('shop')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-200/70">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 font-bold block">
                        Curated Candle Atelier
                      </span>
                      <p className="text-[12px] text-stone-500 normal-case font-normal mt-0.5">
                        Pure soy wax, phthalate-free fragrances, and lead-free cotton or crackling wood wicks
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToShop();
                      }}
                      className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors normal-case shrink-0 cursor-pointer"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {shopCategories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop(cat.filterName);
                          }}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/70 hover:shadow-xs transition-all text-left group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 group-hover:scale-105 transition-all">
                            <Icon className="w-4 h-4 text-amber-800" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case">
                                {cat.name}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-900 font-medium">
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

                  {/* Mega Menu Footer Note & Quick Action */}
                  <div className="mt-4 pt-3.5 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-600 normal-case">
                    <span className="flex items-center gap-1.5 text-stone-600">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Complimentary gift packaging on all orders over ₹999
                    </span>
                    {onOpenScentQuiz && (
                      <button
                        onClick={() => {
                          closeAllMenus();
                          onOpenScentQuiz();
                        }}
                        className="text-amber-900 hover:text-amber-950 font-semibold underline underline-offset-4 cursor-pointer text-xs"
                      >
                        Take Scent Aura Quiz →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. COLLECTIONS MEGA MENU */}
            <div
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter('collections')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'collections' ? null : 'collections');
                  onNavigateToCollections();
                }}
                className={`hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1.5 py-1 group ${
                  activeDropdown === 'collections' ? 'text-amber-900 font-semibold' : ''
                }`}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-250 ${
                    activeDropdown === 'collections' ? 'rotate-180 text-amber-900' : 'text-stone-400 group-hover:text-stone-700'
                  }`}
                />
                <span
                  className={`absolute bottom-3 left-0 h-[2px] bg-amber-700 transition-all duration-300 ${
                    activeDropdown === 'collections' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* Collections Mega Dropdown */}
              {activeDropdown === 'collections' && (
                <div
                  className="absolute top-full -left-28 w-[650px] bg-[#FAF8F5] border border-stone-200/90 rounded-2xl shadow-[0_20px_45px_rgba(28,24,20,0.14)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => handleMouseEnter('collections')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-200/70">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 font-bold block">
                        Signature Editions & Seasonal Series
                      </span>
                      <p className="text-[12px] text-stone-500 normal-case font-normal mt-0.5">
                        Thematic artisan candles poured in limited small batches
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToCollections();
                      }}
                      className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors normal-case shrink-0 cursor-pointer"
                    >
                      <span>View All Series</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {collectionsList.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => {
                          closeAllMenus();
                          onNavigateToShop(col.category);
                        }}
                        className="p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/70 hover:shadow-xs transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case">
                            {col.name}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100/70 text-amber-900 font-medium">
                            {col.highlight}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800/90 font-medium normal-case">
                          {col.notes}
                        </p>
                        <p className="text-[11px] text-stone-500 normal-case line-clamp-1 mt-0.5">
                          {col.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-600 normal-case">
                    <span className="text-stone-500">
                      Slow-cured 100% natural wax for optimal cold & hot scent throw
                    </span>
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToCollections();
                      }}
                      className="text-amber-900 hover:text-amber-950 font-semibold underline underline-offset-4 cursor-pointer text-xs"
                    >
                      Explore Seasonal Showcase →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. GIFTS DROPDOWN */}
            <div
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter('gifts')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'gifts' ? null : 'gifts');
                  onNavigateToGifting();
                }}
                className={`hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1.5 py-1 group ${
                  activeDropdown === 'gifts' ? 'text-amber-900 font-semibold' : ''
                }`}
              >
                <span>Gifts</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100/80 text-amber-900 text-[9px] font-mono font-medium tracking-normal lowercase">
                  curated
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-250 ${
                    activeDropdown === 'gifts' ? 'rotate-180 text-amber-900' : 'text-stone-400 group-hover:text-stone-700'
                  }`}
                />
                <span
                  className={`absolute bottom-3 left-0 h-[2px] bg-amber-700 transition-all duration-300 ${
                    activeDropdown === 'gifts' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* Gifts Dropdown */}
              {activeDropdown === 'gifts' && (
                <div
                  className="absolute top-full -left-20 w-[520px] bg-[#FAF8F5] border border-stone-200/90 rounded-2xl shadow-[0_20px_45px_rgba(28,24,20,0.14)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => handleMouseEnter('gifts')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-200/70">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 font-bold block">
                        Luxury Gifting &amp; Presentation Boxes
                      </span>
                      <p className="text-[12px] text-stone-500 normal-case font-normal mt-0.5">
                        Festive hampers, wedding favors, and heirloom keepsake vessels
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToGifting();
                      }}
                      className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors normal-case shrink-0 cursor-pointer"
                    >
                      <span>All Hampers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToGifting();
                      }}
                      className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/70 hover:shadow-xs transition-all text-left group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                        <Gift className="w-4.5 h-4.5 text-amber-800" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case">
                            Curated Gift Hampers &amp; Sets
                          </span>
                          <span className="text-[10px] font-mono text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
                            Gold Foil Box
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 normal-case mt-0.5">
                          Signature combinations in turquoise &amp; gold boxes with satin ribbons and handmade botanicals
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToShop('Gift Hampers');
                      }}
                      className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/70 hover:shadow-xs transition-all text-left group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                        <Star className="w-4.5 h-4.5 text-amber-800" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case">
                            The Sacred Evil Eye Protection Gift Set
                          </span>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                            Artisan Talisman
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 normal-case mt-0.5">
                          Dual-layered royal blue candle with hand-beaded brooch &amp; authentic glass nazar charm
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        closeAllMenus();
                        onOpenContact();
                      }}
                      className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/70 hover:shadow-xs transition-all text-left group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                        <PhoneCall className="w-4.5 h-4.5 text-amber-800" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case">
                            Corporate &amp; Wedding Concierge
                          </span>
                          <span className="text-[10px] font-mono text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                            Bespoke Bulk
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 normal-case mt-0.5">
                          Personalized wax seals, customized branding bands, and tailored botanical fragrance options
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. CUSTOM DROPDOWN */}
            <div
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter('custom')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'custom' ? null : 'custom');
                  if (onOpenCustomBlender) onOpenCustomBlender();
                }}
                className={`hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1.5 py-1 group ${
                  activeDropdown === 'custom' ? 'text-amber-900 font-semibold' : ''
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Custom</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-250 ${
                    activeDropdown === 'custom' ? 'rotate-180 text-amber-900' : 'text-stone-400 group-hover:text-stone-700'
                  }`}
                />
                <span
                  className={`absolute bottom-3 left-0 h-[2px] bg-amber-700 transition-all duration-300 ${
                    activeDropdown === 'custom' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* Custom Dropdown */}
              {activeDropdown === 'custom' && (
                <div
                  className="absolute top-full -left-20 w-[490px] bg-[#FAF8F5] border border-stone-200/90 rounded-2xl shadow-[0_20px_45px_rgba(28,24,20,0.14)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => handleMouseEnter('custom')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="pb-3.5 mb-4 border-b border-stone-200/70">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 font-bold block">
                      Bespoke Candle Crafting Lab
                    </span>
                    <p className="text-[12px] text-stone-500 normal-case font-normal mt-0.5">
                      Personalize vessels, botanical top/heart/base notes, and personalized wicks
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {onOpenCustomBlender && (
                      <button
                        onClick={() => {
                          closeAllMenus();
                          onOpenCustomBlender();
                        }}
                        className="w-full flex items-start gap-3.5 p-3 rounded-xl bg-amber-500/5 hover:bg-amber-500/15 border border-amber-600/20 hover:border-amber-600/40 hover:shadow-xs transition-all text-left group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-600/15 border border-amber-600/30 flex items-center justify-center shrink-0 group-hover:bg-amber-600/25 transition-colors">
                          <Wand2 className="w-4.5 h-4.5 text-amber-800" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-950 transition-colors normal-case">
                              Custom Candle Blender Studio
                            </span>
                            <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-medium">
                              Interactive 3D
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 normal-case mt-0.5">
                            Hand-pick your artisan vessel, select slow-burning wood wicks, and balance your 3-tier scent pyramid
                          </p>
                        </div>
                      </button>
                    )}

                    {onOpenScentQuiz && (
                      <button
                        onClick={() => {
                          closeAllMenus();
                          onOpenScentQuiz();
                        }}
                        className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/70 hover:shadow-xs transition-all text-left group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                          <Sparkles className="w-4.5 h-4.5 text-amber-800" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case">
                              Fragrance Aura Scent Quiz
                            </span>
                            <span className="text-[10px] font-mono text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                              60 Seconds
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 normal-case mt-0.5">
                            Answer 4 sensory questions to discover whether your energy thrives on Floral, Gourmand, or Woody aromas
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 5. OUR STORY DROPDOWN */}
            <div
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter('story')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'story' ? null : 'story');
                  onNavigateToAbout();
                }}
                className={`hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1.5 py-1 group ${
                  activeDropdown === 'story' ? 'text-amber-900 font-semibold' : ''
                }`}
              >
                <span>Our Story</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-250 ${
                    activeDropdown === 'story' ? 'rotate-180 text-amber-900' : 'text-stone-400 group-hover:text-stone-700'
                  }`}
                />
                <span
                  className={`absolute bottom-3 left-0 h-[2px] bg-amber-700 transition-all duration-300 ${
                    activeDropdown === 'story' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* Our Story Dropdown */}
              {activeDropdown === 'story' && (
                <div
                  className="absolute top-full -left-24 w-[480px] bg-[#FAF8F5] border border-stone-200/90 rounded-2xl shadow-[0_20px_45px_rgba(28,24,20,0.14)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => handleMouseEnter('story')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="pb-3.5 mb-4 border-b border-stone-200/70">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 font-bold block">
                      The BlossomGlow Atelier
                    </span>
                    <p className="text-[12px] text-stone-500 normal-case font-normal mt-0.5">
                      Empowering women artisans, non-toxic pure wax, and mindful lighting
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToAbout();
                      }}
                      className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/70 hover:shadow-xs transition-all text-left group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                        <Compass className="w-4.5 h-4.5 text-amber-800" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case block">
                          Atelier Philosophy &amp; Artisan Craft
                        </span>
                        <p className="text-[11px] text-stone-500 normal-case mt-0.5">
                          How our women artisans pour, cure, and mold every single petal and candle by hand
                        </p>
                      </div>
                    </button>

                    {onOpenCareGuide && (
                      <button
                        onClick={() => {
                          closeAllMenus();
                          onOpenCareGuide();
                        }}
                        className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/70 hover:shadow-xs transition-all text-left group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                          <BookOpen className="w-4.5 h-4.5 text-amber-800" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case block">
                            Candle Care &amp; Burn Etiquette Guide
                          </span>
                          <p className="text-[11px] text-stone-500 normal-case mt-0.5">
                            Wick trimming, burn pool maintenance, and how to upcycle empty vessels
                          </p>
                        </div>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        closeAllMenus();
                        onOpenContact();
                      }}
                      className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-white border border-transparent hover:border-amber-200/70 hover:shadow-xs transition-all text-left group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-600/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                        <PhoneCall className="w-4.5 h-4.5 text-amber-800" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors normal-case block">
                          Contact Concierge &amp; Studio Care
                        </span>
                        <p className="text-[11px] text-stone-500 normal-case mt-0.5">
                          Reach our studio directly for custom orders, courier queries, or gift advice
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT: COMPACT ICONS & ACTIONS (Search, Scent Quiz CTA, Wishlist, Sign In, Bag) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
              aria-label="Search creations"
              title="Search candles, scents & gifts"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {/* Scent Quiz: Small Premium CTA Pill */}
            {onOpenScentQuiz && (
              <button
                onClick={onOpenScentQuiz}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-600/25 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 transition-all text-[11px] font-semibold tracking-wider uppercase cursor-pointer hover:shadow-2xs active:scale-95"
                title="Discover your personalized botanical candle aura"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Scent Quiz</span>
              </button>
            )}

            {/* Wishlist Button with Counter */}
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
                    <span className="hidden md:inline text-stone-800 max-w-[80px] truncate font-medium">
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
                  title="Sign In to BlossomGlow"
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

      {/* 3. REORGANIZED MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-stone-300 shadow-2xl px-5 py-6 space-y-4 animate-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto">
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

          {/* Scent Quiz Mobile Highlight Card */}
          {onOpenScentQuiz && (
            <div
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenScentQuiz();
              }}
              className="p-3 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-600/15 border border-amber-600/25 rounded-xl flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-950">Find Your Signature Scent</p>
                  <p className="text-[11px] text-stone-600">60-second botanical fragrance quiz</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-800" />
            </div>
          )}

          {/* Accordion-Style Clean Mobile Navigation for 5 Main Categories */}
          <div className="divide-y divide-stone-200 border-y border-stone-200 text-sm font-semibold uppercase tracking-wider text-stone-800">
            {/* 1. Shop Accordion */}
            <div className="py-2">
              <button
                onClick={() =>
                  setMobileExpandedSection(mobileExpandedSection === 'shop' ? null : 'shop')
                }
                className="w-full flex items-center justify-between py-2 text-left text-stone-900"
              >
                <span>Shop</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform ${
                    mobileExpandedSection === 'shop' ? 'rotate-180 text-amber-800' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'shop' && (
                <div className="pl-3 pr-1 py-2 space-y-1.5 text-xs font-normal normal-case">
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onNavigateToShop();
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 font-medium text-amber-900 flex items-center justify-between"
                  >
                    <span>View All Creations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {shopCategories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToShop(cat.filterName);
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 text-stone-700 flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded">
                        {cat.tag}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Collections Accordion */}
            <div className="py-2">
              <button
                onClick={() =>
                  setMobileExpandedSection(
                    mobileExpandedSection === 'collections' ? null : 'collections'
                  )
                }
                className="w-full flex items-center justify-between py-2 text-left text-stone-900"
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform ${
                    mobileExpandedSection === 'collections' ? 'rotate-180 text-amber-800' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'collections' && (
                <div className="pl-3 pr-1 py-2 space-y-1.5 text-xs font-normal normal-case">
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onNavigateToCollections();
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 font-medium text-amber-900 flex items-center justify-between"
                  >
                    <span>Explore All Collections</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {collectionsList.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToShop(col.category);
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 text-stone-700 flex items-center justify-between"
                    >
                      <span>{col.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{col.highlight}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Gifts Accordion */}
            <div className="py-2">
              <button
                onClick={() =>
                  setMobileExpandedSection(mobileExpandedSection === 'gifts' ? null : 'gifts')
                }
                className="w-full flex items-center justify-between py-2 text-left text-stone-900"
              >
                <div className="flex items-center gap-2">
                  <span>Gifts</span>
                  <span className="text-[9px] font-mono bg-amber-100 text-amber-900 px-1.5 rounded uppercase">
                    Curated
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform ${
                    mobileExpandedSection === 'gifts' ? 'rotate-180 text-amber-800' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'gifts' && (
                <div className="pl-3 pr-1 py-2 space-y-1.5 text-xs font-normal normal-case">
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onNavigateToGifting();
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 font-medium text-amber-900 flex items-center justify-between"
                  >
                    <span>Curated Gift Hampers &amp; Sets</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onNavigateToShop('Gift Hampers');
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 text-stone-700"
                  >
                    The Sacred Evil Eye Protection Box
                  </button>
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onOpenContact();
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 text-stone-700"
                  >
                    Corporate &amp; Wedding Favors Concierge
                  </button>
                </div>
              )}
            </div>

            {/* 4. Custom Accordion */}
            <div className="py-2">
              <button
                onClick={() =>
                  setMobileExpandedSection(mobileExpandedSection === 'custom' ? null : 'custom')
                }
                className="w-full flex items-center justify-between py-2 text-left text-stone-900"
              >
                <div className="flex items-center gap-2">
                  <Wand2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Custom</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform ${
                    mobileExpandedSection === 'custom' ? 'rotate-180 text-amber-800' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'custom' && (
                <div className="pl-3 pr-1 py-2 space-y-1.5 text-xs font-normal normal-case">
                  {onOpenCustomBlender && (
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onOpenCustomBlender();
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 font-medium text-amber-900 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5 text-amber-700" />
                        Custom Candle Blender
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onOpenScentQuiz && (
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onOpenScentQuiz();
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 text-stone-700 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      Fragrance Aura Scent Quiz
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 5. Our Story Accordion */}
            <div className="py-2">
              <button
                onClick={() =>
                  setMobileExpandedSection(mobileExpandedSection === 'story' ? null : 'story')
                }
                className="w-full flex items-center justify-between py-2 text-left text-stone-900"
              >
                <span>Our Story</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform ${
                    mobileExpandedSection === 'story' ? 'rotate-180 text-amber-800' : ''
                  }`}
                />
              </button>
              {mobileExpandedSection === 'story' && (
                <div className="pl-3 pr-1 py-2 space-y-1.5 text-xs font-normal normal-case">
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onNavigateToAbout();
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 font-medium text-amber-900 flex items-center justify-between"
                  >
                    <span>Atelier Story &amp; Artisan Craft</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {onOpenCareGuide && (
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onOpenCareGuide();
                      }}
                      className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 text-stone-700 flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      Candle Care &amp; Burn Guide
                    </button>
                  )}
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onOpenContact();
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-stone-200/50 text-stone-700 flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                    Contact Concierge
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Footer Quick Utilities */}
          <div className="space-y-2.5 pt-2 text-xs">
            {onOpenTracking && (
              <button
                onClick={() => {
                  closeAllMenus();
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
                closeAllMenus();
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
