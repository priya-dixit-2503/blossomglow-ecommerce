import React from 'react';
import { SlidersHorizontal, Search, X, Check, ArrowUpDown } from 'lucide-react';
import { FragranceFamily } from '../types';

export type PriceRange = 'all' | 'under-500' | '500-1000' | '1000-2000' | 'above-2000';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedFamily: FragranceFamily;
  onSelectFamily: (fam: FragranceFamily) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  inStockOnly: boolean;
  onInStockToggle: (val: boolean) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  onSortChange: (val: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating') => void;
  totalResults: number;
  onResetFilters: () => void;
}

const CATEGORIES = [
  'All Creations',
  'Pillar Candles',
  'Jar & Container Candles',
  'Floating & Urli Sets',
  'Sculptural Candles',
  'Luxury Gift Hampers',
  'Botanical Bowls & Shells',
  'Diffusers & Home Accents',
];

const FAMILIES: FragranceFamily[] = [
  'All',
  'Floral',
  'Woody & Amber',
  'Fresh & Herbal',
  'Gourmand & Warm',
];

const PRICE_OPTIONS: { id: PriceRange; label: string }[] = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-500', label: 'Under ₹500' },
  { id: '500-1000', label: '₹500 - ₹1,000' },
  { id: '1000-2000', label: '₹1,000 - ₹2,000' },
  { id: 'above-2000', label: '₹2,000+' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedFamily,
  onSelectFamily,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockToggle,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  totalResults,
  onResetFilters,
}) => {
  const hasActiveFilters =
    selectedCategory !== 'All Creations' ||
    selectedFamily !== 'All' ||
    priceRange !== 'all' ||
    inStockOnly ||
    searchTerm.trim() !== '' ||
    sortBy !== 'featured';

  return (
    <div className="w-full space-y-4 pt-6 pb-4 border-b border-stone-200 dark:border-stone-800">
      {/* Search and Quick Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candles by note, mood, wax..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all placeholder:text-stone-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side: Sort, In-Stock, Count */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* In-Stock Toggle */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 cursor-pointer hover:border-amber-700/40 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockToggle(e.target.checked)}
              className="accent-amber-800 rounded w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-stone-700 dark:text-stone-300 font-medium text-xs">In Stock Only</span>
          </label>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-stone-800 dark:text-stone-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Results count */}
          <span className="font-mono text-stone-500 dark:text-stone-400 text-xs px-1">
            {totalResults} {totalResults === 1 ? 'creation' : 'creations'}
          </span>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-800 dark:text-amber-400 hover:text-amber-900 font-medium hover:underline cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Segmented Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-2 text-xs uppercase tracking-wider font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-900 text-white shadow-sm ring-1 ring-amber-950 font-semibold'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Second Row: Scent Family & Price Range */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
        {/* Fragrance Family Sub-filter */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-stone-400 dark:text-stone-500 uppercase tracking-widest text-[10px] font-semibold shrink-0">
            Aromatics:
          </span>
          {FAMILIES.map((fam) => {
            const isActive = selectedFamily === fam;
            return (
              <button
                key={fam}
                onClick={() => onSelectFamily(fam)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-semibold border border-amber-300/80 dark:border-amber-800'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {fam}
              </button>
            );
          })}
        </div>

        {/* Price Ranges */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-stone-400 dark:text-stone-500 uppercase tracking-widest text-[10px] font-semibold shrink-0">
            Price:
          </span>
          {PRICE_OPTIONS.map((po) => {
            const isActive = priceRange === po.id;
            return (
              <button
                key={po.id}
                onClick={() => onPriceRangeChange(po.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-semibold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {po.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
