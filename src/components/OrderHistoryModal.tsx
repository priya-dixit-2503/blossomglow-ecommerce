import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, ChevronRight, Search, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { CandleApiService } from '../services/api';
import { Order, OrderStatus } from '../types';
import { resolveImage } from '../utils/productNormalizer';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
}) => {
  // Declare hooks unconditionally
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      CandleApiService.getOrders().then((data) => {
        setOrders(data);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
              <h2 className="text-xl font-serif text-stone-900 dark:text-stone-100">My Order History</h2>
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
                {searchQuery ? 'No orders match your search criteria.' : "You haven't placed any candle orders yet. Discover our artisanal creations!"}
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
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onTrackOrder(order.orderNumber);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-800/50 text-amber-900 dark:text-amber-200 text-xs font-medium transition-colors"
                  >
                    <span>Track Live</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Items in order */}
                <div className="pt-3 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={resolveImage(item.product.image || (item.product as any)?.imageUrl, item.product.id, item.product.name)}
                          alt={item.product.name}
                          onError={(e) => {
                            e.currentTarget.src = '/products/floral-garden.jpg';
                          }}
                          className="w-9 h-9 object-cover rounded-lg border border-stone-200 dark:border-stone-700"
                        />
                        <div>
                          <p className="font-medium text-stone-800 dark:text-stone-200 line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {item.selectedSize} • {item.selectedVessel} (Qty: {item.quantity})
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-stone-700 dark:text-stone-300">
                        ₹{(item.itemPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery details preview */}
                <div className="mt-3 pt-2 text-[11px] text-stone-500 flex items-center justify-between border-t border-dashed border-stone-200 dark:border-stone-700/60">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    Ship to: {order.customerInfo.city}, {order.customerInfo.state}
                  </span>
                  <span className="font-mono text-[10px] text-stone-400">
                    AWB: {order.trackingNumber}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
