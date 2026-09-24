import React, { useState } from 'react';
import { X, Send, Mail, Phone, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { CandleApiService } from '../services/api';
import { BRAND_CONFIG } from '../config/brandConfig';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await CandleApiService.submitContact(formData);
      setIsSubmitted(true);
    } catch {
      // ignore
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#221E1C] text-white p-6 sm:p-8 flex items-start justify-between relative">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-amber-300 font-mono">
              Get in Touch
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-light">
              We’d Love to Hear From You
            </h3>
            <p className="text-xs text-stone-300 font-light">
              Order inquiries, custom candle requests & bulk gifting celebrations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-editorial text-2xl text-stone-900 font-light">
                Message Received with Love ✨
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-light leading-relaxed">
                Thank you, {formData.name}! Our atelier team will review your request and get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-stone-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Form */}
              <form onSubmit={handleSubmit} className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Patel"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ananya@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Subject / Request Type *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-600 transition-colors"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Tracking & Status">Order Tracking & Status</option>
                    <option value="Wedding / Celebration Favors">Wedding / Celebration Favors</option>
                    <option value="Corporate Bulk Hampers">Corporate Bulk Hampers</option>
                    <option value="Custom Candle Creation">Custom Candle Creation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your event, quantity needed, or specific scent preferences..."
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-600 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#24201E] hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send Message'}</span>
                </button>
              </form>

              {/* Sidebar Quick Details */}
              <div className="md:col-span-4 bg-stone-100/70 p-5 rounded-2xl border border-stone-200/80 space-y-6 text-xs text-stone-700">
                <div className="space-y-2">
                  <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                    Studio Details
                  </span>
                  <p className="font-light text-stone-600 leading-relaxed">
                    BlossomGlow Handcrafted Studio, India
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-800" />
                    Direct Email
                  </span>
                  <a href={`mailto:${BRAND_CONFIG.email}`} className="text-amber-900 hover:underline">
                    {BRAND_CONFIG.email}
                  </a>
                </div>

                <div className="space-y-2">
                  <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-800" />
                    WhatsApp Concierge
                  </span>
                  <p className="text-stone-600 font-mono">
                    {BRAND_CONFIG.phone}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/80">
                  <p className="text-[11px] text-stone-500 font-light italic">
                    Open Mon-Sat: 10:00 AM - 7:00 PM IST
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
