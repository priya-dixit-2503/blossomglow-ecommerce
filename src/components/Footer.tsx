import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, ShieldCheck, Terminal, Package, PhoneCall, Mail, MapPin } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brandConfig';

interface FooterProps {
  onOpenScentQuiz: () => void;
  onOpenGiftBuilder: () => void;
  onOpenCareGuide: () => void;
  onOpenArchitecture: () => void;
  onOpenTracking: () => void;
  onNavigateToShop: (category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenScentQuiz,
  onOpenGiftBuilder,
  onOpenCareGuide,
  onOpenArchitecture,
  onOpenTracking,
  onNavigateToShop,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#161311] text-[#E8E3DD] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-editorial text-2xl md:text-3xl font-normal tracking-wider text-white block">
                {BRAND_CONFIG.brandName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-medium block">
                Candles &amp; Home Accents
              </span>
            </div>

            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              We seek to awaken your senses, to bring to your life and home a deep sense of joy, serenity, and illumination through handcrafted scented pillars, amber jar soy candles, floating flower blossoms, and luxury urli gift sets.
            </p>

            {/* Contact details */}
            <div className="space-y-1.5 text-xs text-stone-400 font-light pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{BRAND_CONFIG.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`mailto:${BRAND_CONFIG.email}`} className="hover:text-amber-200 transition-colors">
                  {BRAND_CONFIG.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`tel:${BRAND_CONFIG.phone}`} className="hover:text-amber-200 transition-colors">
                  {BRAND_CONFIG.phone} (Mon-Sat, 10am - 7pm IST)
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-300/90 pt-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>100% Smokeless Burn &bull; Pure Essential Oils</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-widest text-amber-300">
              Aura Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateToShop('Pillar Candles')}
                  className="hover:text-white transition-colors"
                >
                  Scented Pillar Candles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToShop('Jar & Container Candles')}
                  className="hover:text-white transition-colors"
                >
                  Amber Jar Soya Candles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToShop('Floating & Urli Sets')}
                  className="hover:text-white transition-colors"
                >
                  Floating Flower Candles &amp; Urlis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToShop('Sculptural Candles')}
                  className="hover:text-white transition-colors"
                >
                  Buddha &amp; Sculptural Candles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToShop('Botanical Bowls & Shells')}
                  className="hover:text-white transition-colors"
                >
                  Carved Wood Dough Bowls
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToShop('Luxury Gift Hampers')}
                  className="hover:text-white transition-colors"
                >
                  Luxury Festive Gift Hampers
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support & Services */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-widest text-amber-300">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-200">
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={onOpenGiftBuilder} className="hover:text-white transition-colors">
                  Custom Gift Hamper Studio
                </button>
              </li>
              <li>
                <button onClick={onOpenScentQuiz} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Scent Finder Quiz
                </button>
              </li>
              <li>
                <button onClick={onOpenCareGuide} className="hover:text-white transition-colors">
                  Candle Care &amp; Burn Guide
                </button>
              </li>
              <li>
                <button onClick={onOpenArchitecture} className="hover:text-white transition-colors flex items-center gap-1.5 text-stone-400">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  API Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-widest text-amber-300">
              Join BlossomGlow Circle
            </h4>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Subscribe for festive previews, aromatherapy insights, and <strong className="text-amber-200">10% off</strong> with code <code className="text-amber-300 bg-stone-900 px-1 py-0.5 rounded font-mono">GLOW10</code>.
            </p>
            {subscribed ? (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-700/60 rounded-lg text-emerald-300 text-xs flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Welcome to BlossomGlow Candle Creations. Check your inbox for your code.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-l-lg text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-r-lg text-xs font-semibold cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Payment & Security Badges */}
            <div className="pt-2">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">
                100% Secure Checkout
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-300">
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-700 rounded">UPI</span>
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-700 rounded">GPay</span>
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-700 rounded">PhonePe</span>
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-700 rounded">Cards</span>
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-700 rounded">NetBanking</span>
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-700 rounded">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} {BRAND_CONFIG.brandName} &bull; Handcrafted Candle Atelier &bull; Awaken Your Senses.</p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Free Shipping Above ₹999</span>
            <span>&bull;</span>
            <span>Pan-India Safe Delivery</span>
            <span>&bull;</span>
            <span>Non-Toxic Waxes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
