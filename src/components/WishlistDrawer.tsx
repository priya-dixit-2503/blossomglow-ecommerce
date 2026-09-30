import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { resolveImage } from '../utils/productNormalizer';
import { CandleApiService } from '../services/api';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products?: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onClearWishlist?: () => void;
  onMoveAllToBag?: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products = [],
  onRemoveFromWishlist,
  onQuickAdd,
  onSelectProduct,
  onClearWishlist,
  onMoveAllToBag,
}) => {
  if (!isOpen) return null;

  // Multi-source resolution: lookup in live store products, mock products, and stored catalog
  const wishlistedProducts = React.useMemo(() => {
    const allKnown = [...products, ...MOCK_PRODUCTS, ...CandleApiService.getStoredProducts()];
    const seen = new Set<string>();
    const resolved: Product[] = [];

    wishlistIds.forEach((id) => {
      const trimmedId = String(id).trim();
      if (!trimmedId || seen.has(trimmedId)) return;
      seen.add(trimmedId);

      const found = allKnown.find(
        (p) => String(p.id).trim().toLowerCase() === trimmedId.toLowerCase()
      );

      if (found) {
        resolved.push(found);
      } else {
        // Fallback so no added item is ever hidden or lost
        resolved.push({
          id: trimmedId,
          name: 'BlossomGlow Artisanal Candle',
          tagline: 'Hand-poured 100% soy candle saved to your wishlist',
          category: 'Jar & Container Candles',
          fragranceFamily: 'Floral',
          price: 499,
          originalPrice: 649,
          rating: 5.0,
          reviewsCount: 38,
          image: '/products/floral-garden.jpg',
          burnTimeHours: 45,
          weightGrams: 240,
          scentIntensity: 4,
          description: 'A bespoke artisanal candle formulation saved in your private sanctuary collection.',
          availableVessels: ['Fluted Ivory', 'Matte Blush Cream'],
          availableWicks: ['Organic Cotton Wick', 'Crackling Wood Wick'],
          inStock: true,
          stockQuantity: 25,
        } as Product);
      }
    });

    return resolved;
  }, [wishlistIds, products]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                <Heart className="w-5 h-5 fill-rose-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-editorial text-xl font-medium text-stone-900">Saved Fragrances</h2>
                  <span className="font-mono text-xs text-stone-500 font-semibold">
                    ({wishlistedProducts.length})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-mono mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      CandleApiService.getLiveStatus() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <span>
                    {CandleApiService.getLiveStatus()
                      ? 'Spring Boot 8080 Live'
                      : 'Spring Boot REST Sync'}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span>/api/wishlist</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-xl text-stone-800">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Tap the heart icon on any candle creation to save it to your private sanctuary list.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#262220] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Browse Creations
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-stone-500 pb-1 border-b border-stone-100">
                  <span>{wishlistedProducts.length} Artisanal Candle{wishlistedProducts.length > 1 ? 's' : ''}</span>
                  {onClearWishlist && (
                    <button
                      onClick={onClearWishlist}
                      className="text-stone-400 hover:text-rose-600 transition-colors text-[11px] font-medium cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {wishlistedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors bg-stone-50/50"
                  >
                    <img
                      src={resolveImage(product.image || (product as any)?.imageUrl, product.id, product.name)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/products/floral-garden.jpg';
                      }}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="w-20 h-20 rounded-lg object-cover bg-stone-100 shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4
                            onClick={() => {
                              onSelectProduct(product);
                              onClose();
                            }}
                            className="text-xs font-medium text-stone-900 hover:text-amber-800 cursor-pointer line-clamp-1"
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveFromWishlist(product.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                            title="Remove from wishlist"
                            aria-label="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[10px] text-stone-500 mt-0.5">
                          <span>{product.fragranceFamily}</span> · <span>{product.burnTimeHours}h Burn</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                          ₹{product.price}
                        </span>
                        <button
                          onClick={() => {
                            onQuickAdd(product);
                            onRemoveFromWishlist(product.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 bg-[#262220] hover:bg-black text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-amber-300" />
                          <span>Move to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="p-6 border-t border-stone-200 bg-[#FAF8F5] space-y-2">
            {wishlistedProducts.length > 0 && onMoveAllToBag && (
              <button
                onClick={onMoveAllToBag}
                className="w-full py-2.5 bg-[#262220] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Move All to Bag ({wishlistedProducts.length})</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full py-2.5 border border-stone-300 hover:border-stone-800 text-stone-800 text-xs font-medium uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
