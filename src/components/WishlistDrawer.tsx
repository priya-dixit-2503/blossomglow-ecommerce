import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onRemoveFromWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  onRemoveFromWishlist,
  onQuickAdd,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = MOCK_PRODUCTS.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h2 className="font-editorial text-xl font-medium text-stone-900">Your Saved Fragrances</h2>
              <span className="font-mono text-xs text-stone-500 font-semibold">
                ({wishlistedProducts.length})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 transition-colors"
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
                  className="px-5 py-2.5 bg-[#262220] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                >
                  Browse Creations
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors bg-stone-50/50"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
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
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
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
                        className="flex items-center gap-1.5 px-3 py-1 bg-[#262220] hover:bg-black text-white rounded text-[11px] font-medium transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3 text-amber-300" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-stone-200 bg-[#FAF8F5]">
            <button
              onClick={onClose}
              className="w-full py-2.5 border border-stone-300 hover:border-stone-800 text-stone-800 text-xs font-medium uppercase tracking-wider rounded-xl transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
