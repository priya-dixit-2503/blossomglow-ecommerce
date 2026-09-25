import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Sparkles, Check, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  onExploreCreations?: () => void;
  couponCode: string;
  onApplyCoupon: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreCreations,
  couponCode,
  onApplyCoupon,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgressPct = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  let discountAmount = 0;
  if (couponCode.toUpperCase() === 'GLOW10' || couponCode.toUpperCase() === 'AURAGLOW') {
    discountAmount = Math.round(subtotal * 0.1);
  } else if (couponCode.toUpperCase() === 'AUTUMN20') {
    discountAmount = Math.round(subtotal * 0.2);
  }

  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyCoupon(promoInput.trim());
    if (success) {
      setPromoMessage({ text: `Promo code "${promoInput.toUpperCase()}" applied!`, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try "GLOW10" for 10% off.', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200/80 flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-800" />
              <h2 className="font-editorial text-xl font-medium text-stone-900">Your Candle Bag</h2>
              <span className="font-mono text-xs text-stone-500 font-semibold">
                ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#F4EFEB] border-b border-stone-200 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-stone-700">
                Add <span className="font-mono font-semibold text-stone-950 tabular-nums">₹{remainingForFreeShipping}</span> more to unlock <strong className="text-amber-900">Free Express Delivery</strong>
              </p>
            ) : (
              <p className="text-emerald-800 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Complimentary Pan-India Delivery Unlocked!
              </p>
            )}
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-amber-700 h-full rounded-full transition-all duration-500"
                style={{ width: `${shippingProgressPct}%` }}
              />
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-xl text-stone-800">Your bag is tranquil &amp; empty</h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Discover our pure botanical soy candles hand-poured in the Himalayan foothills.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    if (onExploreCreations) onExploreCreations();
                  }}
                  className="px-5 py-2.5 bg-[#262220] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                >
                  Explore Creations
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors bg-stone-50/50"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-medium text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[10px] text-stone-500 mt-0.5 space-y-0.5">
                        <p>{item.selectedVessel} · {item.selectedSize}</p>
                        <p className="text-amber-800">{item.selectedWick}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-stone-200 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-500 hover:text-stone-900 text-xs"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-mono font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-500 hover:text-stone-900 text-xs"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                        ₹{item.itemPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Module */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-[#FAF8F5] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Coupon code (try GLOW10)"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-stone-400 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p className={`text-[11px] ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {promoMessage.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({couponCode.toUpperCase()})</span>
                    <span className="font-mono tabular-nums">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-medium">Free</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Due</span>
                  <span className="font-mono text-base tabular-nums">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#262220] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 text-center">
                <span>100% Secure Checkout</span>
                <span>·</span>
                <span>UPI, Cards &amp; Cash On Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
