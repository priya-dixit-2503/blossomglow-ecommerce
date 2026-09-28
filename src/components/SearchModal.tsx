import React, { useState, useEffect } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { CandleApiService } from '../services/api';
import { resolveImage } from '../utils/productNormalizer';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchResults = async () => {
      setLoading(true);
      const res = await CandleApiService.getProducts({ search: searchTerm });
      setResults(res);
      setLoading(false);
    };

    const timer = setTimeout(fetchResults, 120);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  const popularSearches = ['Damask Rose', 'Golden Amber', 'Mysore Sandalwood', 'Fluted Pillar', 'Gift Hamper', 'Lavender'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by scent note, candle name, or mood..."
            className="w-full text-sm sm:text-base bg-transparent focus:outline-none placeholder:text-stone-400 text-stone-900"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-800 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="px-5 py-3 bg-stone-50 border-b border-stone-200/80 flex items-center gap-2 overflow-x-auto text-xs text-stone-500 scrollbar-none">
          <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-400 shrink-0">
            Suggested:
          </span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setSearchTerm(term)}
              className="px-2.5 py-1 rounded bg-white hover:bg-stone-200/60 border border-stone-200 text-stone-700 transition-colors shrink-0"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-2">
          {loading ? (
            <div className="py-10 text-center text-xs text-stone-400">
              Searching fragrance notes...
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-xs text-stone-500">
              No matching candle creations found for "{searchTerm}".
            </div>
          ) : (
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-4 group border border-transparent hover:border-stone-200"
              >
                <img
                  src={resolveImage(product.image || (product as any)?.imageUrl, product.id, product.name)}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/products/floral-garden.jpg';
                  }}
                  className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 uppercase tracking-wider">
                    <span>{product.fragranceFamily}</span>
                    <span>·</span>
                    <span>{product.burnTimeHours}h Burn</span>
                  </div>
                  <h4 className="text-sm font-medium text-stone-900 group-hover:text-amber-800 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {product.scentPyramid.topNotes.join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                    ₹{product.price}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 ml-auto mt-1 transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
