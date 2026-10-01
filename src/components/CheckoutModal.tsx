import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  ArrowRight,
  Package,
  Lock,
  UserCheck,
  AlertCircle,
  Building2,
  Zap,
  Printer,
  FileText,
  Sparkles
} from 'lucide-react';
import { CartItem, CustomerOrderInfo, Order, UserProfile } from '../types';
import { CandleApiService } from '../services/api';
import { RazorpayTestModal } from './RazorpayTestModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  couponCode: string;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onOrderSuccess: (order: Order) => void;
  onTrackOrder?: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  couponCode,
  currentUser,
  onOpenAuth,
  onOrderSuccess,
  onTrackOrder,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'confirmed'>('details');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [formData, setFormData] = useState<CustomerOrderInfo>({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    specialInstructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery'>('UPI');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  // Synchronize form with authenticated customer when currentUser changes
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.fullName,
        email: currentUser.email,
        phone: prev.phone || currentUser.phone || '',
      }));

      CandleApiService.getUserAddresses().then((addrs) => {
        if (addrs && addrs.length > 0) {
          setSavedAddresses(addrs);
          const def = addrs.find((a: any) => a.isDefault || a.is_default) || addrs[0];
          if (def) {
            setFormData((prev) => ({
              ...prev,
              fullName: prev.fullName || def.recipientName || def.recipient_name || '',
              phone: prev.phone || def.phone || '',
              address: prev.address || def.streetAddress || def.street_address || '',
              city: prev.city || def.city || '',
              state: prev.state || def.state || 'Maharashtra',
              pincode: prev.pincode || def.pincode || '',
            }));
          }
        }
      });
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  let discount = 0;
  if (couponCode.toUpperCase() === 'GLOW10' || couponCode.toUpperCase() === 'AURAGLOW') discount = Math.round(subtotal * 0.1);
  if (couponCode.toUpperCase() === 'AUTUMN20') discount = Math.round(subtotal * 0.2);
  const shippingFee = subtotal >= 999 || items.length === 0 ? 0 : 99;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const validateDetails = () => {
    const errors: { [key: string]: string } = {};

    // Check customer authentication
    const activeUser = CandleApiService.getCurrentUser();
    if (!activeUser) {
      errors.auth = 'Spring Security requires an authenticated customer account (ROLE_CUSTOMER) to place orders.';
    }

    if (!formData.fullName.trim()) errors.fullName = 'Please provide your full name';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required for shipping updates';
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = '10-digit mobile number required';
    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length < 6) errors.pincode = 'Valid 6-digit postal code required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      setStep('payment');
    }
  };

  const handleQuickCustomerSignIn = async () => {
    try {
      const user = await CandleApiService.login('customer@blossomglow.in', 'candle123');
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '9876543210',
      }));
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.auth;
        return copy;
      });
    } catch {
      // fallback
    }
  };

  // Open the Razorpay Sandbox / Payment Gateway simulator modal
  const handleProceedToGateway = () => {
    setOrderError(null);
    setIsGatewayOpen(true);
  };

  // Called when transaction is authorized & captured in the test gateway
  const handleGatewaySuccess = async (details: {
    gateway: string;
    paymentId: string;
    gatewayOrderId: string;
    paymentStatus: 'Captured' | 'Authorized' | 'COD_Pending';
    bankRefNumber: string;
    paymentMethodDetails: string;
    method: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  }) => {
    setIsGatewayOpen(false);
    setStep('processing');
    setOrderError(null);
    try {
      const order = await CandleApiService.createOrder({
        items,
        customerInfo: formData,
        paymentMethod: details.method,
        discountCode: couponCode,
        paymentGatewayDetails: details,
      });
      setCreatedOrder(order);
      setStep('confirmed');
      onOrderSuccess(order);
    } catch (err: any) {
      console.error(err);
      setOrderError(err.message || 'Failed to complete order');
      setStep('payment');
    }
  };

  const handleGatewayFailure = (errorMsg: string) => {
    setIsGatewayOpen(false);
    setOrderError(errorMsg);
    setStep('payment');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xl font-medium text-stone-900">
              BlossomGlow Checkout
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-mono tabular-nums font-semibold">
              Total: ₹{totalAmount}
            </span>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-stone-800 transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Stages */}
        <div className="p-6 sm:p-8">
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="text-left mb-4">
                <h3 className="font-editorial text-lg font-medium text-stone-900">
                  1. Shipping &amp; Contact Details
                </h3>
                <p className="text-xs text-stone-500">
                  Your candles are safely packaged with biodegradable honeycomb cushioning.
                </p>
              </div>

              {/* Spring Security RBAC Customer Banner */}
              {currentUser ? (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-950">
                          Authenticated Customer: {currentUser.fullName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {currentUser.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                        {currentUser.email} • JWT Bearer Token Active
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 bg-white/80 px-2 py-1 rounded-md border border-emerald-200 font-medium">
                    Order Privacy Protected
                  </span>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl text-left">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-amber-100 text-amber-900 rounded-lg shrink-0 mt-0.5">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-stone-900">
                          Customer Authentication Required (Spring Security)
                        </h4>
                        <span className="text-[10px] font-mono uppercase bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                          POST /api/orders
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        In production, order creation is restricted to authenticated customers (<code>ROLE_CUSTOMER</code>). Please sign in or use 1-click customer login to complete this order.
                      </p>
                      {formErrors.auth && (
                        <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-medium mt-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{formErrors.auth}</span>
                        </div>
                      )}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {onOpenAuth && (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenAuth('login')}
                              className="px-3 py-1 bg-stone-900 hover:bg-black text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Sign In
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenAuth('register')}
                              className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Create Account
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={handleQuickCustomerSignIn}
                          className="px-3 py-1 bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>1-Click Demo Customer Login</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ananya Patel"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                  />
                  {formErrors.fullName && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Mobile Number (for Courier updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                  />
                  {formErrors.phone && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Email Address (for Order Receipt) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ananya@example.com"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                />
                {formErrors.email && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.email}</p>}
              </div>

              {savedAddresses.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Saved Delivery Addresses
                    </span>
                    <span className="text-[10px] text-amber-700 font-mono">1-Click Select</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            fullName: addr.recipientName || addr.recipient_name || prev.fullName,
                            phone: addr.phone || prev.phone,
                            address: addr.streetAddress || addr.street_address || prev.address,
                            city: addr.city || prev.city,
                            state: addr.state || prev.state,
                            pincode: addr.pincode || prev.pincode,
                          }));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                          formData.address === (addr.streetAddress || addr.street_address)
                            ? 'bg-amber-800 text-amber-50 border-amber-800 shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                        }`}
                      >
                        {addr.title || 'Address'}: {addr.city} ({addr.pincode})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat / Villa number, Apartment name, Street, Landmark"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                />
                {formErrors.address && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.address}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                  />
                  {formErrors.city && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.city}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800 bg-white"
                  >
                    {['Maharashtra', 'Delhi NCR', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Telangana', 'Kerala', 'Punjab', 'Other'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 400001"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800 font-mono"
                  />
                  {formErrors.pincode && <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.pincode}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#262220] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Payment (₹{totalAmount})</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="font-editorial text-lg font-medium text-stone-900">
                    2. Select Payment Method
                  </h3>
                  <p className="text-xs text-stone-500">
                    Encrypted with 256-bit bank grade security
                  </p>
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="text-xs text-amber-800 hover:underline"
                >
                  Edit Address
                </button>
              </div>

              {orderError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-left flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="text-xs font-semibold text-rose-900">
                      Order Rejection / Insufficient Stock
                    </h5>
                    <p className="text-[11px] text-rose-700 mt-0.5 font-medium leading-relaxed">
                      {orderError}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {[
                  {
                    id: 'UPI',
                    name: 'Instant UPI (Google Pay, PhonePe, Paytm, QR)',
                    sub: 'Fastest & Zero Fee • Simulated Mobile Scan & Push Request',
                    icon: QrCode
                  },
                  {
                    id: 'Card',
                    name: 'Credit / Debit Card (Visa, Mastercard, RuPay)',
                    sub: 'Indian & International Cards • Simulated 3D-Secure Bank OTP',
                    icon: CreditCard
                  },
                  {
                    id: 'NetBanking',
                    name: 'NetBanking (HDFC, ICICI, SBI, Axis, 50+ Banks)',
                    sub: 'Direct retail internet banking authorization simulator',
                    icon: Building2
                  },
                  {
                    id: 'Cash on Delivery',
                    name: 'Cash On Delivery (COD)',
                    sub: 'Pay with cash or UPI at your doorstep • Phone SMS OTP verified',
                    icon: Truck
                  }
                ].map((option) => (
                  <label
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id as any)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === option.id
                        ? 'border-blue-700 bg-blue-50/50 shadow-xs ring-1 ring-blue-700/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === option.id}
                      onChange={() => setPaymentMethod(option.id as any)}
                      className="mt-1 text-blue-700 focus:ring-blue-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-900">{option.name}</span>
                        <option.icon className="w-4 h-4 text-stone-600" />
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-0.5">{option.sub}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Payment Gateway Sandbox Notice */}
              <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-left flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-semibold block">Production-Ready Gateway Simulator</span>
                  <span className="text-[11px] text-amber-800 leading-relaxed block mt-0.5">
                    Clicking continue will open our test <strong>Razorpay Sandbox Checkout</strong>. You can test live UPI QR scanning, card autofill with 3D Secure OTP, NetBanking login, or doorstep COD phone verification without real money.
                  </span>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Shipping to:</span>
                  <span className="font-medium text-stone-900 text-right line-clamp-1 max-w-[200px]">
                    {formData.fullName}, {formData.city}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Items:</span>
                  <span>{items.reduce((s, i) => s + i.quantity, 0)} candles</span>
                </div>
                <div className="flex justify-between font-semibold text-stone-900 text-sm pt-2 border-t border-stone-200">
                  <span>Grand Total:</span>
                  <span className="font-mono tabular-nums">₹{totalAmount}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-500 pt-1">
                  <ShieldCheck className="w-3 h-3 text-stone-600 shrink-0" />
                  <span>Backend Authority: Final prices, inventory stock &amp; discounts verified on server.</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleProceedToGateway}
                  className="flex-1 bg-[#0c2340] hover:bg-[#13335c] text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Proceed to Pay (₹{totalAmount}) · Razorpay Sandbox</span>
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-3 border-amber-800 border-t-transparent rounded-full animate-spin" />
              <h3 className="font-editorial text-xl font-medium text-stone-900">
                Securing Your BlossomGlow Candle Creations Order...
              </h3>
              <p className="text-xs text-stone-500 max-w-sm">
                Communicating with payment gateway and dispatching artisan batch allocation...
              </p>
            </div>
          )}

          {step === 'confirmed' && createdOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-800">
                  Order Successfully Placed
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900">
                  Thank you for choosing BlossomGlow Candle Creations ✨
                </h3>
                <p className="text-sm text-stone-700 font-light max-w-md mx-auto">
                  Your little glow is on its way.
                </p>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Your candles are being hand-poured and carefully prepared in our workshop. We have sent the confirmation to <strong className="text-stone-900">{createdOrder.customerInfo.email}</strong>.
                </p>
              </div>

              {/* Order Metadata Tile with Gateway Information */}
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-4 sm:p-5 text-xs text-left grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-mono">Order Reference</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{createdOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-mono">Courier Tracking</span>
                  <span className="font-mono font-semibold text-amber-900 text-xs">{createdOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-mono">Estimated Arrival</span>
                  <span className="font-medium text-stone-800">{createdOrder.estimatedDeliveryDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-mono">Payment Method</span>
                  <span className="font-medium text-stone-800">{createdOrder.paymentMethod}</span>
                </div>

                {/* Gateway Metadata Row */}
                <div className="col-span-2 pt-2.5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                  <div>
                    <span className="text-[10px] font-mono text-blue-900 font-semibold uppercase block">
                      Gateway Reference ({createdOrder.paymentGateway || 'Razorpay Test Sandbox'})
                    </span>
                    <span className="font-mono text-stone-700 text-[11px] block">
                      ID: <strong className="text-stone-900">{createdOrder.paymentId || 'pay_demo_captured'}</strong> • RRN: {createdOrder.bankRefNumber || '32901849182'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {createdOrder.paymentStatus || 'Captured'}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 pt-2 border-t border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Server-Verified Final Amount</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    ₹{createdOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-4 py-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-stone-600" />
                  <span>Print Tax Invoice</span>
                </button>
                {onTrackOrder && (
                  <button
                    onClick={() => {
                      onClose();
                      onTrackOrder(createdOrder.orderNumber);
                    }}
                    className="flex-1 bg-amber-400 hover:bg-amber-300 text-stone-950 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>Track This Order</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#262220] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RAZORPAY TEST MODE MODAL SIMULATOR */}
      <RazorpayTestModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        orderAmount={totalAmount}
        customerInfo={formData}
        initialMethod={paymentMethod}
        onPaymentSuccess={handleGatewaySuccess}
        onPaymentFailure={handleGatewayFailure}
      />
    </div>
  );
};
