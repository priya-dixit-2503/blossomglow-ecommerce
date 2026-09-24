import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedPromoSection } from './components/FeaturedPromoSection';
import { FavoritesShowcaseSection } from './components/FavoritesShowcaseSection';
import { CollectionsSection } from './components/CollectionsSection';
import { StorySections } from './components/StorySections';
import { PromotionalBanner } from './components/PromotionalBanner';
import { WhyBlossomGlowSection } from './components/WhyBlossomGlowSection';
import { GiftingSection } from './components/GiftingSection';
import { AboutBlossomGlowSection } from './components/AboutBlossomGlowSection';
import { InstagramSection } from './components/InstagramSection';
import { NewsletterSection } from './components/NewsletterSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BrandAtelierSection } from './components/BrandAtelierSection';
import { Footer } from './components/Footer';

// Catalog & Modals
import { CategoryFilter, PriceRange } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ScentQuizModal } from './components/ScentQuizModal';
import { GiftHamperBuilderModal } from './components/GiftHamperBuilderModal';
import { CandleCareGuideModal } from './components/CandleCareGuideModal';
import { SpringBootArchitectureModal } from './components/SpringBootArchitectureModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AuthModal } from './components/AuthModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { ContactModal } from './components/ContactModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SanctuaryAmbianceDock } from './components/SanctuaryAmbianceDock';
import { CustomCandleBlenderModal } from './components/CustomCandleBlenderModal';
import { AuraCollectionCircles } from './components/AuraCollectionCircles';

import { Product, CartItem, VesselColor, WickType, CandleSize, FragranceFamily, Order, UserProfile } from './types';
import { CandleApiService } from './services/api';
import { Flame, CheckCircle2, Wand2, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

const CART_STORAGE_KEY = 'auradecor_cart_v3';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return CandleApiService.getStoredUser();
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'admin'>('login');
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Filters & Sorting for full catalog
  const [selectedCategory, setSelectedCategory] = useState<string>('All Creations');
  const [selectedFamily, setSelectedFamily] = useState<FragranceFamily>('All');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Shopping Bag & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    return CandleApiService.getWishlist();
  });

  const [couponCode, setCouponCode] = useState('GLOW10');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Dynamic Ambiance Mode & Scent Lab
  const [isCandlelitMode, setIsCandlelitMode] = useState(false);
  const [isCustomBlenderOpen, setIsCustomBlenderOpen] = useState(false);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScentQuizOpen, setIsScentQuizOpen] = useState(false);
  const [isGiftBuilderOpen, setIsGiftBuilderOpen] = useState(false);
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingInitialOrderNumber, setTrackingInitialOrderNumber] = useState<string | undefined>();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Section Refs for smooth navigation
  const shopSectionRef = useRef<HTMLDivElement>(null);
  const collectionsSectionRef = useRef<HTMLDivElement>(null);
  const giftingSectionRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  // Load products with all active filter dimensions
  const fetchProducts = async () => {
    setLoading(true);

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (priceRange === 'under-500') {
      maxPrice = 500;
    } else if (priceRange === '500-1000') {
      minPrice = 500;
      maxPrice = 1000;
    } else if (priceRange === '1000-2000') {
      minPrice = 1000;
      maxPrice = 2000;
    } else if (priceRange === 'above-2000') {
      minPrice = 2000;
    }

    const data = await CandleApiService.getProducts({
      category: selectedCategory,
      fragranceFamily: selectedFamily,
      search: catalogSearch,
      minPrice,
      maxPrice,
      inStockOnly,
      sortBy,
    });
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedFamily, priceRange, inStockOnly, catalogSearch, sortBy]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const handleToggleWishlist = (productId: string) => {
    const updated = CandleApiService.toggleWishlist(productId);
    setWishlistIds(updated);
  };

  const handleAddToCart = (
    product: Product,
    vessel: VesselColor,
    wick: WickType,
    size: CandleSize,
    quantity: number
  ) => {
    let itemPrice = product.price;
    if (size === '180g (Single Wick)') itemPrice = Math.round(product.price * 0.85);
    if (size === '420g (3-Wick Grande)') itemPrice = Math.round(product.price * 1.45);

    const existingIndex = cartItems.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedVessel === vessel &&
        item.selectedWick === wick &&
        item.selectedSize === size
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        product,
        selectedVessel: vessel,
        selectedWick: wick,
        selectedSize: size,
        quantity,
        itemPrice,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(
      product,
      product.availableVessels[0] || 'Fluted Ivory',
      product.availableWicks[0] || 'Crackling Wood Wick',
      '280g (Double Wick)',
      1
    );
  };

  const handleAddCustomCandleToCart = (candleData: any) => {
    const customProduct: Product = {
      id: candleData.id,
      name: candleData.name,
      tagline: candleData.customLabel,
      category: 'Artisanal Decor',
      fragranceFamily: 'Woody & Amber',
      price: candleData.price,
      rating: 5.0,
      reviewsCount: 1,
      image: candleData.image,
      galleryImages: [candleData.image],
      burnTimeHours: candleData.burnTimeHours,
      weightGrams: candleData.weightGrams,
      scentIntensity: candleData.scentIntensity,
      scentPyramid: candleData.scentPyramid,
      description: `Bespoke blend: ${candleData.scentPyramid.topNotes.join('/')} top, ${candleData.scentPyramid.heartNotes.join('/')} heart, ${candleData.scentPyramid.baseNotes.join('/')} base.`,
      artisanStory: 'Custom hand-blended creation.',
      availableVessels: [candleData.vessel],
      availableWicks: [candleData.wick],
      inStock: true,
      waxType: candleData.waxType,
    };

    handleAddToCart(
      customProduct,
      candleData.vessel,
      candleData.wick,
      candleData.size,
      1
    );
    setIsCartOpen(true);
  };

  const handleAddCustomHamperToCart = (hamperData: any) => {
    const hamperProduct: Product = {
      id: hamperData.id,
      name: hamperData.name,
      tagline: `Bespoke curation: ${hamperData.selectedProducts.map((p: any) => p.name).join(', ')}`,
      category: 'Gift Hampers',
      fragranceFamily: 'Floral',
      price: hamperData.price,
      rating: 5.0,
      reviewsCount: 1,
      image: hamperData.image,
      galleryImages: [hamperData.image],
      burnTimeHours: 120,
      weightGrams: 850,
      scentIntensity: 5,
      scentPyramid: {
        topNotes: ['Festive Rose', 'Cardamom'],
        heartNotes: ['Jasmine Sambac', 'Lotus Nectar'],
        baseNotes: ['Mysore Sandalwood', 'Amber'],
      },
      description: `Includes handcrafted gift box with ribbon and ${hamperData.selectedProducts.length} artisanal candles.`,
      artisanStory: 'Hand-curated festive hamper.',
      availableVessels: ['Fluted Ivory'],
      availableWicks: ['Crackling Wood Wick'],
      inStock: true,
    };

    handleAddToCart(
      hamperProduct,
      'Fluted Ivory',
      'Crackling Wood Wick',
      '420g (3-Wick Grande)',
      1
    );
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item)));
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleApplyCoupon = (code: string): boolean => {
    if (code.toUpperCase() === 'GLOW10' || code.toUpperCase() === 'FESTIVE15') {
      setCouponCode(code.toUpperCase());
      return true;
    }
    return false;
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'admin' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    CandleApiService.logout();
    setCurrentUser(null);
  };

  const handleOpenAdmin = () => {
    // If not admin, open auth modal with admin tab
    if (!currentUser || currentUser.role !== 'ROLE_ADMIN') {
      handleOpenAuth('admin');
    } else {
      setIsAdminOpen(true);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All Creations');
    setSelectedFamily('All');
    setPriceRange('all');
    setInStockOnly(false);
    setCatalogSearch('');
    setSortBy('featured');
  };

  const handleScrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToShop = () => {
    shopSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToCollections = () => {
    const el = document.getElementById('collections');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToGifting = () => {
    const el = document.getElementById('gifting');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryCardClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    handleScrollToShop();
  };

  const handleTrackOrder = (orderNum: string) => {
    setTrackingInitialOrderNumber(orderNum);
    setIsTrackingOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-amber-100 transition-colors duration-700 ${
        isCandlelitMode ? 'bg-[#1A1614] text-[#EFEBE4]' : 'bg-[#FAF8F5] text-stone-900'
      }`}
    >
      {/* Candlelit Mode Warm Vignette Ambient Overlay */}
      {isCandlelitMode && (
        <div
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-700 opacity-60 mix-blend-color-burn"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.15) 0%, rgba(120, 53, 15, 0.25) 70%, rgba(20, 16, 14, 0.6) 100%)',
          }}
        />
      )}

      {/* 1. ANNOUNCEMENT BAR & 2. HEADER / NAVIGATION */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenScentQuiz={() => setIsScentQuizOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        onLogout={handleLogout}
        onNavigateToHome={handleScrollToHome}
        onNavigateToShop={(category?: string) => {
          if (category) setSelectedCategory(category);
          handleScrollToShop();
        }}
        onNavigateToCollections={handleScrollToCollections}
        onNavigateToAbout={handleScrollToAbout}
        onNavigateToGifting={handleScrollToGifting}
      />

      {/* Recent Order Banner if active */}
      {latestOrder && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 py-3 px-4 text-xs flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Order <strong>{latestOrder.orderNumber}</strong> confirmed! Handcrafting in progress. Estimated delivery: {latestOrder.estimatedDeliveryDate}.
            </span>
          </div>
          <button
            onClick={() => handleTrackOrder(latestOrder.orderNumber)}
            className="text-amber-900 dark:text-amber-300 font-semibold underline underline-offset-2 ml-4 shrink-0 cursor-pointer"
          >
            Track Courier
          </button>
        </div>
      )}

      {/* 3. HERO SECTION */}
      <HeroSection
        onShopCandles={handleScrollToShop}
        onExploreCollection={(category?: string) => {
          if (category) setSelectedCategory(category);
          handleScrollToShop();
        }}
      />

      {/* 4. SHOP BY COLLECTION CIRCLES */}
      <AuraCollectionCircles
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryCardClick}
      />

      {/* 5. FEATURED PROMO / CATEGORY CARDS */}
      <FeaturedPromoSection onSelectCategory={handleCategoryCardClick} />

      {/* 5. PRODUCT SHOWCASE: SHOP OUR FAVORITES (Tabs: New Arrivals / Best Sellers) */}
      <FavoritesShowcaseSection
        products={products}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onQuickView={(p) => setSelectedProduct(p)}
        onQuickAdd={handleQuickAdd}
        onViewAllCatalog={handleScrollToShop}
      />

      {/* 6. EDITORIAL STORY SECTION */}
      <StorySections
        onExploreProduct={handleCategoryCardClick}
        onOpenStory={handleScrollToAbout}
      />

      {/* 7. OUR COLLECTIONS */}
      <CollectionsSection onSelectCollection={handleCategoryCardClick} />

      {/* 8. FULL-WIDTH PROMOTIONAL BANNER */}
      <PromotionalBanner onShopNow={handleScrollToShop} />

      {/* 9. WHY CHOOSE BLOSSOMGLOW? */}
      <WhyBlossomGlowSection />

      {/* 10. GIFTING SECTION */}
      <GiftingSection
        onExploreGifting={handleScrollToShop}
        onOpenCustomHamper={() => setIsGiftBuilderOpen(true)}
      />

      {/* 11. COMPLETE CATALOG & FILTER ENGINE */}
      <section ref={shopSectionRef} id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10 w-full border-t border-stone-200/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-amber-800 dark:text-amber-400">
            Complete Artisan Collection
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 dark:text-stone-100 leading-tight">
            Explore All Creations
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
            Filter by scent family, price point, stock availability, or burn time to find the ideal match for your sacred space.
          </p>
        </div>

        {/* Enhanced Filter Controls */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedFamily={selectedFamily}
          onSelectFamily={setSelectedFamily}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          inStockOnly={inStockOnly}
          onInStockToggle={setInStockOnly}
          searchTerm={catalogSearch}
          onSearchChange={setCatalogSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={products.length}
          onResetFilters={handleResetFilters}
        />

        {/* Dynamic Interactive Atelier Scent Bar Invitation */}
        <div className="bg-gradient-to-r from-[#282320] via-[#362D28] to-[#25201D] text-stone-100 p-5 sm:p-6 rounded-3xl border border-amber-600/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-base sm:text-lg text-white font-normal">
                  Interactive Scent Laboratory
                </span>
                <span className="text-[9px] uppercase font-mono tracking-widest text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                  Live Customizer
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Blend your own custom Top, Heart, &amp; Base botanical pyramid with bespoke personalized label lettering.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsCustomBlenderOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-100 hover:bg-white text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Launch Scent Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Products Grid & States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-stone-100 dark:bg-stone-800/40 rounded-2xl p-4 animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-stone-200 dark:bg-stone-700/50 rounded-xl" />
                <div className="h-4 bg-stone-200 dark:bg-stone-700/50 rounded w-3/4" />
                <div className="h-3 bg-stone-200 dark:bg-stone-700/50 rounded w-1/2" />
                <div className="h-8 bg-stone-200 dark:bg-stone-700/50 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center space-y-3 bg-stone-50/50 dark:bg-stone-900/30 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-8">
            <Flame className="w-10 h-10 text-amber-500 mx-auto opacity-70 animate-bounce" />
            <h3 className="font-editorial text-2xl text-stone-800 dark:text-stone-200">No creations found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No artisanal candles match your selected filters or search terms. Try clearing some criteria to explore our full atelier vault.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={(p) => setSelectedProduct(p)}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}
      </section>

      {/* 13. REVIEWS & TESTIMONIALS */}
      <ReviewsSection />

      {/* 14. BRAND STORY / ABOUT SECTION */}
      <AboutBlossomGlowSection onOpenOurStory={() => setIsCareGuideOpen(true)} />

      {/* 15. INSTAGRAM / SOCIAL SHOWCASE */}
      <InstagramSection />

      {/* 16. NEWSLETTER SIGNUP */}
      <NewsletterSection />

      {/* 17. FOOTER */}
      <Footer
        onOpenScentQuiz={() => setIsScentQuizOpen(true)}
        onOpenGiftBuilder={() => setIsGiftBuilderOpen(true)}
        onOpenCareGuide={() => setIsCareGuideOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onNavigateToShop={(category?: string) => {
          if (category) setSelectedCategory(category);
          handleScrollToShop();
        }}
      />

      {/* Interactive Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExploreCatalog={handleScrollToShop}
        couponCode={couponCode}
        onApplyCoupon={handleApplyCoupon}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        onRemoveFromWishlist={handleToggleWishlist}
        onQuickAdd={handleQuickAdd}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <ScentQuizModal
        isOpen={isScentQuizOpen}
        onClose={() => setIsScentQuizOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onQuickAdd={handleQuickAdd}
      />

      <GiftHamperBuilderModal
        isOpen={isGiftBuilderOpen}
        onClose={() => setIsGiftBuilderOpen(false)}
        onAddHamperToCart={handleAddCustomHamperToCart}
      />

      <CandleCareGuideModal
        isOpen={isCareGuideOpen}
        onClose={() => setIsCareGuideOpen(false)}
      />

      <SpringBootArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        couponCode={couponCode}
        onOrderSuccess={(order) => {
          setLatestOrder(order);
          setCartItems([]);
        }}
      />

      <OrderTrackerModal
        isOpen={isTrackingOpen}
        onClose={() => {
          setIsTrackingOpen(false);
          setTrackingInitialOrderNumber(undefined);
        }}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        onTrackOrder={handleTrackOrder}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'ROLE_ADMIN') {
            setIsAdminOpen(true);
          }
        }}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductsChanged={fetchProducts}
      />

      {/* Scent Laboratory / Bespoke Candle Blender Modal */}
      <CustomCandleBlenderModal
        isOpen={isCustomBlenderOpen}
        onClose={() => setIsCustomBlenderOpen(false)}
        onAddCustomCandleToCart={handleAddCustomCandleToCart}
      />

      {/* Sensory Ambiance Dock & Virtual Flame Console */}
      <SanctuaryAmbianceDock
        isCandlelitMode={isCandlelitMode}
        onToggleCandlelitMode={() => setIsCandlelitMode(!isCandlelitMode)}
      />
    </div>
  );
}
