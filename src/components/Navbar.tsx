import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, ShieldCheck, PhoneCall, Code2, Package, User, LogOut, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
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

  // Check Spring Boot status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const live = await CandleApiService.checkBackendHealth();
      setIsBackendConnected(live);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate announcement if configured
  useEffect(() => {
    if (!ANNOUNCEMENT_CONFIG.autoRotate || ANNOUNCEMENT_CONFIG.announcements.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENT_CONFIG.announcements.length);
    }, ANNOUNCEMENT_CONFIG.rotationIntervalMs);
    return () => clearInterval(interval);
  }, []);

  const currentAnnouncement = ANNOUNCEMENT_CONFIG.announcements[activeAnnouncementIdx] || ANNOUNCEMENT_CONFIG.announcements[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/98 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* 1. Thin Announcement Bar at the very top */}
      {ANNOUNCEMENT_CONFIG.enabled && (
        <div className="bg-[#181412] text-[#FAF8F5] px-4 py-2 text-xs font-normal tracking-wide flex items-center justify-between border-b border-stone-800">
          <div className="mx-auto flex items-center gap-2 text-center text-[11px] sm:text-xs">
            <span className="text-amber-300 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 inline" />
              {currentAnnouncement.badge || 'BlossomGlow'}
            </span>
            <span className="opacity-40">&bull;</span>
            <span className="font-light tracking-wide">{currentAnnouncement.text}</span>
            {currentAnnouncement.linkText && (
              <>
                <span className="hidden sm:inline opacity-40">&bull;</span>
                <span className="hidden sm:inline text-amber-200 font-medium">
                  {currentAnnouncement.linkText}
                </span>
              </>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] text-stone-300">
            {/* Backend Connectivity Indicator */}
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-800/90 hover:bg-stone-700 transition-colors text-[10px] font-mono cursor-pointer"
              title="Click to view Spring Boot & MySQL architecture"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-stone-300">
                {isBackendConnected ? 'Spring Boot 8080 Active' : 'Spring Boot: Ready'}
              </span>
            </button>

            {onOpenTracking && (
              <button
                onClick={onOpenTracking}
                className="hover:text-amber-200 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Track Order</span>
              </button>
            )}

            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-amber-200 transition-colors uppercase font-mono tracking-wider"
              title="View Spring Boot & MySQL Architecture"
            >
              <Code2 className="w-3 h-3 text-amber-400" />
              <span>API Specs</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Name */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-stone-700 hover:text-stone-950 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            onClick={onNavigateToHome}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-3 shrink-0 py-1"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500/15 border border-amber-600/30 flex items-center justify-center text-amber-800 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-editorial text-2xl sm:text-[27px] font-medium tracking-wide text-stone-950 group-hover:text-amber-900 transition-colors whitespace-nowrap">
                BlossomGlow
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] text-stone-500 font-medium block mt-1 whitespace-nowrap group-hover:text-amber-800">
                Candle Creations
              </span>
            </div>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-semibold uppercase tracking-[0.14em] text-stone-700">
          <button
            onClick={onNavigateToHome}
            className="hover:text-stone-950 hover:underline underline-offset-8 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onNavigateToShop('Pillar Candles')}
            className="hover:text-stone-950 hover:underline underline-offset-8 transition-colors cursor-pointer"
          >
            Pillar Candles
          </button>
          <button
            onClick={() => onNavigateToShop('Jar & Container Candles')}
            className="hover:text-stone-950 hover:underline underline-offset-8 transition-colors cursor-pointer"
          >
            Jar Candles
          </button>
          <button
            onClick={() => onNavigateToShop('Floating & Urli Sets')}
            className="hover:text-stone-950 hover:underline underline-offset-8 transition-colors cursor-pointer text-amber-900 font-bold"
          >
            Floating &amp; Urli
          </button>
          <button
            onClick={() => onNavigateToShop('Sculptural Candles')}
            className="hover:text-stone-950 hover:underline underline-offset-8 transition-colors cursor-pointer"
          >
            Sculptural
          </button>
          <button
            onClick={onNavigateToGifting}
            className="hover:text-stone-950 hover:underline underline-offset-8 transition-colors cursor-pointer"
          >
            Gift Hampers
          </button>
          {onOpenOrderHistory && (
            <button
              onClick={onOpenOrderHistory}
              className="hover:text-stone-950 hover:underline underline-offset-8 transition-colors cursor-pointer flex items-center gap-1 text-stone-600"
            >
              <Package className="w-3.5 h-3.5 text-amber-700" />
              <span>Orders</span>
            </button>
          )}
          <button
            onClick={onNavigateToAbout}
            className="hover:text-stone-950 hover:underline underline-offset-8 transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={onOpenContact}
            className="hover:text-stone-950 hover:underline underline-offset-8 transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Right: Actions (Search, Scent Quiz, Auth / Account, Wishlist, Cart) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Search Icon */}
          <button
            onClick={onOpenSearch}
            className="p-2 sm:p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Search creations"
            title="Search creations"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Scent Quiz / Fragrance Finder */}
          {onOpenScentQuiz && (
            <button
              onClick={onOpenScentQuiz}
              className="hidden md:flex p-2 sm:p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
              aria-label="Scent Finder Quiz"
              title="Aura Scent Finder Quiz"
            >
              <Sparkles className="w-5 h-5 text-amber-700" />
            </button>
          )}

          {/* User Account / Auth Dropdown */}
          <div className="relative">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-stone-300 hover:border-amber-700/50 bg-stone-100/80 hover:bg-white transition-all text-xs font-medium cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center font-bold text-[11px]">
                    {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline text-stone-800 max-w-[90px] truncate">
                    {currentUser.fullName.split(' ')[0]}
                  </span>
                  {currentUser.role === 'ROLE_ADMIN' && (
                    <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] bg-amber-200 text-amber-900 font-bold uppercase">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono">
                        {currentUser.role === 'ROLE_ADMIN' ? 'Administrator' : 'Customer Account'}
                      </span>
                    </div>

                    {onOpenOrderHistory && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenOrderHistory();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-amber-700" />
                        <span>My Order History</span>
                      </button>
                    )}

                    {currentUser.role === 'ROLE_ADMIN' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-900 font-medium hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 dark:border-stone-800 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer"
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

          {/* Admin Dashboard Quick Access */}
          <button
            onClick={onOpenAdmin}
            className="p-2 sm:p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 rounded-full transition-colors relative group cursor-pointer"
            aria-label="Admin Dashboard"
            title="Admin Dashboard (Manage Products & Orders)"
          >
            <ShieldCheck className="w-5 h-5 text-stone-700 group-hover:text-amber-800" />
            <span className="sr-only">Admin</span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={onOpenWishlist}
            className="p-2 sm:p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 rounded-full transition-colors relative cursor-pointer"
            aria-label="Wishlist"
            title="Saved Favorites"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag / Cart */}
          <button
            onClick={onOpenCart}
            className="p-2.5 sm:px-3.5 sm:py-2 text-stone-900 bg-amber-400/90 hover:bg-amber-400 rounded-full transition-all flex items-center gap-2 shadow-sm hover:shadow cursor-pointer active:scale-95"
            aria-label="Shopping Cart"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-stone-950" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#161311] text-amber-300 rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold tracking-wider text-stone-950 uppercase">
              Bag
            </span>
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer / Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-stone-300 shadow-xl px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-1 pb-4 border-b border-stone-200 text-sm font-semibold uppercase tracking-wider text-stone-800">
            <button
              onClick={() => {
                onNavigateToHome();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigateToShop('Pillar Candles');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Scented Pillar Candles
            </button>
            <button
              onClick={() => {
                onNavigateToShop('Jar & Container Candles');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Amber Jar Soya Candles
            </button>
            <button
              onClick={() => {
                onNavigateToShop('Floating & Urli Sets');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-amber-900 font-bold transition-colors"
            >
              Floating Flower &amp; Urli Sets
            </button>
            <button
              onClick={() => {
                onNavigateToShop('Sculptural Candles');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Sculptural Candles
            </button>
            <button
              onClick={() => {
                onNavigateToGifting();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Luxury Gift Hampers
            </button>
            {onOpenOrderHistory && (
              <button
                onClick={() => {
                  onOpenOrderHistory();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-amber-900 font-bold flex items-center gap-2 transition-colors"
              >
                <Package className="w-4 h-4 text-amber-700" />
                <span>My Orders</span>
              </button>
            )}
            {onOpenTracking && (
              <button
                onClick={() => {
                  onOpenTracking();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center gap-2 transition-colors"
              >
                <Package className="w-4 h-4 text-stone-500" />
                <span>Track Courier Order</span>
              </button>
            )}
            <button
              onClick={() => {
                onNavigateToAbout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 transition-colors"
            >
              About BlossomGlow Atelier
            </button>
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Contact Support
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-500 font-light">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>{BRAND_CONFIG.phone}</span>
            </div>
            <span>Pan-India Free Delivery Above ₹999</span>
          </div>
        </div>
      )}
    </header>
  );
};
