import React, { useRef, useEffect } from 'react';
import {
  Flame,
  Layers,
  Gift,
  Compass,
  Sparkles,
  Wand2,
  Search,
  ArrowRight,
  Package,
  PhoneCall,
  X,
  BookOpen,
  HeartHandshake,
  Check,
} from 'lucide-react';

export type MegaMenuTab = 'categories' | 'collections' | 'gifting' | 'experiences';

export interface CollectionsDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenScentQuiz?: () => void;
  onOpenCustomBlender?: () => void;
  onOpenGiftBuilder?: () => void;
  onOpenContact: () => void;
  onOpenCareGuide?: () => void;
  onOpenTracking?: () => void;
  onOpenArchitecture: () => void;
  onNavigateToShop: (category?: string) => void;
  onNavigateToCollections: () => void;
  onNavigateToAbout: () => void;
  onNavigateToGifting: () => void;
  isBackendConnected: boolean | null;
  activeTab?: MegaMenuTab;
  onTabChange?: (tab: MegaMenuTab) => void;
}

export const CollectionsDropdownMenu: React.FC<CollectionsDropdownMenuProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenScentQuiz,
  onOpenCustomBlender,
  onOpenGiftBuilder,
  onOpenContact,
  onOpenCareGuide,
  onOpenTracking,
  onOpenArchitecture,
  onNavigateToShop,
  onNavigateToCollections,
  onNavigateToAbout,
  onNavigateToGifting,
  isBackendConnected,
  activeTab = 'categories',
  onTabChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. Categories List
  const categories = [
    {
      name: 'Pillar Candles',
      filterName: 'Pillar Candles',
      desc: 'Smokeless fluted soy pillars with up to 50h clean luminescence',
      tag: 'Bestseller',
      icon: Flame,
    },
    {
      name: 'Jar & Container Candles',
      filterName: 'Jar & Container Candles',
      desc: 'Amber apothecary glass infused with therapeutic essential oils',
      tag: 'Aromatherapy',
      icon: Sparkles,
    },
    {
      name: 'Floating & Urli Sets',
      filterName: 'Floating & Urli Sets',
      desc: 'Artisan lotus water blooms with brass & copper accents',
      tag: 'Festive',
      icon: Layers,
    },
    {
      name: 'Sculptural & Buddha',
      filterName: 'Sculptural Candles',
      desc: 'Buddha serenity in meditative Dhyana mudra & architectural art',
      tag: 'Mindfulness',
      icon: Compass,
    },
    {
      name: 'Luxury Gift Hampers',
      filterName: 'Luxury Gift Hampers',
      desc: 'Sacred Evil Eye talisman boxes & gold-foil chest hampers',
      tag: 'Signature',
      icon: Gift,
    },
    {
      name: 'Botanical Bowls & Shells',
      filterName: 'Botanical Bowls & Shells',
      desc: 'Reclaimed coastal coconuts & hand-carved Himalayan wood dough boats',
      tag: 'Eco-Luxury',
      icon: Flame,
    },
    {
      name: 'Home Accents & Trays',
      filterName: 'Diffusers & Home Accents',
      desc: 'Jesmonite fluted trays, arch vases and minimalist clocks',
      tag: 'Modernist',
      icon: Layers,
    },
  ];

  // 2. Signature Editions
  const signatureCollections = [
    {
      name: 'Botanical Bloom Edition',
      notes: 'Damask Rose · Wild Jasmine · Warm Amber',
      desc: 'Intricately hand-sculpted 3D blooming roses crowned on organic soy wax',
      category: 'Jar & Container Candles',
      badge: 'Iconic',
    },
    {
      name: 'Tropical Spice Sanctuary',
      notes: 'Cinnamon Bark · Cardamom · Roasted Coconut',
      desc: 'Poured in genuine reclaimed coconut shells from coastal communities',
      category: 'Pillar Candles',
      badge: 'Eco-Craft',
    },
    {
      name: 'Nirvana Sanctuary',
      notes: 'Mysore Sandalwood · Oudh · Amber Resin',
      desc: 'Peaceful sculpted Buddha silhouette in tranquil meditative pose',
      category: 'Sculptural Candles',
      badge: 'Zen Altar',
    },
    {
      name: 'Zenith Bloom Lotus',
      notes: 'White Lotus Petals · Bamboo · Water Lily',
      desc: 'Sculpted lotus petals burning with crackling organic wooden wicks',
      category: 'Sculptural Candles',
      badge: 'New Edition',
    },
    {
      name: 'Modernist Sanctuary',
      notes: 'Sea Salt · Coastal Sage · Crisp Citrus',
      desc: 'Textured architectural ridges casting rhythmic geometric shadows',
      category: 'Diffusers & Home Accents',
      badge: 'Minimalist',
    },
    {
      name: 'Heritage Hearth Troughs',
      notes: 'Smoked Vanilla · Cedarwood · Star Anise',
      desc: 'Solid hand-carved oblong wood boat with natural dried botanicals',
      category: 'Botanical Bowls & Shells',
      badge: 'Centerpiece',
    },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-stone-950/30 backdrop-blur-xs z-30 transition-opacity animate-in fade-in duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Dropdown Container */}
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-full left-0 right-0 z-40 bg-[#FAF7F2] border-b border-stone-300 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* TOP BAR: Nav tabs & Quick Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/90">
            {/* Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange && onTabChange('categories');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-[#1C1815] text-[#FAF8F5] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                Shop By Category
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange && onTabChange('collections');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'collections'
                    ? 'bg-[#1C1815] text-[#FAF8F5] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                Signature Collections
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange && onTabChange('gifting');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'gifting'
                    ? 'bg-[#1C1815] text-[#FAF8F5] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                Gifting & Bespoke
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange && onTabChange('experiences');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'experiences'
                    ? 'bg-[#1C1815] text-[#FAF8F5] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                Experiences & Care
              </button>
            </div>

            {/* Quick Search and Close */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  onOpenSearch();
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-500 hover:text-stone-900 hover:border-amber-500 text-xs transition-colors cursor-pointer"
                title="Search candles and fragrances"
              >
                <Search className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden sm:inline">Search creations...</span>
                <span className="sm:hidden">Search</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
                title="Close menu (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TAB 1: SHOP BY CATEGORY */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
              {/* Left 8 Cols: Category Cards */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Artisanal Candle Categories
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onNavigateToShop('All Creations');
                    }}
                    className="text-xs font-medium text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View All Creations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onNavigateToShop(cat.filterName);
                        }}
                        className="text-left p-3 rounded-xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                              {cat.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 group-hover:text-amber-800 transition-colors">
                            {cat.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-1 pl-8">
                          {cat.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right 4 Cols: Featured Spotlight Card */}
              <div className="md:col-span-4 bg-[#F5EFE6] border border-amber-900/15 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Featured In Atelier</span>
                  </div>
                  <h4 className="font-serif text-base text-stone-900 font-bold mb-1">
                    Amber Rose Floral Garden Jar
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    Hand-sculpted 3D blooming roses crowned over clean organic soy wax in clear apothecary glass with natural bamboo lid.
                  </p>
                  <div className="text-xs text-stone-500 space-y-1 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>100% Organic Soy & Cotton Wick</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>45 Hours Clean Burn Time</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-amber-900/10">
                  <div>
                    <span className="text-stone-400 line-through text-xs mr-1.5">₹799</span>
                    <span className="text-sm font-bold text-amber-950">₹599</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onNavigateToShop('Jar & Container Candles');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#1C1815] text-[#FAF8F5] text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIGNATURE COLLECTIONS */}
          {activeTab === 'collections' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-stone-200">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Artisanal Fragrance Series
                  </h3>
                  <p className="text-xs text-stone-500">
                    Master-blended aromatics crafted for specific moods, rituals and mindful sanctuaries
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onNavigateToCollections();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-900 text-amber-100 hover:bg-amber-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Explore All Collections on Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {signatureCollections.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onNavigateToShop(col.category);
                    }}
                    className="text-left p-3.5 rounded-xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                        {col.name}
                      </span>
                      <span className="text-[10px] font-medium text-amber-800">
                        {col.badge}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-amber-900/80 mb-1">
                      {col.notes}
                    </p>
                    <p className="text-[11px] text-stone-500 line-clamp-2">
                      {col.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GIFTING & BESPOKE */}
          {activeTab === 'gifting' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Curated Hampers */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                    <Gift className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-stone-900 mb-1">Curated Gift Chest Hampers</h4>
                  <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                    Royal turquoise and gold-foil gift boxes with authentic evil eye glass nazars and hand-tied satin ribbons.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onNavigateToGifting();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Explore Gift Sets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: Custom Hamper Builder */}
              <div className="p-4 rounded-2xl bg-white border border-amber-300/80 bg-gradient-to-b from-amber-500/5 to-transparent flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-200/70 text-amber-950 flex items-center justify-center mb-3">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-stone-900 mb-1">Custom Gift Hamper Builder</h4>
                  <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                    Select your box size, handpick candle pairs, choose matches, and include a personalized wax-sealed handwritten note.
                  </p>
                </div>
                {onOpenGiftBuilder && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onOpenGiftBuilder();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-amber-900 text-amber-100 hover:bg-amber-950 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Build Custom Hamper</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Card 3: Wedding & Corporate Concierge */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center mb-3">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-stone-900 mb-1">Corporate & Wedding Favors</h4>
                  <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                    Custom fragrances, monogrammed wax seals, and luxury packaging tailored for corporate milestones and intimate weddings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onOpenContact();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Inquire with Atelier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCES & CARE */}
          {activeTab === 'experiences' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Scent Quiz */}
              {onOpenScentQuiz && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onOpenScentQuiz();
                  }}
                  className="text-left p-3.5 rounded-xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 mb-0.5">
                    60-Second Scent Quiz
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Discover the botanical candle tailored to your mood and aromatic profile
                  </p>
                </button>
              )}

              {/* Custom Candle Blender */}
              {onOpenCustomBlender && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onOpenCustomBlender();
                  }}
                  className="text-left p-3.5 rounded-xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 mb-0.5">
                    Custom Candle Blender
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Blend vessels, fragrance pyramids, and crackling wood wicks in 3D
                  </p>
                </button>
              )}

              {/* Candle Care Guide */}
              {onOpenCareGuide && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onOpenCareGuide();
                  }}
                  className="text-left p-3.5 rounded-xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center mb-2">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 mb-0.5">
                    Candle Care & Burn Etiquette
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Pro tips for wick trimming, memory rings, and soot-free combustion
                  </p>
                </button>
              )}

              {/* Live Order Tracker */}
              {onOpenTracking && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onOpenTracking();
                  }}
                  className="text-left p-3.5 rounded-xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center mb-2">
                    <Package className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 mb-0.5">
                    Live Courier Tracker
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Real-time dispatch status and courier tracking for your orders
                  </p>
                </button>
              )}
            </div>
          )}

          {/* BOTTOM FOOTER OF DROPDOWN */}
          <div className="pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-3">
              <span className="text-stone-700 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                100% Handcrafted Botanical Soy Wax
              </span>
              <span className="hidden sm:inline text-stone-300">·</span>
              <span className="hidden sm:inline">Free Shipping across India on orders over ₹999</span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  onOpenContact();
                }}
                className="text-stone-600 hover:text-amber-900 font-medium flex items-center gap-1.5 cursor-pointer text-[11px]"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Concierge & Support</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  onOpenArchitecture();
                }}
                className="px-2 py-0.5 rounded-md bg-stone-200/80 hover:bg-stone-200 text-stone-700 text-[10px] font-mono flex items-center gap-1.5 cursor-pointer"
                title="Spring Boot 8080 Backend REST API Status"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>API 8080</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
