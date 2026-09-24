import React from 'react';
import { Sparkles } from 'lucide-react';
import { PRODUCT_ASSETS } from '../assets/products';

interface CollectionItem {
  id: string;
  name: string;
  image: string;
  count: string;
  categoryFilter: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: 'all',
    name: 'All Creations',
    image: PRODUCT_ASSETS.gildedLotusHamper,
    count: 'View All',
    categoryFilter: 'All Creations',
  },
  {
    id: 'pillars',
    name: 'Pillar Candles',
    image: PRODUCT_ASSETS.naturalSpice,
    count: 'Smokeless 25h',
    categoryFilter: 'Pillar Candles',
  },
  {
    id: 'jars',
    name: 'Amber Jars',
    image: PRODUCT_ASSETS.floralGarden,
    count: 'Pure Soy Wax',
    categoryFilter: 'Jar & Container Candles',
  },
  {
    id: 'floating',
    name: 'Floating Flowers',
    image: PRODUCT_ASSETS.lotusGlow,
    count: 'Pooja & Festive',
    categoryFilter: 'Floating & Urli Sets',
  },
  {
    id: 'urli-hamper',
    name: 'Urli & Hampers',
    image: PRODUCT_ASSETS.gildedLotusHamper,
    count: 'Festive Luxury',
    categoryFilter: 'Luxury Gift Hampers',
  },
  {
    id: 'buddha',
    name: 'Sculptural & Zen',
    image: PRODUCT_ASSETS.buddhaSerenity,
    count: 'Meditating Art',
    categoryFilter: 'Sculptural Candles',
  },
  {
    id: 'wood-bowls',
    name: 'Wooden Bowls',
    image: PRODUCT_ASSETS.woodenDoughBowl,
    count: 'Multi-Wick Boat',
    categoryFilter: 'Botanical Bowls & Shells',
  },
  {
    id: 'trays-jesmonite',
    name: 'Trays & Accents',
    image: PRODUCT_ASSETS.flutedMarbledTrayDuo,
    count: 'Jesmonite Decor',
    categoryFilter: 'Diffusers & Home Accents',
  },
  {
    id: 'evil-eye',
    name: 'Evil Eye Boxes',
    image: PRODUCT_ASSETS.evilEyeBox,
    count: 'Nazar Protection',
    categoryFilter: 'Luxury Gift Hampers',
  },
];

interface AuraCollectionCirclesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const AuraCollectionCircles: React.FC<AuraCollectionCirclesProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="w-full bg-[#FAF8F5] py-8 sm:py-12 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] font-semibold text-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-stone-900 font-light">
            Shop by Collection
          </h2>
          <p className="text-xs text-stone-500 font-light">
            Hand-poured with love in small batches with 100% natural botanical wax
          </p>
        </div>

        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x">
          {COLLECTIONS.map((col) => {
            const isActive =
              (col.categoryFilter === 'All Creations' && selectedCategory === 'All Creations') ||
              selectedCategory === col.categoryFilter;

            return (
              <button
                key={col.id}
                onClick={() => onSelectCategory(col.categoryFilter)}
                className="group flex flex-col items-center shrink-0 snap-center transition-all focus:outline-none"
              >
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-amber-600 ring-offset-2 ring-offset-[#FAF8F5] scale-105 shadow-md'
                      : 'hover:ring-2 hover:ring-amber-400 hover:ring-offset-2 hover:ring-offset-[#FAF8F5] hover:scale-105'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-stone-200 border border-stone-300/80 shadow-inner">
                    <img
                      src={col.image}
                      alt={col.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                <span
                  className={`mt-2.5 text-xs font-medium tracking-wide text-center transition-colors ${
                    isActive ? 'text-amber-900 font-semibold' : 'text-stone-700 group-hover:text-stone-950'
                  }`}
                >
                  {col.name}
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  {col.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
