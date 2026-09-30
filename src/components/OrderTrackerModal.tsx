import React, { useState, useEffect } from 'react';
import { X, Search, Package, Truck, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
import { Order } from '../types';
import { CandleApiService } from '../services/api';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber,
}) => {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = CandleApiService.getStoredOrders();
      setRecentOrders(stored);
      if (initialOrderNumber) {
        setQuery(initialOrderNumber);
        performSearch(initialOrderNumber);
      } else if (stored.length > 0 && !order) {
        // Pre-fill latest order as convenient default
        setQuery(stored[0].orderNumber);
        performSearch(stored[0].orderNumber);
      }
    }
  }, [isOpen, initialOrderNumber]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const performSearch = async (trackingQuery: string) => {
    if (!trackingQuery.trim()) return;
    setLoading(true);
    const res = await CandleApiService.getOrderByTracking(trackingQuery);
    setOrder(res || null);
    setSearched(true);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-200 cursor-default"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-800" />
            <span className="font-editorial text-xl font-medium text-stone-900">
              Track Your Candle Delivery
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-800 transition-colors"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. BG-8842) or Tracking No."
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800 uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#262220] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {recentOrders.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-stone-500">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Recent:</span>
              {recentOrders.slice(0, 3).map((ro) => (
                <button
                  key={ro.id}
                  type="button"
                  onClick={() => {
                    setQuery(ro.orderNumber);
                    performSearch(ro.orderNumber);
                  }}
                  className={`px-2.5 py-1 rounded-md border font-mono transition-colors cursor-pointer ${
                    order?.orderNumber === ro.orderNumber
                      ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  {ro.orderNumber}
                </button>
              ))}
            </div>
          )}

          {searched && !order && (
            <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-xl">
              No order found matching "{query}". Please check your order confirmation email or place a test order on the store.
            </div>
          )}

          {order && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 text-xs flex justify-between items-center">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Order Number</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{order.orderNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px] uppercase">Estimated Delivery</span>
                  <span className="font-medium text-amber-900">{order.estimatedDeliveryDate}</span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-4 pt-2">
                {[
                  { title: 'Order Confirmed', time: 'Received by BlossomGlow Atelier', done: true, icon: CheckCircle2 },
                  { title: 'Hand-Pouring & Curing', time: 'Natural slow soy wax setting (14-day cure)', done: true, icon: Clock },
                  { title: 'Dispatched via Bluedart Air', time: `Airway Bill: ${order.trackingNumber}`, done: true, icon: Truck },
                  { title: 'Out for Doorstep Delivery', time: `Delivering to ${order.customerInfo.city}, ${order.customerInfo.state}`, done: false, icon: MapPin },
                ].map((st, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className={`p-1.5 rounded-full ${st.done ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}>
                      <st.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-semibold text-stone-900">{st.title}</h5>
                      <p className="text-[11px] text-stone-500">{st.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Items summary */}
              <div className="pt-4 border-t border-stone-200">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block mb-2">
                  Order Items ({order.items.length}):
                </span>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-stone-800 font-medium">
                        {item.quantity}x {item.product.name} ({item.selectedVessel})
                      </span>
                      <span className="font-mono tabular-nums text-stone-600">
                        ₹{item.itemPrice * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Bottom dismiss button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close &amp; Return to Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
