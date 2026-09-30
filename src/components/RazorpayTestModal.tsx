import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Truck,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight,
  Lock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { CustomerOrderInfo } from '../types';

interface RazorpayTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderAmount: number;
  customerInfo: CustomerOrderInfo;
  initialMethod?: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  onPaymentSuccess: (details: {
    gateway: string;
    paymentId: string;
    gatewayOrderId: string;
    paymentStatus: 'Captured' | 'Authorized' | 'COD_Pending';
    bankRefNumber: string;
    paymentMethodDetails: string;
    method: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  }) => void;
  onPaymentFailure: (errorMessage: string) => void;
}

export const RazorpayTestModal: React.FC<RazorpayTestModalProps> = ({
  isOpen,
  onClose,
  orderAmount,
  customerInfo,
  initialMethod = 'UPI',
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [activeTab, setActiveTab] = useState<'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery'>(initialMethod);
  const [upiSubTab, setUpiSubTab] = useState<'qr' | 'vpa'>('qr');
  const [gatewayOrderId] = useState(() => `order_bg_${Math.random().toString(36).substring(2, 10)}`);
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardHolder, setCardHolder] = useState(customerInfo.fullName || 'Artisan Patron');
  const [cardType, setCardType] = useState<'Visa' | 'Mastercard' | 'RuPay'>('Visa');

  // UPI State
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [showUpiPushAlert, setShowUpiPushAlert] = useState(false);

  // NetBanking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [bankUsername, setBankUsername] = useState('PATRON_78491');
  const [isBankRedirecting, setIsBankRedirecting] = useState(false);

  // COD State
  const [codOtp, setCodOtp] = useState('');
  const [codOtpSent, setCodOtpSent] = useState(true);

  // Gateway Simulation Stages
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | '3ds_otp' | 'failed' | 'success'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [threeDsOtp, setThreeDsOtp] = useState('');
  const [failureReason, setFailureReason] = useState<string | null>(null);

  // Sync activeTab when modal opens with initialMethod
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMethod);
      setProcessingState('idle');
      setFailureReason(null);
      setShowUpiPushAlert(false);
      setIsBankRedirecting(false);
    }
  }, [isOpen, initialMethod]);

  if (!isOpen) return null;

  // Format card number with spaces
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
    if (raw.startsWith('4')) setCardType('Visa');
    else if (raw.startsWith('5')) setCardType('Mastercard');
    else setCardType('RuPay');
  };

  const handleExpiryChange = (val: string) => {
    let clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length > 2) {
      clean = `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
    }
    setCardExpiry(clean);
  };

  const quickFillCard = (type: 'visa' | 'mastercard' | 'rupay' | 'decline') => {
    if (type === 'visa') {
      setCardNumber('4111 2222 3333 4444');
      setCardExpiry('12/28');
      setCardCvv('892');
      setCardHolder(customerInfo.fullName || 'Artisan Patron');
      setCardType('Visa');
    } else if (type === 'mastercard') {
      setCardNumber('5123 4567 8901 2345');
      setCardExpiry('08/29');
      setCardCvv('731');
      setCardHolder(customerInfo.fullName || 'Artisan Patron');
      setCardType('Mastercard');
    } else if (type === 'rupay') {
      setCardNumber('6071 8291 0293 8472');
      setCardExpiry('04/30');
      setCardCvv('421');
      setCardHolder(customerInfo.fullName || 'Artisan Patron');
      setCardType('RuPay');
    } else if (type === 'decline') {
      setCardNumber('4000 0000 0000 0002');
      setCardExpiry('01/25');
      setCardCvv('000');
      setCardHolder('Declined Test Card');
    }
  };

  // Authorize Payment (Success Flow)
  const triggerSuccess = (customMethodText?: string) => {
    setProcessingState('processing');
    setStatusMessage('Contacting Razorpay Secure Node (Test Mode)...');

    setTimeout(() => {
      setStatusMessage('Authorizing transaction with bank network...');
    }, 600);

    setTimeout(() => {
      setStatusMessage('Payment Captured & Verified by BlossomGlow Atelier.');
      const paymentId = `pay_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`;
      const bankRefNumber = `RRN${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      onPaymentSuccess({
        gateway: 'Razorpay (Test Sandbox)',
        paymentId,
        gatewayOrderId,
        paymentStatus: activeTab === 'Cash on Delivery' ? 'COD_Pending' : 'Captured',
        bankRefNumber,
        paymentMethodDetails: customMethodText || `${activeTab} • Razorpay Test Mode`,
        method: activeTab,
      });
    }, 1400);
  };

  // Trigger Failure Flow (Simulates gateway error)
  const triggerFailure = (reason = 'BAD_REQUEST_ERROR: Insufficient funds or card declined by issuing bank.') => {
    setProcessingState('processing');
    setStatusMessage('Connecting to payment gateway...');
    setTimeout(() => {
      setProcessingState('failed');
      setFailureReason(reason);
      onPaymentFailure(reason);
    }, 900);
  };

  // Handle Card Pay Button
  const handleCardPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.includes('0000 0000')) {
      triggerFailure('CARD_DECLINED: Test card configured for simulated decline.');
      return;
    }
    // Launch 3DS OTP Simulation
    setProcessingState('3ds_otp');
  };

  // Submit 3DS OTP
  const handle3dsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (threeDsOtp === '000000') {
      triggerFailure('AUTHENTICATION_FAILED: Invalid 3D Secure OTP entered.');
    } else {
      triggerSuccess(`${cardType} ending in ${cardNumber.slice(-4)} (3D Secure Verified)`);
    }
  };

  // Handle COD Verification
  const handleCodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codOtp === '000000') {
      triggerFailure('OTP_FAILED: Incorrect phone verification code.');
    } else {
      triggerSuccess('Cash on Delivery (OTP Phone Verified)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-blue-900/20 text-stone-900 text-left">
        
        {/* ========================================================
            RAZORPAY TEST MODE HEADER
            ======================================================== */}
        <div className="bg-[#0C2340] text-white px-5 sm:px-6 py-4 border-b border-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-wide text-white">Razorpay Standard</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400 text-stone-950 shadow-xs">
                  Sandbox Test Mode
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80 font-mono mt-0.5">
                Merchant: BlossomGlow Atelier • {gatewayOrderId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-widest text-blue-300 block">Amount to Pay</span>
              <span className="text-base sm:text-lg font-bold text-amber-300 font-mono tabular-nums">
                ₹{orderAmount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Cancel payment"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Test Mode Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-[11px] text-amber-900">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Portfolio Demonstration:</strong> Simulated payment gateway. No real money or card details are processed.
            </span>
          </div>
          <span className="hidden sm:inline font-mono font-semibold text-[10px] bg-amber-200/60 px-2 py-0.5 rounded">
            PCI-DSS 4.0 Mock
          </span>
        </div>

        {/* ========================================================
            MODAL BODY / PAYMENT METHODS TABS
            ======================================================== */}
        {processingState === 'idle' && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Method Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('UPI')}
                className={`py-2 px-2 rounded-lg font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'UPI' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>UPI</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('Card')}
                className={`py-2 px-2 rounded-lg font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'Card' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('NetBanking')}
                className={`py-2 px-2 rounded-lg font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'NetBanking' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>NetBanking</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('Cash on Delivery')}
                className={`py-2 px-2 rounded-lg font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'Cash on Delivery' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Truck className="w-4 h-4 text-blue-600" />
                <span>COD</span>
              </button>
            </div>

            {/* TAB 1: UPI */}
            {activeTab === 'UPI' && (
              <div className="space-y-4">
                <div className="flex border-b border-stone-200">
                  <button
                    type="button"
                    onClick={() => setUpiSubTab('qr')}
                    className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                      upiSubTab === 'qr' ? 'border-blue-600 text-blue-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    UPI QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiSubTab('vpa')}
                    className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                      upiSubTab === 'vpa' ? 'border-blue-600 text-blue-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    UPI ID / VPA
                  </button>
                </div>

                {upiSubTab === 'qr' ? (
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-stone-50 border border-stone-200/90">
                    {/* Simulated QR Code Graphic */}
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-200 flex flex-col items-center shrink-0">
                      <div className="w-36 h-36 bg-[#0c2340] rounded-lg p-2.5 flex items-center justify-center text-white relative group cursor-pointer"
                           onClick={() => triggerSuccess('Instant UPI QR (Simulated Mobile Scan)')}>
                        <div className="w-full h-full bg-white p-1 rounded grid grid-cols-6 grid-rows-6 gap-0.5">
                          {/* Top-left marker */}
                          <div className="col-span-2 row-span-2 bg-[#0c2340] p-1 flex items-center justify-center">
                            <div className="w-full h-full bg-white p-0.5"><div className="w-full h-full bg-[#0c2340]" /></div>
                          </div>
                          <div className="bg-[#0c2340]" /><div className="bg-white" /><div className="bg-[#0c2340]" /><div className="bg-white" />
                          <div className="bg-white" /><div className="bg-[#0c2340]" /><div className="bg-white" /><div className="bg-[#0c2340]" />
                          {/* Top-right marker */}
                          <div className="col-span-2 row-span-2 col-start-5 bg-[#0c2340] p-1 flex items-center justify-center">
                            <div className="w-full h-full bg-white p-0.5"><div className="w-full h-full bg-[#0c2340]" /></div>
                          </div>
                          {/* Bottom-left marker */}
                          <div className="col-span-2 row-span-2 row-start-5 bg-[#0c2340] p-1 flex items-center justify-center">
                            <div className="w-full h-full bg-white p-0.5"><div className="w-full h-full bg-[#0c2340]" /></div>
                          </div>
                          <div className="bg-[#0c2340]" /><div className="bg-[#0c2340]" /><div className="bg-white" /><div className="bg-[#0c2340]" />
                          <div className="bg-white" /><div className="bg-[#0c2340]" /><div className="bg-white" /><div className="bg-white" />
                          <div className="col-span-2 row-span-2 col-start-4 row-start-4 bg-amber-400 rounded-sm flex items-center justify-center text-[8px] font-bold text-stone-900">
                            ₹{orderAmount}
                          </div>
                        </div>
                        {/* Hover overlay hint */}
                        <div className="absolute inset-0 bg-blue-900/90 rounded-lg flex items-center justify-center text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-white font-medium">Click to simulate instant scan &amp; payment</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono mt-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Listening for UPI scan...
                      </span>
                    </div>

                    {/* QR Details */}
                    <div className="space-y-2.5 text-xs flex-1">
                      <div>
                        <h4 className="font-semibold text-stone-900">Scan &amp; Pay with any UPI App</h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Open Google Pay, PhonePe, Paytm, CRED, or BHIM on your phone and scan the QR code.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-stone-600">
                        <span className="px-2 py-0.5 rounded bg-white border border-stone-200">Google Pay</span>
                        <span className="px-2 py-0.5 rounded bg-white border border-stone-200">PhonePe</span>
                        <span className="px-2 py-0.5 rounded bg-white border border-stone-200">Paytm</span>
                        <span className="px-2 py-0.5 rounded bg-white border border-stone-200">CRED</span>
                        <span className="px-2 py-0.5 rounded bg-white border border-stone-200">BHIM</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerSuccess('Instant UPI QR (Simulated Mobile Scan)')}
                        className="w-full mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Simulate Phone Scan &amp; Authorize (₹{orderAmount})</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                    <div>
                      <label className="font-semibold text-stone-800 block mb-1">Enter your Virtual Payment Address (VPA)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank"
                          className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowUpiPushAlert(true)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                        >
                          Request OTP / Push
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <span>Quick Test Presets:</span>
                      <button
                        type="button"
                        onClick={() => setUpiId('success@razorpay')}
                        className="text-blue-700 hover:underline font-mono"
                      >
                        success@razorpay
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setUpiId('customer@okhdfcbank')}
                        className="text-blue-700 hover:underline font-mono"
                      >
                        customer@okhdfcbank
                      </button>
                    </div>

                    {showUpiPushAlert && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl animate-in fade-in space-y-2">
                        <div className="flex items-start gap-2">
                          <Smartphone className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-blue-950 block">UPI Collect Request Dispatched</span>
                            <span className="text-[11px] text-blue-800 block mt-0.5">
                              A payment notification of ₹{orderAmount} was pushed to <code>{upiId}</code>.
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => triggerSuccess(`UPI ID: ${upiId} (Approved via App)`)}
                            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Simulate Accept in UPI App
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerFailure('COLLECT_REJECTED: Customer declined UPI collect request.')}
                            className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            Simulate Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CREDIT / DEBIT CARDS */}
            {activeTab === 'Card' && (
              <form onSubmit={handleCardPay} className="space-y-4">
                {/* Test Presets */}
                <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] font-semibold text-blue-950 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    Auto-Fill Test Cards:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => quickFillCard('visa')}
                      className="px-2 py-0.5 bg-white hover:bg-blue-100 border border-blue-300 rounded text-[10px] font-semibold text-blue-900 cursor-pointer"
                    >
                      Visa Success
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFillCard('mastercard')}
                      className="px-2 py-0.5 bg-white hover:bg-blue-100 border border-blue-300 rounded text-[10px] font-semibold text-blue-900 cursor-pointer"
                    >
                      Mastercard
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFillCard('rupay')}
                      className="px-2 py-0.5 bg-white hover:bg-blue-100 border border-blue-300 rounded text-[10px] font-semibold text-blue-900 cursor-pointer"
                    >
                      RuPay
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFillCard('decline')}
                      className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded text-[10px] font-semibold text-rose-800 cursor-pointer"
                    >
                      Decline Test
                    </button>
                  </div>
                </div>

                {/* Card Fields */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-800">Card Number</label>
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {cardType} Network
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        required
                        className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-xs font-mono tracking-wider focus:outline-none focus:border-blue-600 bg-white"
                      />
                      <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-800 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-800 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.substring(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        required
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name as printed on card"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proceed with Card (₹{orderAmount})</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </form>
            )}

            {/* TAB 3: NETBANKING */}
            {activeTab === 'NetBanking' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-stone-900 mb-2">Select Your Bank</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'HDFC Bank', code: 'HDFC' },
                      { name: 'ICICI Bank', code: 'ICICI' },
                      { name: 'State Bank of India', code: 'SBIN' },
                      { name: 'Axis Bank', code: 'UTIB' },
                      { name: 'Kotak Mahindra', code: 'KKBK' },
                      { name: 'Punjab National Bank', code: 'PUNB' }
                    ].map((bank) => (
                      <button
                        key={bank.name}
                        type="button"
                        onClick={() => setSelectedBank(bank.name)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedBank === bank.name
                            ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <span className="font-semibold text-xs block text-stone-900">{bank.name}</span>
                        <span className="text-[10px] font-mono text-stone-500 uppercase">{bank.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 font-medium">Selected Bank:</span>
                    <span className="font-semibold text-blue-900 font-mono">{selectedBank}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 font-medium">Sandbox User ID:</span>
                    <input
                      type="text"
                      value={bankUsername}
                      onChange={(e) => setBankUsername(e.target.value)}
                      className="px-2 py-0.5 border border-stone-300 rounded font-mono text-xs text-right bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsBankRedirecting(true);
                    setTimeout(() => {
                      triggerSuccess(`${selectedBank} NetBanking (User: ${bankUsername})`);
                    }, 1200);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-blue-200" />
                  <span>
                    {isBankRedirecting ? `Connecting to ${selectedBank}...` : `Login & Pay via ${selectedBank} (₹${orderAmount})`}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TAB 4: CASH ON DELIVERY */}
            {activeTab === 'Cash on Delivery' && (
              <form onSubmit={handleCodSubmit} className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>Doorstep Payment Guarantee</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    You can inspect your artisanal package upon arrival and pay ₹{orderAmount} via Cash or dynamic UPI QR to the courier executive.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-stone-800">Phone Verification Code (Anti-Fraud OTP)</label>
                      <button
                        type="button"
                        onClick={() => setCodOtp('123456')}
                        className="text-[11px] text-blue-700 hover:underline font-mono cursor-pointer"
                      >
                        Auto-Fill Test OTP (123456)
                      </button>
                    </div>
                    <input
                      type="text"
                      value={codOtp}
                      onChange={(e) => setCodOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                      placeholder="Enter 6-digit OTP sent to phone"
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono tracking-widest text-center focus:outline-none focus:border-blue-600 bg-white"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Simulated OTP dispatched to +91 {customerInfo.phone || '9876543210'}. Standard test OTP is <code>123456</code>.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#262220] hover:bg-black text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Verify OTP &amp; Confirm COD Order (₹{orderAmount})</span>
                </button>
              </form>
            )}

            {/* Quick Portfolio Testing Bar */}
            <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-stone-500 font-mono">Sandbox Quick Actions:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerSuccess()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Force Success</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerFailure()}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Simulate Decline</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STAGE: 3D SECURE OTP SIMULATOR (BANK AUTHENTICATION)
            ======================================================== */}
        {processingState === '3ds_otp' && (
          <div className="p-6 space-y-5 animate-in fade-in">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                <span className="font-bold text-xs text-blue-950 font-mono">{cardType} SecureCode 2.0</span>
                <span className="text-[10px] font-mono text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                  HDFC Bank Issuing Server
                </span>
              </div>
              <p className="text-xs text-blue-900">
                A one-time security password has been sent to your registered mobile ending in <strong>•••• 3210</strong>.
              </p>
              <div className="flex items-center justify-between text-xs text-stone-700 pt-1 font-mono">
                <span>Merchant: BlossomGlow Atelier</span>
                <span>Amount: ₹{orderAmount}</span>
              </div>
            </div>

            <form onSubmit={handle3dsSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-800">Enter Bank OTP</label>
                  <button
                    type="button"
                    onClick={() => setThreeDsOtp('123456')}
                    className="text-[11px] text-blue-700 hover:underline font-mono"
                  >
                    Auto-Fill Test OTP (123456)
                  </button>
                </div>
                <input
                  type="text"
                  value={threeDsOtp}
                  onChange={(e) => setThreeDsOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm font-mono tracking-widest text-center focus:outline-none focus:border-blue-600 bg-white"
                />
                <span className="text-[10px] text-stone-500 block mt-1 text-center font-mono">
                  Enter <code>123456</code> for test approval, or <code>000000</code> to test rejection.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit OTP &amp; Pay ₹{orderAmount}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProcessingState('idle')}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            STAGE: PROCESSING / CONTACTING GATEWAY
            ======================================================== */}
        {processingState === 'processing' && (
          <div className="p-12 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-stone-900">Processing Test Transaction</h3>
              <p className="text-xs text-stone-500 font-mono">{statusMessage}</p>
            </div>
            <p className="text-[11px] text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg inline-block font-mono border border-amber-200">
              Razorpay Sandbox Handshake in progress...
            </p>
          </div>
        )}

        {/* ========================================================
            STAGE: FAILED / DECLINED SIMULATION
            ======================================================== */}
        {processingState === 'failed' && (
          <div className="p-8 text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-stone-900">Payment Failed / Declined</h3>
              <p className="text-xs text-rose-700 font-mono max-w-md mx-auto bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {failureReason}
              </p>
              <p className="text-[11px] text-stone-500 mt-2">
                This is a simulated failure to demonstrate how your store handles bank rejections gracefully without losing the customer's cart.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProcessingState('idle')}
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Payment</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Bank Grade Encryption</span>
          </div>
          <span className="font-mono text-[10px] text-stone-400">BlossomGlow Atelier × Razorpay Demo</span>
        </div>
      </div>
    </div>
  );
};
