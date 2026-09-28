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
} from 'lucide-react';

interface CollectionsDropdownMenuProps {
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
      name: 'Sculptural & Buddha Candles',
      filterName: 'Decorative Candles',
      desc: 'Zen mudra meditating silhouettes for serene mindfulness spaces',
      tag: 'Sanctuary',
      icon: Compass,
    },
    {
      name: 'Home Décor Candles',
      filterName: 'Home Décor Candles',
      desc: 'Textured architectural ridges casting rhythmic geometric shadows',
      tag: 'Modernist',
      icon: Layers,
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
    <>
      {/* Backdrop overlay for closing on outside click */}
      <div
        className="fixed inset-0 bg-stone-950/25 backdrop-blur-2xs z-30 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown Container */}
      <div
        ref={containerRef}
        className="absolute top-full left-0 right-0 z-40 bg-[#FAF7F2] border-b border-stone-300 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* Top Quick Search & Experience Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4 border-b border-stone-200/80">
            <div
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-500 text-xs cursor-pointer shadow-2xs hover:border-amber-400 hover:text-stone-800 transition-all"
            >
              <Search className="w-4 h-4 text-stone-400" />
              <span>Search candles, scents, gifts...</span>
            </div>

            {onOpenScentQuiz && (
              <div
                onClick={() => {
                  onClose();
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
                    <p className="text-[10px] text-stone-600">60-second fragrance quiz</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-800" />
              </div>
            )}

            {onOpenCustomBlender && (
              <div
                onClick={() => {
                  onClose();
                  onOpenCustomBlender();
                }}
                className="p-2.5 px-3.5 bg-white border border-stone-300 rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/40 hover:bg-stone-50 transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                    <Wand2 className="w-3.5 h-3.5 text-amber-800" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-900">Custom Candle Blender</p>
                    <p className="text-[10px] text-stone-500">3D Interactive fragrance mixing</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
              </div>
            )}
          </div>

          {/* 4-COLUMN RICH ATELIER DIRECTORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-xs">
            {/* COLUMN 1: Shop By Category */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <Flame className="w-4 h-4 text-amber-800 shrink-0" />
                <span className="font-bold tracking-wider uppercase text-stone-900 text-[12px]">Shop By Category</span>
              </div>

              <button
                onClick={() => {
                  onClose();
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
                      onClose();
                      onNavigateToShop(cat.filterName);
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-white text-stone-700 hover:text-amber-950 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium group-hover:text-amber-900">{cat.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-amber-100/70 text-amber-900 rounded">{cat.tag}</span>
                    </div>
                    <p className="text-[10px] text-stone-400 group-hover:text-stone-500 truncate">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* COLUMN 2: Signature Series Collections */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <Layers className="w-4 h-4 text-amber-800 shrink-0" />
                <span className="font-bold tracking-wider uppercase text-stone-900 text-[12px]">Signature Collections</span>
              </div>

              <button
                onClick={() => {
                  onClose();
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
                      onClose();
                      onNavigateToShop(col.category);
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-white text-stone-700 hover:text-amber-950 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-stone-800 group-hover:text-amber-900 truncate">{col.name}</p>
                      <span className="text-[9px] font-mono text-amber-800 bg-amber-50 px-1 rounded">{col.highlight}</span>
                    </div>
                    <p className="text-[10px] text-amber-800/80 truncate">{col.notes}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* COLUMN 3: Curated Gifting & Hampers */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <Gift className="w-4 h-4 text-amber-800 shrink-0" />
                <span className="font-bold tracking-wider uppercase text-stone-900 text-[12px]">Gifts & Hampers</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigateToGifting();
                }}
                className="font-semibold text-amber-900 hover:text-amber-950 flex items-center justify-between w-full text-left py-1 hover:translate-x-0.5 transition-transform cursor-pointer"
              >
                <span>Curated Gift Sets</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </button>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShop('Gift Hampers');
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:bg-stone-50/50 transition-all cursor-pointer group shadow-2xs"
                >
                  <p className="text-[11px] font-semibold text-stone-900 group-hover:text-amber-900">The Sacred Evil Eye Protection Box</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">Royal blue talisman candle hamper with glass nazar charm</p>
                </button>

                {onOpenGiftBuilder && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenGiftBuilder();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-600/25 transition-all cursor-pointer group"
                  >
                    <p className="text-[11px] font-semibold text-amber-900 group-hover:text-amber-950 flex items-center justify-between">
                      <span>Build Custom Gift Hamper</span>
                      <ArrowRight className="w-3 h-3 text-amber-700" />
                    </p>
                    <p className="text-[10px] text-stone-600 mt-0.5">Curate bespoke boxes & handwritten wax seals</p>
                  </button>
                )}

                <button
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:bg-stone-50/50 transition-all cursor-pointer group shadow-2xs"
                >
                  <p className="text-[11px] font-semibold text-stone-900 group-hover:text-amber-900">Corporate & Wedding Concierge</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">Personalized custom wax seals & bespoke return favors</p>
                </button>
              </div>
            </div>

            {/* COLUMN 4: Atelier Story, Guides & Concierge */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                <Compass className="w-4 h-4 text-amber-800 shrink-0" />
                <span className="font-bold tracking-wider uppercase text-stone-900 text-[12px]">Our Story & Guides</span>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToAbout();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:bg-stone-50/50 transition-all cursor-pointer group shadow-2xs"
                >
                  <p className="text-[11px] font-semibold text-stone-900 group-hover:text-amber-900">Atelier Story & Artisans</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">Women empowerment & non-toxic botanical soy</p>
                </button>

                {onOpenCareGuide && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCareGuide();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:bg-stone-50/50 transition-all cursor-pointer group shadow-2xs"
                  >
                    <p className="text-[11px] font-semibold text-stone-900 group-hover:text-amber-900">Candle Care & Burn Guide</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Wick trimming & clean smokeless burn etiquette</p>
                  </button>
                )}

                {onOpenTracking && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTracking();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:bg-stone-50/50 transition-all cursor-pointer group shadow-2xs"
                  >
                    <p className="text-[11px] font-semibold text-stone-900 group-hover:text-amber-900 flex items-center justify-between">
                      <span>Track Order Status</span>
                      <Package className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700" />
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Live courier dispatch & parcel tracker</p>
                  </button>
                )}

                <button
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:bg-stone-50/50 transition-all cursor-pointer group shadow-2xs"
                >
                  <p className="text-[11px] font-semibold text-stone-900 group-hover:text-amber-900 flex items-center justify-between">
                    <span>Contact Concierge</span>
                    <PhoneCall className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700" />
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">Direct phone & WhatsApp atelier assistance</p>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenArchitecture();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200/60 text-stone-600 text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer"
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

          {/* Bottom Quick Bar */}
          <div className="pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                100% Handcrafted Botanical Soy Wax
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="hidden sm:inline">Free Shipping across India on orders over ₹999</span>
            </div>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-stone-200/70 hover:bg-stone-200 text-stone-700 hover:text-stone-950 font-medium transition-colors cursor-pointer ml-auto flex items-center gap-1.5 text-[11px]"
            >
              <span>Close Collections</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
