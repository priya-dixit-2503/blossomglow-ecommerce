import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FavoritesShowcaseSectionProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onViewAllCatalog: () => void;
}

type TabType = 'best-sellers' | 'pillars-jars' | 'floating-festive' | 'gift-hampers';

export const FavoritesShowcaseSection: React.FC<FavoritesShowcaseSectionProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
  onViewAllCatalog,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('best-sellers');

  // Filter based on active tab
  const displayedProducts = products.filter((p) => {
    if (activeTab === 'best-sellers') {
      return p.isBestSeller;
    }
    if (activeTab === 'pillars-jars') {
      return p.category === 'Pillar Candles' || p.category === 'Jar & Container Candles' || p.category === 'Gift Candles' || p.category === 'Scented Candles';
    }
    if (activeTab === 'floating-festive') {
      return p.category === 'Floating & Urli Sets' || p.category === 'Decorative Candles';
    }
    if (activeTab === 'gift-hampers') {
      return p.category === 'Luxury Gift Hampers' || p.category === 'Gift Hampers';
    }
    return true;
  });

  // Take top 4 or fallback to first 4
  const finalProducts = displayedProducts.length > 0 ? displayedProducts.slice(0, 4) : products.slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-900">
            <span>BlossomGlow Bestsellers</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 leading-tight">
            Shop Our Favorites
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Discover the creations our customers love most. Crafted for clean, smokeless burn and infused with pure essential oils to awaken your senses.
          </p>

          {/* Tab buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('best-sellers')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'best-sellers'
                  ? 'bg-[#161311] text-amber-300 shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
              }`}
            >
              Bestselling Candles
            </button>
            <button
              onClick={() => setActiveTab('pillars-jars')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'pillars-jars'
                  ? 'bg-[#161311] text-amber-300 shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
              }`}
            >
              Pillars &amp; Jars
            </button>
            <button
              onClick={() => setActiveTab('floating-festive')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'floating-festive'
                  ? 'bg-[#161311] text-amber-300 shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
              }`}
            >
              Floating &amp; Urli Sets
            </button>
            <button
              onClick={() => setActiveTab('gift-hampers')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'gift-hampers'
                  ? 'bg-[#161311] text-amber-300 shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
              }`}
            >
              Luxury Gift Hampers
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {finalProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center pt-6">
          <button
            onClick={onViewAllCatalog}
            className="px-8 py-3.5 bg-stone-900 hover:bg-black text-amber-300 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 group cursor-pointer active:scale-95"
          >
            <span>EXPLORE ALL BLOSSOMGLOW CREATIONS</span>
            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
