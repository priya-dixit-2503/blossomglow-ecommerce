import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  LogOut,
  Edit2,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { CandleApiService } from '../services/api';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  initialTab?: 'profile' | 'orders' | 'wishlist' | 'addresses' | 'security';
  wishlistItems?: Product[];
  onAddToCart?: (product: Product) => void;
  onRemoveFromWishlist?: (productId: string) => void;
  onTrackOrder?: (orderNumber: string) => void;
  onLogout?: () => void;
}

type TabType = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'security';

export const MyAccountModal: React.FC<MyAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialTab = 'profile',
  wishlistItems = [],
  onAddToCart,
  onRemoveFromWishlist,
  onTrackOrder,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile State (Backend-authoritative)
  const [profile, setProfile] = useState<any>(currentUser || null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
  });

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: 'Home Altar',
    recipientName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    streetAddress: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isDefault: false,
  });

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      loadAllAccountData();
    }
  }, [isOpen, initialTab]);

  const loadAllAccountData = async () => {
    setLoading(true);
    try {
      const [liveProfile, liveOrders, liveAddresses] = await Promise.all([
        CandleApiService.getUserProfile(),
        CandleApiService.getCustomerOrders(),
        CandleApiService.getUserAddresses(),
      ]);

      if (liveProfile) {
        setProfile(liveProfile);
        setProfileForm({
          fullName: liveProfile.fullName || '',
          phone: liveProfile.phone || '',
        });
      }
      setOrders(liveOrders || []);
      setAddresses(liveAddresses || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await CandleApiService.updateUserProfile(profileForm);
      if (updated) {
        setProfile(updated);
        setIsEditingProfile(false);
        showToast('Profile updated successfully in MySQL database.');
      }
    } catch (err: any) {
      showToast(`Update failed: ${err.message}`);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CandleApiService.addUserAddress(addressForm);
      setIsAddingAddress(false);
      showToast('New shipping address saved.');
      const updatedList = await CandleApiService.getUserAddresses();
      setAddresses(updatedList);
    } catch (err: any) {
      showToast(`Failed to add address: ${err.message}`);
    }
  };

  const handleDeleteAddress = async (id: number | string) => {
    try {
      await CandleApiService.deleteUserAddress(id);
      setAddresses((prev) => prev.filter((a) => String(a.id) !== String(id)));
      showToast('Address deleted.');
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      await CandleApiService.changeUserPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setPasswordSuccess('Password successfully updated with BCrypt hashing.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password updated.');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || err.message || 'Incorrect current password.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden text-left font-sans">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-60 bg-stone-900 text-amber-200 px-4 py-2 rounded-xl text-xs shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP HEADER */}
        <div className="px-6 py-5 bg-[#F4EFEA] border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#29221C] text-amber-200 flex items-center justify-center text-lg font-serif font-bold shadow-xs">
              {profile?.fullName ? profile.fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {profile?.fullName || 'Customer Sanctuary'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                  {profile?.role === 'ROLE_ADMIN' ? 'Atelier Admin' : 'Connoisseur'}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                {profile?.email || 'Logged In Account'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer"
            aria-label="Close My Account"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MAIN BODY: 2-COLUMN LAYOUT */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full md:w-56 bg-[#FAF7F2] border-b md:border-b-0 md:border-r border-stone-200/80 p-3 sm:p-4 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto md:overflow-visible">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-amber-300' : 'text-stone-500'}`} />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className={`w-4 h-4 ${activeTab === 'orders' ? 'text-amber-300' : 'text-stone-500'}`} />
                <span>Orders</span>
              </div>
              {orders.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  activeTab === 'orders' ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                }`}>
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left shrink-0 ${
                activeTab === 'wishlist'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className={`w-4 h-4 ${activeTab === 'wishlist' ? 'text-rose-400' : 'text-stone-500'}`} />
                <span>Wishlist</span>
              </div>
              {wishlistItems.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  activeTab === 'wishlist' ? 'bg-rose-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                }`}>
                  {wishlistItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left shrink-0 ${
                activeTab === 'addresses'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              <MapPin className={`w-4 h-4 ${activeTab === 'addresses' ? 'text-amber-300' : 'text-stone-500'}`} />
              <span>Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left shrink-0 ${
                activeTab === 'security'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              <Lock className={`w-4 h-4 ${activeTab === 'security' ? 'text-amber-300' : 'text-stone-500'}`} />
              <span>Change Password</span>
            </button>

            <div className="hidden md:block my-2 border-t border-stone-200/80" />

            {onLogout && (
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer text-left shrink-0 mt-auto"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            )}
          </aside>

          {/* TAB CONTENT PANEL */}
          <main className="flex-1 p-5 sm:p-7 overflow-y-auto">
            
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-xl">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-stone-900">
                      Artisan Sanctuary Profile
                    </h4>
                    <p className="text-xs text-stone-500">
                      Authoritative customer record retrieved directly from Spring Boot & MySQL.
                    </p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+91 98290 12345"
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800 bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-100 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Save to MySQL (PUT /api/user/profile)</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-stone-400 uppercase text-[10px] font-mono tracking-wider block">
                          Full Name
                        </span>
                        <span className="text-stone-900 font-medium text-sm">
                          {profile?.fullName || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase text-[10px] font-mono tracking-wider block">
                          Email Address
                        </span>
                        <span className="text-stone-900 font-mono text-sm">
                          {profile?.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase text-[10px] font-mono tracking-wider block">
                          Phone Number
                        </span>
                        <span className="text-stone-900 font-mono text-sm">
                          {profile?.phone || 'Not provided'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase text-[10px] font-mono tracking-wider block">
                          Account Role
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold font-mono">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {profile?.role === 'ROLE_ADMIN' ? 'Atelier Administrator' : 'Customer Account'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-600/70" />
                      <span>Synchronized live with Spring Data JPA repository.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-stone-900">
                      Your Order History
                    </h4>
                    <p className="text-xs text-stone-500">
                      Real orders retrieved from backend via <code>GET /api/user/orders</code>.
                    </p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-stone-200/80 p-6 space-y-3">
                    <Package className="w-10 h-10 text-stone-300 mx-auto" />
                    <h5 className="font-serif text-sm font-semibold text-stone-800">No Orders Placed Yet</h5>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Explore our hand-poured botanical collections to illuminate your sanctuary with artisan scents.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order.orderNumber || order.id}
                        className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-3 hover:border-stone-300 transition-all text-left"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-900">
                              #{order.orderNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800">
                              {order.status || 'Confirmed'}
                            </span>
                          </div>
                          <span className="font-mono text-stone-800 font-bold text-sm">
                            ₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="space-y-1.5 text-xs text-stone-600">
                            {order.items.map((it: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-[11px]">
                                <span className="font-medium text-stone-800">
                                  {it.quantity}x {it.productName || it.name || 'Candle Creation'}
                                </span>
                                <span className="font-mono text-stone-500">
                                  ₹{it.unitPrice || it.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-[11px]">
                          <span className="text-stone-400 font-mono">
                            Courier: {order.trackingNumber || 'BlueDart Express'}
                          </span>
                          {onTrackOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onTrackOrder(order.orderNumber);
                              }}
                              className="px-3 py-1 bg-[#29221C] hover:bg-black text-amber-200 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Track BlueDart</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-stone-900">
                      Saved Wishlist Creations
                    </h4>
                    <p className="text-xs text-stone-500">
                      Your curated sanctuary favorites for festive gifting and mindful evenings.
                    </p>
                  </div>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-stone-200/80 p-6 space-y-3">
                    <Heart className="w-10 h-10 text-rose-300 mx-auto" />
                    <h5 className="font-serif text-sm font-semibold text-stone-800">Your Wishlist is Empty</h5>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Click the heart icon on any candle creation to save it to your personal sanctuary collection.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wishlistItems.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 text-left"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-stone-900 text-xs truncate">{prod.name}</h5>
                          <span className="text-[10px] text-stone-400 block">{prod.fragranceFamily}</span>
                          <span className="font-mono text-xs font-bold text-stone-800 block mt-0.5">
                            ₹{prod.price}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          {onAddToCart && (
                            <button
                              type="button"
                              onClick={() => {
                                onAddToCart(prod);
                                showToast(`"${prod.name}" added to bag!`);
                              }}
                              className="p-2 bg-stone-900 hover:bg-black text-amber-200 rounded-lg cursor-pointer transition-colors"
                              title="Add to Bag"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onRemoveFromWishlist && (
                            <button
                              type="button"
                              onClick={() => onRemoveFromWishlist(prod.id)}
                              className="p-2 bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                              title="Remove from Wishlist"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-stone-900">
                      Saved Shipping Addresses
                    </h4>
                    <p className="text-xs text-stone-500">
                      Manage delivery destinations mapped to <code>/api/user/addresses</code>.
                    </p>
                  </div>
                  {!isAddingAddress && (
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(true)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-300" />
                      <span>Add Address</span>
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3 text-xs">
                    <h5 className="font-semibold text-stone-900 text-sm">New Delivery Address</h5>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Address Label</label>
                        <input
                          type="text"
                          required
                          value={addressForm.title}
                          onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                          placeholder="e.g. Home Altar, Studio"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Recipient Name *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.recipientName}
                          onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                          placeholder="Full Name"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="+91 98290 12345"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Pincode *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          placeholder="400050"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Street Address *</label>
                      <textarea
                        rows={2}
                        required
                        value={addressForm.streetAddress}
                        onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                        placeholder="Flat / House No., Building Name, Street"
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-100 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Save Address</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-start justify-between gap-4 text-left"
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900">{addr.title || 'Address'}</span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-stone-800">
                            {addr.recipientName || addr.recipient_name} • {addr.phone}
                          </p>
                          <p className="text-stone-500 leading-relaxed">
                            {addr.streetAddress || addr.street_address}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. CHANGE PASSWORD TAB */}
            {activeTab === 'security' && (
              <div className="space-y-4 max-w-md">
                <div className="pb-3 border-b border-stone-200">
                  <h4 className="font-serif text-base font-semibold text-stone-900">
                    Security & Password
                  </h4>
                  <p className="text-xs text-stone-500">
                    Change your account password securely with BCrypt encryption.
                  </p>
                </div>

                {passwordError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">New Password (min 6 chars) *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-stone-900 hover:bg-black text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer mt-2"
                  >
                    Update Password (POST /api/user/change-password)
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
