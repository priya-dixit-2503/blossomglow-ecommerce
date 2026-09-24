import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCT_ASSETS } from '../assets/products';

interface FeaturedPromoSectionProps {
  onSelectCategory: (categoryName: string) => void;
}

interface PromoCard {
  title: string;
  subtitle: string;
  categoryFilter: string;
  image: string;
  badge: string;
}

const FEATURED_PROMOS: PromoCard[] = [
  {
    title: 'Scented Pillar Candles',
    subtitle: 'Coastal Calm & Amber Sandalwood with 25h smokeless radiance',
    categoryFilter: 'Pillar Candles',
    image: PRODUCT_ASSETS.naturalSpice,
    badge: '100% Smokeless',
  },
  {
    title: 'Floating & Urli Sets',
    subtitle: 'Hand-sculpted floating rose & lotus flowers with hammered golden urlis',
    categoryFilter: 'Floating & Urli Sets',
    image: PRODUCT_ASSETS.lotusGlow,
    badge: 'Festive Illumination',
  },
  {
    title: 'Amber Jar Soya Candles',
    subtitle: 'Pure therapeutic essential oils & slow-burn botanical wax jars',
    categoryFilter: 'Jar & Container Candles',
    image: PRODUCT_ASSETS.floralGarden,
    badge: 'Apothecary Aromatherapy',
  },
  {
    title: 'Luxury Gift Hampers',
    subtitle: 'Sacred Evil Eye protection chests & gilded lotus celebration boxes',
    categoryFilter: 'Luxury Gift Hampers',
    image: PRODUCT_ASSETS.gildedLotusHamper,
    badge: 'Gold Foil Rigid Chests',
  },
];

export const FeaturedPromoSection: React.FC<FeaturedPromoSectionProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#F7F3EE] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Subtle Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-amber-900 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              BlossomGlow Signatures
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-light text-stone-900 leading-tight">
              Curated Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md">
            Handcrafted with love, infused with pure essential oils, and made to illuminate every corner of your home.
          </p>
        </div>

        {/* 4 Card Promo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PROMOS.map((promo) => (
            <div
              key={promo.title}
              onClick={() => onSelectCategory(promo.categoryFilter)}
              className="group relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              {/* Background Image */}
              <img
                src={promo.image}
                alt={promo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-[0.78] group-hover:brightness-[0.70]"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300" />

              {/* Top Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-white/20 text-amber-300 text-[10px] font-mono uppercase tracking-wider shadow-sm">
                  {promo.badge}
                </span>
              </div>

              {/* Bottom Card Copy & CTA */}
              <div className="absolute bottom-0 inset-x-0 p-6 space-y-2 text-white">
                <h3 className="font-editorial text-2xl font-light tracking-wide text-white group-hover:text-amber-200 transition-colors">
                  {promo.title}
                </h3>
                <p className="text-xs text-stone-300 font-light line-clamp-2 leading-relaxed">
                  {promo.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 group-hover:text-amber-200">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
