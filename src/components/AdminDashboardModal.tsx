import React, { useState, useEffect } from 'react';
import {
  X, Plus, Edit2, Trash2, Package, ShoppingCart, TrendingUp, Check,
  AlertCircle, RefreshCw, Filter, Sparkles, Image as ImageIcon, ExternalLink,
  ShieldCheck, Users, Layers, Warehouse, Search, ArrowUpDown, AlertTriangle
} from 'lucide-react';
import { Product, Order, OrderStatus, ProductCategory } from '../types';
import { CandleApiService } from '../services/api';
import { PRODUCT_ASSETS } from '../assets/products';
import { resolveImage } from '../utils/productNormalizer';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsChanged?: () => void;
}

const AVAILABLE_CATEGORIES: ProductCategory[] = [
  'Gift Candles',
  'Scented Candles',
  'Meditation Candles',
  'Decorative Candles',
  'Home Décor Candles',
  'Gift Hampers',
  'Botanical Bowls & Shells',
  'Sculptural Candles',
  'Artisanal Decor',
];

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

type AdminTab = 'products' | 'categories' | 'orders' | 'customers' | 'inventory';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onProductsChanged,
}) => {
  // Always declare all hooks unconditionally before any early returns
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Edit / Create Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    tagline: '',
    category: 'Decorative Candles',
    fragranceFamily: 'Floral',
    price: 499,
    originalPrice: 649,
    stockQuantity: 50,
    inStock: true,
    image: PRODUCT_ASSETS.floralGarden,
    description: '',
    burnTimeHours: 40,
    weightGrams: 250,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        CandleApiService.getProducts(),
        CandleApiService.getOrders(),
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await CandleApiService.updateProduct(editingProduct.id, productForm);
        showToast(`Product "${productForm.name}" updated successfully!`);
      } else {
        await CandleApiService.createProduct(productForm);
        showToast(`New product "${productForm.name}" created!`);
      }
      setEditingProduct(null);
      setIsCreatingNew(false);
      await loadData();
      if (onProductsChanged) onProductsChanged();
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Failed to save product'}`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await CandleApiService.deleteProduct(id);
      showToast(`Product "${name}" deleted.`);
      await loadData();
      if (onProductsChanged) onProductsChanged();
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await CandleApiService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`);
      await loadData();
    } catch (err: any) {
      showToast(`Status update failed: ${err.message}`);
    }
  };

  const handleQuickStockChange = async (p: Product, delta: number) => {
    const newQty = Math.max(0, (p.stockQuantity ?? 30) + delta);
    try {
      await CandleApiService.updateProduct(p.id, {
        stockQuantity: newQty,
        inStock: newQty > 0,
      });
      await loadData();
      if (onProductsChanged) onProductsChanged();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const handleToggleInStock = async (p: Product) => {
    try {
      await CandleApiService.updateProduct(p.id, {
        inStock: !p.inStock,
      });
      await loadData();
      if (onProductsChanged) onProductsChanged();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const lowStockCount = products.filter((p) => p.stockQuantity !== undefined && p.stockQuantity <= 5).length;
  const outOfStockCount = products.filter((p) => !p.inStock || p.stockQuantity === 0).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerInfo.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerInfo.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'All' || ord.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Unique Customers calculation
  const customerMap = new Map<string, { name: string; email: string; phone: string; city: string; ordersCount: number; totalSpent: number; lastOrder: string }>();
  orders.forEach((ord) => {
    const key = ord.customerInfo.email.toLowerCase().trim();
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: ord.customerInfo.fullName,
        email: ord.customerInfo.email,
        phone: ord.customerInfo.phone,
        city: `${ord.customerInfo.city}, ${ord.customerInfo.state}`,
        ordersCount: 1,
        totalSpent: ord.totalAmount,
        lastOrder: ord.createdAt,
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.ordersCount += 1;
      existing.totalSpent += ord.totalAmount;
      if (new Date(ord.createdAt) > new Date(existing.lastOrder)) {
        existing.lastOrder = ord.createdAt;
      }
    }
  });
  const customers = Array.from(customerMap.values());

  // Categories Breakdown
  const categoryStats = AVAILABLE_CATEGORIES.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat);
    const totalUnits = catProducts.reduce((sum, p) => sum + (p.stockQuantity ?? 30), 0);
    const avgPrice = catProducts.length > 0 ? Math.round(catProducts.reduce((s, p) => s + p.price, 0) / catProducts.length) : 0;
    return {
      category: cat,
      count: catProducts.length,
      totalUnits,
      avgPrice,
    };
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-6xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#211D1B] text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-xl sm:text-2xl font-light text-white">
                  BlossomGlow Atelier Admin
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-900/60 text-amber-300 border border-amber-700/50">
                  Spring Security • ROLE_ADMIN
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                Manage products, category collections, customer orders, and live atelier stock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className="bg-amber-900 text-amber-100 px-6 py-2.5 text-xs flex items-center justify-between border-b border-amber-700 animate-fadeIn">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-amber-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Metrics KPI Bar */}
        <div className="bg-[#F2ECE4] border-b border-stone-200/80 px-6 py-3.5 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Creations</span>
            <p className="text-lg font-semibold text-stone-900 font-mono">{products.length}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Orders</span>
            <p className="text-lg font-semibold text-stone-900 font-mono">{orders.length}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Revenue</span>
            <p className="text-lg font-semibold text-emerald-800 font-mono">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Customers</span>
            <p className="text-lg font-semibold text-stone-900 font-mono">{customers.length}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Stock Alerts</span>
            <p className="text-lg font-semibold text-amber-800 font-mono">
              {lowStockCount + outOfStockCount} items
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 px-6 bg-white shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-amber-900 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-amber-900 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Inventory &amp; Stock</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-900 font-bold">
                {lowStockCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-amber-900 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({AVAILABLE_CATEGORIES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-900 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'customers'
                ? 'border-amber-900 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customers.length})</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-lg">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search candle name or ID..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/30"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {AVAILABLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      tagline: '',
                      category: 'Decorative Candles',
                      fragranceFamily: 'Floral',
                      price: 499,
                      originalPrice: 649,
                      stockQuantity: 30,
                      inStock: true,
                      image: PRODUCT_ASSETS.floralGarden,
                      description: '',
                      burnTimeHours: 40,
                      weightGrams: 250,
                    });
                    setIsCreatingNew(true);
                  }}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Creation</span>
                </button>
              </div>

              {/* Product Form Drawer/Modal */}
              {(isCreatingNew || editingProduct) && (
                <div className="p-5 bg-white rounded-2xl border-2 border-amber-800/30 shadow-md space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h4 className="font-serif text-base font-semibold text-stone-900">
                      {editingProduct ? `Edit Candle: ${editingProduct.name}` : 'Add New Artisan Candle Creation'}
                    </h4>
                    <button
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingProduct(null);
                      }}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Candle Title *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="e.g. Kashmiri Saffron & Amber Jar"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Tagline</label>
                        <input
                          type="text"
                          value={productForm.tagline}
                          onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                          placeholder="Warm, meditative botanical burn"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Category *</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none bg-white"
                        >
                          {AVAILABLE_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Initial Stock Units *</label>
                        <input
                          type="number"
                          required
                          value={productForm.stockQuantity}
                          onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNew(false);
                          setEditingProduct(null);
                        }}
                        className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-medium"
                      >
                        {editingProduct ? 'Save Changes' : 'Create Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-600 font-medium uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Creation</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={resolveImage(p.image || (p as any)?.imageUrl, p.id, p.name)}
                              alt={p.name}
                              onError={(e) => {
                                e.currentTarget.src = '/products/floral-garden.jpg';
                              }}
                              className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                            />
                            <div>
                              <p className="font-semibold text-stone-900">{p.name}</p>
                              <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-600">{p.category}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-stone-900">₹{p.price}</td>
                        <td className="py-3 px-4 font-mono">{p.stockQuantity ?? 30} units</td>
                        <td className="py-3 px-4">
                          {p.inStock ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-800">
                              Sold Out
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm({ ...p });
                                setIsCreatingNew(false);
                              }}
                              className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & STOCK */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-semibold text-stone-900">
                    Artisan Stock &amp; Batch Management
                  </h4>
                  <p className="text-xs text-stone-500">
                    Directly increment, decrement, and manage live stock quantities across all candle lines.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-600 font-medium uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Creation &amp; SKU</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Current Units</th>
                      <th className="py-3 px-4">Quick Adjustment</th>
                      <th className="py-3 px-4">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => {
                      const qty = p.stockQuantity ?? 30;
                      const isLow = qty <= 5 && qty > 0;
                      const isZero = qty === 0 || !p.inStock;

                      return (
                        <tr key={p.id} className="hover:bg-stone-50/70">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={resolveImage(p.image || (p as any)?.imageUrl, p.id, p.name)}
                                alt={p.name}
                                onError={(e) => {
                                  e.currentTarget.src = '/products/floral-garden.jpg';
                                }}
                                className="w-10 h-10 rounded-xl object-cover border"
                              />
                              <div>
                                <p className="font-semibold text-stone-900">{p.name}</p>
                                <span className="font-mono text-[10px] text-stone-400">{p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-stone-600">{p.category}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 font-mono">
                              <span className={`font-bold text-sm ${isZero ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-stone-900'}`}>
                                {qty}
                              </span>
                              {isLow && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-800 font-sans font-medium">
                                  Low Stock
                                </span>
                              )}
                              {isZero && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-100 text-red-800 font-sans font-medium">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickStockChange(p, -5)}
                                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded font-mono text-[11px] cursor-pointer"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => handleQuickStockChange(p, -1)}
                                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded font-mono text-[11px] cursor-pointer"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleQuickStockChange(p, 1)}
                                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-mono text-[11px] cursor-pointer"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => handleQuickStockChange(p, 10)}
                                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-mono text-[11px] cursor-pointer"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleInStock(p)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                            >
                              {p.inStock ? 'Active (In Stock)' : 'Inactive (Sold Out)'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-base font-semibold text-stone-900">
                  Category Collections Overview
                </h4>
                <p className="text-xs text-stone-500">
                  Live distribution of products, average pricing, and total units across BlossomGlow categories.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categoryStats.map((stat) => (
                  <div key={stat.category} className="p-4 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-stone-900 text-sm">{stat.category}</h5>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-mono">
                        {stat.count} items
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Avg Price</span>
                        <span className="font-mono font-medium text-stone-800">₹{stat.avgPrice}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Total Units</span>
                        <span className="font-mono font-medium text-stone-800">{stat.totalUnits} units</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search order number, customer, courier AWB..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none"
                    />
                  </div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    {ORDER_STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <ShoppingCart className="w-8 h-8 mx-auto text-stone-300" />
                  <p>No orders match the filter criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => (
                    <div key={ord.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-900 text-sm">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(ord.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-stone-600 mt-0.5">
                            Customer: <strong>{ord.customerInfo.fullName}</strong> ({ord.customerInfo.phone}) • {ord.customerInfo.city}, {ord.customerInfo.state}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-stone-500 font-medium">Status:</label>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none border cursor-pointer ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : ord.status === 'Shipped'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : ord.status === 'Preparing'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : ord.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : 'bg-stone-50 text-stone-800 border-stone-300'
                            }`}
                          >
                            {ORDER_STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        {ord.items.map((item, i) => (
                          <div key={i} className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center gap-2.5">
                            <img
                              src={resolveImage(item.product.image || (item.product as any)?.imageUrl, item.product.id, item.product.name)}
                              alt={item.product.name}
                              onError={(e) => {
                                e.currentTarget.src = '/products/floral-garden.jpg';
                              }}
                              className="w-9 h-9 rounded-lg object-cover border"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-stone-900 truncate">{item.product.name}</p>
                              <p className="text-[10px] text-stone-500">
                                Qty: {item.quantity} • ₹{item.itemPrice}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-stone-600 border-t border-stone-100">
                        <div>
                          AWB: <span className="font-mono text-stone-900 font-semibold">{ord.trackingNumber}</span>
                          <span className="mx-2 text-stone-300">•</span>
                          Est. Delivery: <span>{ord.estimatedDeliveryDate}</span>
                        </div>
                        <div className="font-mono text-stone-900 font-semibold text-sm">
                          Total Amount: ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-base font-semibold text-stone-900">
                  Customer Profiles &amp; Lifetime Value
                </h4>
                <p className="text-xs text-stone-500">
                  Directory of customers compiled from orders placed and registered accounts.
                </p>
              </div>

              {customers.length === 0 ? (
                <div className="py-16 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200">
                  No customers registered yet. Placed orders will automatically populate here.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-600 font-medium uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Contact Details</th>
                        <th className="py-3 px-4">Primary Region</th>
                        <th className="py-3 px-4">Orders Placed</th>
                        <th className="py-3 px-4">Lifetime Spend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {customers.map((c, i) => (
                        <tr key={i} className="hover:bg-stone-50/70">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-stone-900">{c.name}</p>
                            <span className="text-[10px] text-stone-400">Customer #{i + 101}</span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-stone-700">{c.email}</p>
                            <p className="text-[11px] text-stone-400 font-mono">{c.phone}</p>
                          </td>
                          <td className="py-3 px-4 text-stone-600">{c.city}</td>
                          <td className="py-3 px-4 font-mono font-medium">{c.ordersCount} orders</td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                            ₹{c.totalSpent.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-3.5 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Protected with Spring Security • JWT &amp; Role-Based Access Control</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
