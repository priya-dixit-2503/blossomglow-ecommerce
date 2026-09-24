import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Truck, CreditCard, QrCode, ArrowRight, Package } from 'lucide-react';
import { CartItem, CustomerOrderInfo, Order } from '../types';
import { CandleApiService } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  couponCode: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  couponCode,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'confirmed'>('details');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [formData, setFormData] = useState<CustomerOrderInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    specialInstructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery'>('UPI');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  let discount = 0;
  if (couponCode.toUpperCase() === 'GLOW10' || couponCode.toUpperCase() === 'AURAGLOW') discount = Math.round(subtotal * 0.1);
  if (couponCode.toUpperCase() === 'AUTUMN20') discount = Math.round(subtotal * 0.2);
  const shippingFee = subtotal >= 999 || items.length === 0 ? 0 : 99;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const validateDetails = () => {
    const errors: { [key: string]: string } = {};
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

  const handlePlaceOrder = async () => {
    setStep('processing');
    try {
      const order = await CandleApiService.createOrder({
        items,
        customerInfo: formData,
        paymentMethod,
        discountCode: couponCode
      });
      setCreatedOrder(order);
      setStep('confirmed');
      onOrderSuccess(order);
    } catch (err) {
      console.error(err);
      setStep('payment');
    }
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

              <div className="space-y-2.5">
                {[
                  {
                    id: 'UPI',
                    name: 'Instant UPI (Google Pay, PhonePe, Paytm, QR)',
                    sub: 'Fastest & Zero transaction fee',
                    icon: QrCode
                  },
                  {
                    id: 'Card',
                    name: 'Credit / Debit Card (Visa, Mastercard, RuPay)',
                    sub: 'All Indian & International cards accepted',
                    icon: CreditCard
                  },
                  {
                    id: 'Cash on Delivery',
                    name: 'Cash On Delivery (COD)',
                    sub: 'Pay with cash or UPI at your doorstep',
                    icon: Truck
                  }
                ].map((option) => (
                  <label
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id as any)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === option.id
                        ? 'border-stone-900 bg-stone-50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === option.id}
                      onChange={() => setPaymentMethod(option.id as any)}
                      className="mt-1 text-stone-900 focus:ring-stone-900"
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
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-[#262220] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Confirm Order · ₹{totalAmount}</span>
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

              {/* Order Metadata Tile */}
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-4 text-xs text-left grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Order Reference</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{createdOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Courier Tracking</span>
                  <span className="font-mono font-semibold text-amber-900 text-xs">{createdOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Estimated Arrival</span>
                  <span className="font-medium text-stone-800">{createdOrder.estimatedDeliveryDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Payment Method</span>
                  <span className="font-medium text-stone-800">{createdOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#262220] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
