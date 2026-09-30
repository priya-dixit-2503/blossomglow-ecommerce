import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, ChevronRight, Search, ExternalLink, Calendar, MapPin, ShieldCheck, Lock, UserCheck } from 'lucide-react';
import { CandleApiService } from '../services/api';
import { Order, OrderStatus, UserProfile } from '../types';
import { resolveImage } from '../utils/productNormalizer';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  onTrackOrder,
}) => {
  // Declare hooks unconditionally
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      CandleApiService.getMyOrders().then((data) => {
        setOrders(data);
      });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleQuickCustomerSignIn = async () => {
    try {
      await CandleApiService.login('customer@blossomglow.in', 'candle123');
      const data = await CandleApiService.getMyOrders();
      setOrders(data);
    } catch {
      // fallback
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            {status}
          </span>
        );
      case 'Shipped':
      case 'Preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Truck className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif text-stone-900 dark:text-stone-100">My Order History</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-semibold">
                  GET /api/orders/my-orders
                </span>
              </div>
              <p className="text-xs text-stone-500">Track past orders, courier dispatches, and invoices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spring Security RBAC Customer Privacy Banner */}
        {currentUser ? (
          <div className="px-6 py-2.5 bg-emerald-50/80 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Customer Isolation Active:</strong> Displaying orders strictly belonging to{' '}
                <span className="font-mono">{currentUser.email}</span>
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
              {currentUser.role}
            </span>
          </div>
        ) : (
          <div className="p-4 bg-amber-50/90 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2.5 text-left">
              <Lock className="w-4 h-4 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  Customer Authentication Required for Order History
                </h4>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                  Customers can only see their own orders. Sign in to view your orders, or track any single order using its public tracking number below.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {onOpenAuth && (
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="px-3 py-1 bg-stone-900 hover:bg-black text-white rounded text-[11px] font-medium transition-colors"
                    >
                      Sign In
                    </button>
                  )}
                  <button
                    onClick={handleQuickCustomerSignIn}
                    className="px-3 py-1 bg-amber-100/90 hover:bg-amber-200 text-amber-900 rounded text-[11px] font-medium transition-colors flex items-center gap-1"
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>Quick Demo Customer Login</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search filter */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number (e.g. BG-2026-...), tracking ID, or candle name..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-600 mb-3 stroke-[1.5]" />
              <h3 className="text-base font-serif text-stone-800 dark:text-stone-200">No Orders Found</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                {searchQuery
                  ? 'No orders match your search criteria.'
                  : !currentUser
                  ? 'Sign in to access your protected customer order history.'
                  : "You haven't placed any candle orders yet under this account. Discover our artisanal creations!"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-800/30 hover:border-amber-700/30 hover:shadow-md transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200/60 dark:border-stone-700/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span>Total: ₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-stone-400">{order.customerInfo.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onTrackOrder(order.trackingNumber);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    <span>Track Live</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Items */}
                <div className="pt-3 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={resolveImage(item.product.image, item.productId, item.product.name)}
                          alt={item.product.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span className="text-stone-700 dark:text-stone-300 font-medium">
                          {item.product.name} <span className="text-stone-400">×{item.quantity}</span>
                        </span>
                      </div>
                      <span className="font-mono text-stone-600 dark:text-stone-400">
                        ₹{(item.itemPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

