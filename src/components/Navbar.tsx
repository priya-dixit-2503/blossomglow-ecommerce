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
  ChevronLeft,
  ChevronRight,
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
  Instagram,
  Facebook,
  MessageCircle,
} from 'lucide-react';
import { ANNOUNCEMENT_CONFIG } from '../config/announcements';
import { UserProfile } from '../types';
import { CandleApiService } from '../services/api';
import { BlossomGlowLogo } from './BlossomGlowLogo';

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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeAnnouncementIdx, setActiveAnnouncementIdx] = useState(0);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Accordion state for mobile menu
  const [mobileExpandedSection, setMobileExpandedSection] = useState<ActiveDropdown>('shop');

  const navContainerRef = useRef<HTMLDivElement>(null);
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

  // Click outside & Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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

  const closeAllMenus = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const currentAnnouncement =
    ANNOUNCEMENT_CONFIG.announcements[activeAnnouncementIdx] || ANNOUNCEMENT_CONFIG.announcements[0];

  const nextAnnouncement = () => {
    setActiveAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENT_CONFIG.announcements.length);
  };

  const prevAnnouncement = () => {
    setActiveAnnouncementIdx((prev) =>
      prev === 0 ? ANNOUNCEMENT_CONFIG.announcements.length - 1 : prev - 1
    );
  };

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
      {/* 1. TOP ANNOUNCEMENT RIBBON - LUXURY BLACK OBSIDIAN & CAROUSEL */}
      {ANNOUNCEMENT_CONFIG.enabled && (
        <div className="bg-[#161311] text-[#FAF8F5] px-4 py-2 sm:py-2.5 text-xs border-b border-[#2A231E] relative overflow-hidden shadow-xs">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/25 via-amber-500/10 to-amber-950/25 pointer-events-none" />

          <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between relative z-10">
            {/* Left: Social Media Community & Artisan craft badge */}
            <div className="hidden lg:flex items-center gap-3 text-stone-300">
              <div className="flex items-center gap-1.5">
                <a
                  href="https://instagram.com/blossomglow.candles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full text-stone-300 hover:text-amber-300 hover:bg-stone-800/70 transition-colors cursor-pointer"
                  title="Follow us on Instagram @blossomglow.candles"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com/blossomglowcandles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full text-stone-300 hover:text-amber-300 hover:bg-stone-800/70 transition-colors cursor-pointer"
                  title="Connect with us on Facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://wa.me/919829012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full text-stone-300 hover:text-amber-300 hover:bg-stone-800/70 transition-colors cursor-pointer"
                  title="Chat with Atelier on WhatsApp"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              </div>

              <span className="text-stone-600 font-light">|</span>

              <div className="flex items-center gap-1.5 text-[11px] text-amber-200/90 font-medium tracking-wider uppercase">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>100% Organic Soy Wax · Hand-Poured in India</span>
              </div>
            </div>

            {/* Center: Interactive Announcement Carousel with Prev/Next Controls */}
            <div className="mx-auto flex items-center justify-center gap-1.5 sm:gap-2.5 text-center text-xs">
              <button
                onClick={prevAnnouncement}
                className="p-1 rounded-full text-stone-400 hover:text-amber-300 hover:bg-stone-800/70 transition-colors cursor-pointer shrink-0"
                aria-label="Previous announcement"
                title="Previous announcement"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-center">
                <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px] sm:text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline tracking-wider">
                    {currentAnnouncement.badge || 'BlossomGlow'}
                  </span>
                </span>

                <span className="text-stone-600 hidden sm:inline">•</span>

                <span className="text-stone-200 font-light tracking-wide text-[11px] sm:text-xs max-w-[280px] sm:max-w-none truncate sm:overflow-visible">
                  {currentAnnouncement.text}
                </span>

                {currentAnnouncement.code && (
                  <button
                    onClick={(e) => handleCopyCode(currentAnnouncement.code!, e)}
                    className="hidden md:inline-flex items-center gap-1 ml-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 font-mono text-[10px] tracking-wider transition-colors cursor-pointer shadow-2xs"
                    title="Click to copy promo code"
                  >
                    {copiedCode === currentAnnouncement.code ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300 font-semibold">COPIED</span>
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

              <button
                onClick={nextAnnouncement}
                className="p-1 rounded-full text-stone-400 hover:text-amber-300 hover:bg-stone-800/70 transition-colors cursor-pointer shrink-0"
                aria-label="Next announcement"
                title="Next announcement"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: Quick Concierge, Live Tracking & API badge */}
            <div className="hidden lg:flex items-center gap-4 text-[11px] text-stone-300">
              {onOpenTracking && (
                <button
                  onClick={onOpenTracking}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  <span>Track Order</span>
                </button>
              )}

              <button
                onClick={onOpenContact}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
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

        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 h-20 sm:h-[88px] flex items-center justify-between">
          {/* FAR LEFT CORNER: Navigation Drawer Toggle Button shifted to the left corner, followed by Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Navigation Drawer Toggle Button - Shifted to the far left corner */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 rounded-xl focus:outline-none transition-all flex items-center justify-center cursor-pointer border border-stone-300/80 bg-white/70 hover:bg-white shadow-2xs group shrink-0"
              aria-label="Toggle navigation drawer"
              title={mobileMenuOpen ? 'Close Navigation Drawer' : 'Open Navigation Drawer'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-stone-900 group-hover:scale-110 transition-transform" />
              ) : (
                <Menu className="w-5 h-5 text-stone-800 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Official Brand Logo */}
            <button
              onClick={() => {
                closeAllMenus();
                onNavigateToHome();
              }}
              className="cursor-pointer focus:outline-none py-1 text-left flex items-center shrink-0"
              title="BlossomGlow Candle Creations - Return to Home"
            >
              <BlossomGlowLogo size="md" showText={true} />
            </button>
          </div>

          {/* RIGHT: COMPACT ICONS & ACTIONS (Search, Scent Quiz CTA, Wishlist, Sign In, Bag) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Search creations"
              title="Search candles, scents & gifts"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {/* Scent Quiz: Small Premium CTA Pill */}
            {onOpenScentQuiz && (
              <button
                onClick={onOpenScentQuiz}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 transition-all text-[11px] font-semibold tracking-wider uppercase cursor-pointer hover:shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
                title="Discover your personalized botanical candle aura"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="whitespace-nowrap">Scent Quiz</span>
              </button>
            )}

            {/* Wishlist Button with Counter */}
            <button
              onClick={onOpenWishlist}
              className="p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors relative cursor-pointer shrink-0"
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
            <div className="relative shrink-0" ref={userDropdownRef}>
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-stone-300/80 hover:border-amber-700/60 bg-white/70 hover:bg-white transition-all text-xs font-medium cursor-pointer shadow-2xs whitespace-nowrap"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#29221C] text-amber-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:inline text-stone-800 max-w-[80px] truncate font-medium">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-300 hover:border-amber-700 text-stone-700 hover:text-amber-900 hover:bg-stone-50 transition-colors text-xs font-medium cursor-pointer whitespace-nowrap shrink-0"
                  title="Sign In to BlossomGlow"
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Bag: Chic Deep Espresso Obsidian & Golden Accent */}
            <button
              onClick={onOpenCart}
              className="p-2 sm:px-3.5 sm:py-2 text-[#FAF8F5] bg-[#1C1815] hover:bg-[#2A231E] rounded-full transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group ml-1 shrink-0 whitespace-nowrap"
              aria-label="Shopping Cart"
              title="View Shopping Bag"
            >
              <div className="relative shrink-0">
                <ShoppingBag className="w-4.5 h-4.5 text-amber-300 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-amber-400 text-stone-950 rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase text-amber-100 whitespace-nowrap">
                Bag
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. REORGANIZED NAVIGATION DRAWER (ACCESSIBLE FROM FAR-LEFT DRAWER BUTTON) */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay for closing on outside click */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-40 bg-[#FAF7F2] border-b border-stone-300 shadow-2xl px-4 sm:px-6 lg:px-10 py-6 space-y-5 animate-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-stone-200/80">
                <div className="flex items-center gap-3">
                  <BlossomGlowLogo size="sm" showText={true} />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full font-semibold">
                    Atelier Navigation Index
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
                  aria-label="Close drawer"
                  title="Close Navigation Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Search & Scent Quiz Highlights Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    closeAllMenus();
                    onOpenSearch();
                  }}
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-500 text-xs cursor-pointer shadow-2xs hover:border-amber-400 hover:text-stone-800 transition-all"
                >
                  <Search className="w-4 h-4 text-stone-400" />
                  <span>Search botanical candles, scents, gifts...</span>
                </div>

                {onOpenScentQuiz && (
                  <div
                    onClick={() => {
                      closeAllMenus();
                      onOpenScentQuiz();
                    }}
                    className="p-2.5 px-3.5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-600/15 border border-amber-600/25 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-500/20 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-800">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-950">Find Your Signature Scent</p>
                        <p className="text-[10px] text-stone-600">60-second botanical fragrance quiz</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-800" />
                  </div>
                )}
              </div>

              {/* DESKTOP 5-COLUMN FULL ATELIER DIRECTORY (lg and up) */}
              <div className="hidden lg:grid grid-cols-5 gap-6 pt-2 pb-4 border-b border-stone-200/80 text-xs">
                {/* 1. Shop Atelier */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                    <Flame className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="font-bold tracking-wider uppercase text-stone-900 text-[12px]">Shop</span>
                  </div>
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onNavigateToShop();
                    }}
                    className="font-semibold text-amber-900 hover:text-amber-950 flex items-center justify-between w-full text-left py-1 hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>View All Creations</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                  <div className="space-y-1 pt-1">
                    {shopCategories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          closeAllMenus();
                          onNavigateToShop(cat.filterName);
                        }}
                        className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-white text-stone-700 hover:text-amber-950 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium group-hover:text-amber-900">{cat.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-amber-100/70 text-amber-900 rounded">{cat.tag}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Signature Series */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                    <Layers className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="font-bold tracking-wider uppercase text-stone-900 text-[12px]">Collections</span>
                  </div>
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onNavigateToCollections();
                    }}
                    className="font-semibold text-amber-900 hover:text-amber-950 flex items-center justify-between w-full text-left py-1 hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Explore All Series</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                  <div className="space-y-1 pt-1">
                    {collectionsList.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => {
                          closeAllMenus();
                          onNavigateToShop(col.category);
                        }}
                        className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-white text-stone-700 hover:text-amber-950 transition-all cursor-pointer group"
                      >
                        <p className="text-[11px] font-medium text-stone-800 group-hover:text-amber-900 truncate">{col.name}</p>
                        <p className="text-[10px] text-amber-800/80 truncate">{col.notes}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Curated Gifts */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                    <Gift className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="font-bold tracking-wider uppercase text-stone-900 text-[12px]">Gifts</span>
                  </div>
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onNavigateToGifting();
                    }}
                    className="font-semibold text-amber-900 hover:text-amber-950 flex items-center justify-between w-full text-left py-1 hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Curated Gift Sets</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToShop('Gift Hampers');
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-white transition-all cursor-pointer group"
                    >
                      <p className="text-[11px] font-semibold text-stone-800 group-hover:text-amber-900">The Sacred Evil Eye Box</p>
                      <p className="text-[10px] text-stone-500">Royal blue talisman gift hamper</p>
                    </button>
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onOpenContact();
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-white transition-all cursor-pointer group"
                    >
                      <p className="text-[11px] font-semibold text-stone-800 group-hover:text-amber-900">Corporate &amp; Wedding Concierge</p>
                      <p className="text-[10px] text-stone-500">Personalized seals &amp; bespoke favors</p>
                    </button>
                  </div>
                </div>

                {/* 4. Custom Blender & Scents */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                    <Wand2 className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="font-bold tracking-wider uppercase text-stone-900 text-[12px]">Custom</span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {onOpenCustomBlender && (
                      <button
                        onClick={() => {
                          closeAllMenus();
                          onOpenCustomBlender();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-600/20 transition-all cursor-pointer group"
                      >
                        <p className="text-xs font-semibold text-amber-900 group-hover:text-amber-950 flex items-center justify-between">
                          <span>Custom Candle Blender</span>
                          <ArrowRight className="w-3 h-3 text-amber-700" />
                        </p>
                        <p className="text-[10px] text-stone-600 mt-0.5">3D Interactive fragrance mixing</p>
                      </button>
                    )}
                    {onOpenScentQuiz && (
                      <button
                        onClick={() => {
                          closeAllMenus();
                          onOpenScentQuiz();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 transition-all cursor-pointer group shadow-2xs"
                      >
                        <p className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Scent Aura Quiz</span>
                        </p>
                        <p className="text-[10px] text-stone-500 mt-0.5">Find your botanical aroma profile</p>
                      </button>
                    )}
                  </div>
                </div>

                {/* 5. Atelier Story & Care */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                    <Compass className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="font-bold tracking-wider uppercase text-stone-900 text-[12px]">Our Story</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onNavigateToAbout();
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-white transition-all cursor-pointer group"
                    >
                      <p className="text-[11px] font-semibold text-stone-800 group-hover:text-amber-900">Atelier Story &amp; Artisans</p>
                      <p className="text-[10px] text-stone-500">Women empowerment &amp; non-toxic soy</p>
                    </button>
                    {onOpenCareGuide && (
                      <button
                        onClick={() => {
                          closeAllMenus();
                          onOpenCareGuide();
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-white transition-all cursor-pointer group"
                      >
                        <p className="text-[11px] font-semibold text-stone-800 group-hover:text-amber-900">Candle Care &amp; Burn Guide</p>
                        <p className="text-[10px] text-stone-500">Wick trimming &amp; burn etiquette</p>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onOpenContact();
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-white transition-all cursor-pointer group"
                    >
                      <p className="text-[11px] font-semibold text-stone-800 group-hover:text-amber-900">Contact Concierge</p>
                      <p className="text-[10px] text-stone-500">Direct phone &amp; WhatsApp support</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* MOBILE ACCORDION NAVIGATION (lg:hidden) */}
              <div className="lg:hidden divide-y divide-stone-200 border-y border-stone-200 text-sm font-semibold uppercase tracking-wider text-stone-800">
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

              {/* Drawer Footer Utilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 text-xs">
                {onOpenTracking && (
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onOpenTracking();
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-2xs flex items-center justify-between text-stone-800 font-medium transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-700" />
                      <span>Track Order</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                )}

                <button
                  onClick={() => {
                    closeAllMenus();
                    onOpenWishlist();
                  }}
                  className="py-2.5 px-3.5 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-2xs flex items-center justify-between text-stone-800 font-medium transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>Saved Wishlist</span>
                  </span>
                  {wishlistCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    closeAllMenus();
                    onOpenCart();
                  }}
                  className="py-2.5 px-3.5 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-2xs flex items-center justify-between text-stone-800 font-medium transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-800" />
                    <span>Shopping Bag</span>
                  </span>
                  {cartCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-stone-950 text-[10px] font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    closeAllMenus();
                    onOpenArchitecture();
                  }}
                  className="py-2.5 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200/60 text-stone-600 text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer"
                  title="Spring Boot 8080 API Specs"
                >
                  <span>API Specs (Port 8080)</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
