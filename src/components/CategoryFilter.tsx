import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { FragranceFamily } from '../types';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedFamily: FragranceFamily;
  onSelectFamily: (fam: FragranceFamily) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  onSortChange: (val: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  totalResults: number;
}

const CATEGORIES = [
  'All Creations',
  'Pillar Candles',
  'Jar & Container Candles',
  'Floating & Urli Sets',
  'Sculptural Candles',
  'Luxury Gift Hampers',
  'Botanical Bowls & Shells',
  'Diffusers & Home Accents'
];

const FAMILIES: FragranceFamily[] = [
  'All',
  'Floral',
  'Woody & Amber',
  'Fresh & Herbal',
  'Gourmand & Warm'
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedFamily,
  onSelectFamily,
  sortBy,
  onSortChange,
  totalResults
}) => {
  return (
    <div className="w-full space-y-4 pt-4 pb-2 border-b border-stone-200/80">
      {/* Category Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-2 text-xs uppercase tracking-wider font-medium rounded-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#262220] text-white shadow-sm'
                    : 'bg-stone-100/90 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sort & Count Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-stone-600">
          <span className="font-mono text-stone-500 tabular-nums">
            {totalResults} {totalResults === 1 ? 'candle' : 'creations'}
          </span>
          <span aria-hidden="true" className="text-stone-300">|</span>
          <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1.5 rounded-md border border-stone-200/60">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-stone-800 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fragrance Family Sub-filter */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs py-1 scrollbar-none">
        <span className="text-stone-500 uppercase tracking-widest text-[10px] font-semibold shrink-0">
          Scent Profile:
        </span>
        {FAMILIES.map((fam) => {
          const isActive = selectedFamily === fam;
          return (
            <button
              key={fam}
              onClick={() => onSelectFamily(fam)}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-amber-100/80 text-amber-950 font-semibold border border-amber-300'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              {fam}
            </button>
          );
        })}
      </div>
    </div>
  );
};
