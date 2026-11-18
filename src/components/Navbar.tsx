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
  MapPin,
  Lock,
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
  Instagram,
  Facebook,
  MessageCircle,
} from 'lucide-react';
import { ANNOUNCEMENT_CONFIG } from '../config/announcements';
import { UserProfile } from '../types';
import { CandleApiService } from '../services/api';
import { BlossomGlowLogo } from './BlossomGlowLogo';
import { CollectionsDropdownMenu, MegaMenuTab } from './CollectionsDropdownMenu';

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
  onOpenGiftBuilder?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register' | 'admin') => void;
  onOpenOrderHistory?: () => void;
  onOpenAccount?: (tab?: 'profile' | 'orders' | 'wishlist' | 'addresses' | 'security') => void;
  onLogout?: () => void;
  onNavigateToHome: () => void;
  onNavigateToNewArrivals?: () => void;
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
  onOpenGiftBuilder,
  onOpenAuth,
  onOpenOrderHistory,
  onOpenAccount,
  onLogout,
  onNavigateToHome,
  onNavigateToNewArrivals,
  onNavigateToShop,
  onNavigateToCollections,
  onNavigateToAbout,
  onNavigateToGifting,
}) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [megaMenuTab, setMegaMenuTab] = useState<MegaMenuTab>('categories');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeAnnouncementIdx, setActiveAnnouncementIdx] = useState(0);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [mobileCollectionsExpanded, setMobileCollectionsExpanded] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Background health check
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
      const target = e.target as Node;
      // Close dropdown only if click is outside the entire header container
      if (headerRef.current && !headerRef.current.contains(target)) {
        setIsMegaMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMegaMenuOpen(false);
        setUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
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
    setIsMegaMenuOpen(false);
    setUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
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

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeAllMenus();
    onOpenSearch();
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-40 w-full select-none">
      {/* 1. TOP REFINED ANNOUNCEMENT RIBBON */}
      {ANNOUNCEMENT_CONFIG.enabled && (
        <div className="bg-[#141210] text-[#FAF8F5] px-3 sm:px-6 py-2 text-xs border-b border-[#25201C] relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
            {/* Left: Brand philosophy & Socials */}
            <div className="hidden lg:flex items-center gap-3 text-stone-300">
              <div className="flex items-center gap-1.5">
                <a
                  href="https://instagram.com/blossomglow.candles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full text-stone-400 hover:text-amber-300 transition-colors"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com/blossomglowcandles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full text-stone-400 hover:text-amber-300 transition-colors"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://wa.me/919829012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full text-stone-400 hover:text-amber-300 transition-colors"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              </div>
              <span className="text-stone-700">|</span>
              <span className="text-[11px] text-stone-300 font-light">
                100% Organic Soy Wax · Handcrafted in India
              </span>
            </div>

            {/* Center: Rotating announcement with promo code copy */}
            <div className="mx-auto flex items-center justify-center gap-2 text-center text-xs">
              <button
                type="button"
                onClick={prevAnnouncement}
                className="p-0.5 text-stone-500 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
                aria-label="Previous announcement"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-stone-200 font-light text-[11px] sm:text-xs truncate max-w-[240px] sm:max-w-none">
                  {currentAnnouncement.text}
                </span>

                {currentAnnouncement.code && (
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(currentAnnouncement.code!, e)}
                    className="hidden sm:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 font-mono text-[10px] tracking-wider transition-colors cursor-pointer"
                    title="Click to copy code"
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
                type="button"
                onClick={nextAnnouncement}
                className="p-0.5 text-stone-500 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
                aria-label="Next announcement"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: Concierge, Tracking & API Status */}
            <div className="hidden lg:flex items-center gap-3.5 text-[11px] text-stone-300">
              {onOpenTracking && (
                <button
                  type="button"
                  onClick={onOpenTracking}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  <span>Track Order</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenContact}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Concierge</span>
              </button>

              <button
                type="button"
                onClick={onOpenArchitecture}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                title="View Spring Boot 8080 API Specs"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>API 8080</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN NAVIGATION HEADER: CLEAN, UNCLUTTERED LUXURY BAR */}
      <div className="relative bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_2px_15px_rgba(20,15,10,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* LEFT: BRAND LOGO */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                closeAllMenus();
                onNavigateToHome();
              }}
              className="cursor-pointer focus:outline-none py-1 text-left flex items-center shrink-0"
              title="BlossomGlow Atelier - Return to Home"
            >
              <BlossomGlowLogo size="md" showText={true} />
            </button>
          </div>

          {/* CENTER: STREAMLINED PRIMARY NAVIGATION (Home · Collections ∨ · New Arrivals) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => {
                closeAllMenus();
                onNavigateToHome();
              }}
              className="py-1 text-sm font-medium text-stone-700 hover:text-stone-950 transition-colors cursor-pointer relative group"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 transition-all group-hover:w-full" />
            </button>

            {/* 2. Collections ∨ (Clean single luxury dropdown with all sub-options inside) */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMegaMenuOpen(!isMegaMenuOpen);
                }}
                className={`py-1 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer relative group ${
                  isMegaMenuOpen
                    ? 'text-stone-950 font-semibold'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
                aria-expanded={isMegaMenuOpen}
                aria-label="Toggle collections menu"
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
                    isMegaMenuOpen ? 'rotate-180 text-stone-950' : 'group-hover:text-stone-900'
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-amber-800 transition-all ${
                    isMegaMenuOpen ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            </div>

            {/* 3. New Arrivals */}
            <button
              type="button"
              onClick={() => {
                closeAllMenus();
                if (onNavigateToNewArrivals) {
                  onNavigateToNewArrivals();
                } else {
                  onNavigateToShop('All Creations');
                }
              }}
              className="py-1 text-sm font-medium text-stone-700 hover:text-stone-950 transition-colors cursor-pointer relative group whitespace-nowrap"
            >
              <span>New Arrivals</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 transition-all group-hover:w-full" />
            </button>
          </nav>

          {/* RIGHT: ESSENTIAL SHOPPING & ACCOUNT ICONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
              aria-label="Search creations"
              title="Search candles & scents"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Scent Quiz CTA (Desktop) */}
            {onOpenScentQuiz && (
              <button
                type="button"
                onClick={onOpenScentQuiz}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 transition-all text-xs font-semibold tracking-wider cursor-pointer active:scale-95 whitespace-nowrap"
                title="Discover your personalized botanical fragrance aura"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Scent Quiz</span>
              </button>
            )}

            {/* Wishlist Button with Counter */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors relative cursor-pointer"
              aria-label="Saved Wishlist"
              title="Saved Favorites"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Account / Sign In Dropdown */}
            <div className="hidden sm:block relative shrink-0" ref={userDropdownRef}>
              {currentUser ? (
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserDropdownOpen(!userDropdownOpen);
                    }}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-stone-300 hover:border-amber-700/60 bg-white/70 hover:bg-white transition-all text-xs font-medium cursor-pointer shadow-2xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#29221C] text-amber-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-stone-800 max-w-[85px] truncate font-medium">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-60 bg-[#FAF8F5] rounded-2xl shadow-xl border border-stone-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
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
                        {onOpenAccount && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenAccount('profile');
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-900 hover:bg-stone-200/60 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <User className="w-4 h-4 text-amber-800" />
                            <span>My Account & Profile</span>
                          </button>
                        )}

                        {onOpenOrderHistory && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              if (onOpenAccount) {
                                onOpenAccount('orders');
                              } else {
                                onOpenOrderHistory();
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-200/60 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Package className="w-4 h-4 text-amber-800" />
                            <span>Orders & History</span>
                          </button>
                        )}

                        {onOpenAccount && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenAccount('addresses');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-200/60 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <MapPin className="w-4 h-4 text-stone-600" />
                            <span>Saved Addresses</span>
                          </button>
                        )}

                        {onOpenAccount && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenAccount('security');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-200/60 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Lock className="w-4 h-4 text-stone-600" />
                            <span>Change Password</span>
                          </button>
                        )}

                        {onOpenTracking && (
                          <button
                            type="button"
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
                            type="button"
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
                        type="button"
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
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-300 hover:border-amber-700 text-stone-700 hover:text-amber-900 hover:bg-stone-50 transition-colors text-xs font-medium cursor-pointer whitespace-nowrap"
                  title="Sign In to BlossomGlow"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="p-2 sm:px-3.5 sm:py-2 text-[#FAF8F5] bg-[#1C1815] hover:bg-[#2A231E] rounded-full transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer active:scale-95 group shrink-0"
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
              <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase text-amber-100">
                Bag
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-800 hover:text-stone-950 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer shrink-0 focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-stone-900" />
              ) : (
                <Menu className="w-5 h-5 text-stone-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. COLLECTIONS MEGA-DROPDOWN MENU (Organizes Categories, Collections, Gifting, Experiences Inside) */}
      <CollectionsDropdownMenu
        isOpen={isMegaMenuOpen}
        activeTab={megaMenuTab}
        onTabChange={(tab) => setMegaMenuTab(tab)}
        onClose={() => setIsMegaMenuOpen(false)}
        onOpenSearch={onOpenSearch}
        onOpenScentQuiz={onOpenScentQuiz}
        onOpenCustomBlender={onOpenCustomBlender}
        onOpenGiftBuilder={onOpenGiftBuilder}
        onOpenContact={onOpenContact}
        onOpenCareGuide={onOpenCareGuide}
        onOpenTracking={onOpenTracking}
        onOpenArchitecture={onOpenArchitecture}
        onNavigateToShop={onNavigateToShop}
        onNavigateToCollections={onNavigateToCollections}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToGifting={onNavigateToGifting}
        isBackendConnected={isBackendConnected}
      />

      {/* 4. MOBILE SLIDE-OVER NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-[85vw] w-80 bg-[#FAF7F2] shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
              <button
                type="button"
                onClick={() => {
                  closeAllMenus();
                  onNavigateToHome();
                }}
                className="text-left flex items-center"
              >
                <BlossomGlowLogo size="sm" showText={true} />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 space-y-5 flex-1 overflow-y-auto">
              {/* Quick Search in Mobile Menu */}
              <form onSubmit={handleMobileSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search candles, scents, gifts..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onClick={() => {
                    closeAllMenus();
                    onOpenSearch();
                  }}
                  readOnly
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none cursor-pointer"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </form>

              {/* User Account Quick Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                {currentUser ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#29221C] text-amber-200 flex items-center justify-center font-bold text-xs shrink-0">
                        {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {currentUser.fullName}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          if (onOpenAccount) onOpenAccount('profile');
                        }}
                        className="py-1.5 px-2 bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-medium rounded-lg text-center cursor-pointer"
                      >
                        My Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          if (onOpenAccount) onOpenAccount('orders');
                          else if (onOpenOrderHistory) onOpenOrderHistory();
                        }}
                        className="py-1.5 px-2 bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-medium rounded-lg text-center cursor-pointer"
                      >
                        My Orders
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Welcome to Atelier</p>
                      <p className="text-[10px] text-stone-500">Sign in for orders & wishlist</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (onOpenAuth) onOpenAuth('login');
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#1C1815] text-amber-200 text-xs font-medium cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              {/* Main Navigation Accordions */}
              <div className="space-y-1">
                {/* Home */}
                <button
                  type="button"
                  onClick={() => {
                    closeAllMenus();
                    onNavigateToHome();
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white text-stone-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Home
                </button>

                {/* Collections Accordion (Houses Categories, Signature Series, Gifting & Experiences inside) */}
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileCollectionsExpanded(!mobileCollectionsExpanded);
                    }}
                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white text-stone-800 text-sm font-medium transition-colors cursor-pointer"
                  >
                    <span>Collections</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                        mobileCollectionsExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileCollectionsExpanded && (
                    <div className="pl-3 pr-1 py-1 space-y-3">
                      {/* Sub-section 1: Categories */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70 px-2 pt-1">
                          Shop Categories
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('All Creations');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg bg-amber-500/10 text-amber-900 text-xs font-semibold cursor-pointer flex items-center justify-between"
                        >
                          <span>View All Creations</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Pillar Candles');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Pillar Candles
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Jar & Container Candles');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Jar & Container Candles
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Floating & Urli Sets');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Floating & Urli Sets
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Sculptural Candles');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Sculptural & Buddha
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Luxury Gift Hampers');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Luxury Gift Hampers
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Botanical Bowls & Shells');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Botanical Bowls & Coconut Shells
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Diffusers & Home Accents');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Home Accents & Trays
                        </button>
                      </div>

                      {/* Sub-section 2: Signature Fragrance Series */}
                      <div className="space-y-1 pt-1 border-t border-stone-200/60">
                        <div className="flex items-center justify-between px-2 pt-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">
                            Signature Series
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              closeAllMenus();
                              onNavigateToCollections();
                            }}
                            className="text-[10px] text-amber-800 font-semibold hover:underline"
                          >
                            Explore on Page ➔
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Jar & Container Candles');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Botanical Bloom (Rose & Amber)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Pillar Candles');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Tropical Spice (Coconut Shell)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Sculptural Candles');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Nirvana Sanctuary (Buddha)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Sculptural Candles');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Zenith Bloom (Lotus)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Diffusers & Home Accents');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Modernist Sanctuary (Ribbed)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToShop('Botanical Bowls & Shells');
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Heritage Hearth (Wood Bowl)
                        </button>
                      </div>

                      {/* Sub-section 3: Gifting & Interactive Experiences */}
                      <div className="space-y-1 pt-1 border-t border-stone-200/60">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70 px-2 pt-1">
                          Bespoke & Gifting
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            closeAllMenus();
                            onNavigateToGifting();
                          }}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer"
                        >
                          Curated Gift Sets & Chests
                        </button>
                        {onOpenGiftBuilder && (
                          <button
                            type="button"
                            onClick={() => {
                              closeAllMenus();
                              onOpenGiftBuilder();
                            }}
                            className="w-full text-left py-1.5 px-3 rounded-lg text-amber-900 font-medium hover:bg-white text-xs cursor-pointer"
                          >
                            Build Custom Gift Hamper
                          </button>
                        )}
                        {onOpenScentQuiz && (
                          <button
                            type="button"
                            onClick={() => {
                              closeAllMenus();
                              onOpenScentQuiz();
                            }}
                            className="w-full text-left py-1.5 px-3 rounded-lg text-amber-900 font-medium hover:bg-white text-xs cursor-pointer flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                            <span>60-Second Scent Quiz</span>
                          </button>
                        )}
                        {onOpenCustomBlender && (
                          <button
                            type="button"
                            onClick={() => {
                              closeAllMenus();
                              onOpenCustomBlender();
                            }}
                            className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer flex items-center gap-2"
                          >
                            <Wand2 className="w-3.5 h-3.5 text-stone-500" />
                            <span>Custom Candle Blender (3D)</span>
                          </button>
                        )}
                        {onOpenCareGuide && (
                          <button
                            type="button"
                            onClick={() => {
                              closeAllMenus();
                              onOpenCareGuide();
                            }}
                            className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer flex items-center gap-2"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                            <span>Candle Care & Burn Guide</span>
                          </button>
                        )}
                        {onOpenTracking && (
                          <button
                            type="button"
                            onClick={() => {
                              closeAllMenus();
                              onOpenTracking();
                            }}
                            className="w-full text-left py-1.5 px-3 rounded-lg text-stone-600 hover:bg-white text-xs cursor-pointer flex items-center gap-2"
                          >
                            <Package className="w-3.5 h-3.5 text-stone-500" />
                            <span>Track Live Courier Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* New Arrivals */}
                <button
                  type="button"
                  onClick={() => {
                    closeAllMenus();
                    if (onNavigateToNewArrivals) onNavigateToNewArrivals();
                    else onNavigateToShop('All Creations');
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white text-stone-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  New Arrivals
                </button>

                {/* About Atelier */}
                <button
                  type="button"
                  onClick={() => {
                    closeAllMenus();
                    onNavigateToAbout();
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white text-stone-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  About Our Atelier
                </button>

                {/* Contact Concierge */}
                <button
                  type="button"
                  onClick={() => {
                    closeAllMenus();
                    onOpenContact();
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white text-stone-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Concierge & Support
                </button>
              </div>

              {/* Spring Boot API specs badge */}
              <div className="pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    closeAllMenus();
                    onOpenArchitecture();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono flex items-center justify-between cursor-pointer"
                >
                  <span>Backend REST API (Port 8080)</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#F2EDE6] border-t border-stone-200 text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-stone-600">
                <a
                  href="https://instagram.com/blossomglow.candles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-700"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com/blossomglowcandles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-700"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/919829012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-700"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[10px] text-stone-500 font-mono">
                100% Organic Soy Wax · Handcrafted in India
              </p>
              {currentUser && onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    closeAllMenus();
                    onLogout();
                  }}
                  className="text-xs text-rose-700 font-medium hover:underline cursor-pointer pt-1"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
