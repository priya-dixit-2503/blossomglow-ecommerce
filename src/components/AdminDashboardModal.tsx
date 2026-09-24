import React, { useState, useEffect } from 'react';
import {
  X, Plus, Edit2, Trash2, Package, ShoppingCart, TrendingUp, Check,
  AlertCircle, RefreshCw, Filter, Sparkles, Image as ImageIcon, ExternalLink, ShieldCheck
} from 'lucide-react';
import { Product, Order, OrderStatus, ProductCategory } from '../types';
import { CandleApiService } from '../services/api';
import { PRODUCT_ASSETS } from '../assets/products';

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

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onProductsChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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
        CandleApiService.getAllOrders(),
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
        showToast(`New product "${productForm.name}" added!`);
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
    const newQty = Math.max(0, (p.stockQuantity || 0) + delta);
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

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-6xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#211D1B] text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-xl sm:text-2xl font-light text-white">
                  BlossomGlow Admin Panel
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-900/60 text-amber-300 border border-amber-700/50">
                  Role: ADMIN
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                Manage products catalog, stock inventory, prices &amp; order fulfillment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
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
        <div className="bg-[#F2ECE4] border-b border-stone-200/80 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Products</span>
            <p className="text-xl font-semibold text-stone-900 font-mono">{products.length}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Total Orders</span>
            <p className="text-xl font-semibold text-stone-900 font-mono">{orders.length}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Gross Sales</span>
            <p className="text-xl font-semibold text-emerald-800 font-mono">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">In-Stock Rate</span>
            <p className="text-xl font-semibold text-stone-900 font-mono">
              {products.length > 0 ? Math.round((products.filter(p => p.inStock).length / products.length) * 100) : 100}%
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 px-6 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'products'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products &amp; Inventory ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-stone-600">
                  Showing <strong>{products.length}</strong> creations currently available in storefront.
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
                      stockQuantity: 50,
                      inStock: true,
                      image: PRODUCT_ASSETS.floralGarden,
                      description: '',
                      burnTimeHours: 40,
                      weightGrams: 250,
                    });
                    setIsCreatingNew(true);
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Add / Edit Form Modal if open */}
              {(isCreatingNew || editingProduct) && (
                <div className="bg-white p-6 rounded-2xl border-2 border-amber-600/30 shadow-lg space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h4 className="font-editorial text-xl font-light text-stone-900">
                      {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Candle Creation'}
                    </h4>
                    <button
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingProduct(null);
                      }}
                      className="text-stone-400 hover:text-stone-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name || ''}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600"
                          placeholder="e.g. Amber Honey Comb Candle"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Tagline *</label>
                        <input
                          type="text"
                          required
                          value={productForm.tagline || ''}
                          onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600"
                          placeholder="e.g. Sculpted golden beeswax with raw honeycomb motifs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Category *</label>
                        <select
                          value={productForm.category || 'Decorative Candles'}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600"
                        >
                          {AVAILABLE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Fragrance Family *</label>
                        <select
                          value={productForm.fragranceFamily || 'Floral'}
                          onChange={(e) => setProductForm({ ...productForm, fragranceFamily: e.target.value as any })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600"
                        >
                          <option value="Floral">Floral</option>
                          <option value="Woody & Amber">Woody & Amber</option>
                          <option value="Fresh & Herbal">Fresh & Herbal</option>
                          <option value="Gourmand & Warm">Gourmand & Warm</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price || 0}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Original / Compare Price (₹)</label>
                        <input
                          type="number"
                          value={productForm.originalPrice || 0}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Stock Quantity *</label>
                        <input
                          type="number"
                          value={productForm.stockQuantity ?? 50}
                          onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value), inStock: Number(e.target.value) > 0 })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600 font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          id="inStockCheck"
                          checked={productForm.inStock ?? true}
                          onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                        <label htmlFor="inStockCheck" className="text-xs font-medium text-stone-800">
                          Mark as In Stock
                        </label>
                      </div>
                    </div>

                    {/* Image URL & Preset Selection */}
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Product Image URL *</label>
                      <input
                        type="text"
                        required
                        value={productForm.image || ''}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600 font-mono"
                        placeholder="/src/assets/products/floral-garden.jpg"
                      />
                      {/* Presets */}
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                        <span className="text-stone-500">Pick from uploaded photos:</span>
                        {Object.entries(PRODUCT_ASSETS).slice(0, 7).map(([k, path]) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setProductForm({ ...productForm, image: path })}
                            className="px-2 py-0.5 bg-stone-100 hover:bg-amber-100 rounded border border-stone-200 text-stone-700 font-mono"
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600 resize-none"
                        placeholder="Detailed artisan notes..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNew(false);
                          setEditingProduct(null);
                        }}
                        className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold uppercase tracking-wider"
                      >
                        {editingProduct ? 'Save Changes' : 'Create Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Product Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-[#F8F5F1] text-[11px] uppercase tracking-wider text-stone-500 font-mono border-b border-stone-200">
                      <tr>
                        <th className="py-3.5 px-4">Item</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Stock</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as any).src = PRODUCT_ASSETS.floralGarden;
                                  }}
                                />
                              </div>
                              <div>
                                <span className="font-medium text-stone-900 block">{p.name}</span>
                                <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-stone-600">
                            {p.category}
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-mono font-semibold text-stone-900">₹{p.price}</div>
                            {p.originalPrice && (
                              <div className="text-[10px] text-stone-400 line-through font-mono">₹{p.originalPrice}</div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleQuickStockChange(p, -5)}
                                className="w-5 h-5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className="font-mono font-medium text-stone-800 min-w-[28px] text-center">
                                {p.stockQuantity ?? 50}
                              </span>
                              <button
                                onClick={() => handleQuickStockChange(p, 5)}
                                className="w-5 h-5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            {p.inStock ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                In Stock
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-100 text-rose-800">
                                Sold Out
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm({ ...p });
                                  setIsCreatingNew(false);
                                }}
                                className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded-md transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="text-xs text-stone-600">
                Manage order fulfillment, courier dispatch, and delivery status updates.
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <ShoppingCart className="w-8 h-8 mx-auto text-stone-300" />
                  <p>No customer orders placed yet.</p>
                  <p className="text-[11px] text-stone-400">Place an order in the checkout drawer to see it appear live here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4"
                    >
                      {/* Top Order Row */}
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

                        {/* Status Select Box */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-stone-500 font-medium">Status:</label>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none border ${
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

                      {/* Items List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        {ord.items.map((item, i) => (
                          <div key={i} className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-white overflow-hidden shrink-0 border border-stone-200">
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-stone-900 truncate">{item.product.name}</p>
                              <p className="text-[10px] text-stone-500">
                                Qty: {item.quantity} • ₹{item.itemPrice}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary & Courier Row */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-stone-600 border-t border-stone-100">
                        <div>
                          Courier: <span className="font-mono text-stone-900 font-semibold">{ord.trackingNumber}</span>
                          <span className="mx-2 text-stone-300">•</span>
                          Est. Delivery: <span>{ord.estimatedDeliveryDate}</span>
                        </div>
                        <div className="font-mono text-stone-900 font-semibold text-sm">
                          Total Amount: ₹{ord.totalAmount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Protected with Spring Security • Basic Auth &amp; REST Controller</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
