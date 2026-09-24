import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCT_ASSETS } from '../assets/products';

interface PromotionalBannerProps {
  onShopNow: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onShopNow }) => {
  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden bg-stone-950 flex items-center justify-center">
      {/* Background Photography with atmospheric overlay */}
      <div className="absolute inset-0">
        <img
          src={PRODUCT_ASSETS.gildedLotusHamper}
          alt="BlossomGlow Candle Creations Hearth Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.08] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
      </div>

      {/* Floating Center Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs uppercase font-mono tracking-widest backdrop-blur-md shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Small Batch • Handcrafted with Love</span>
        </div>

        <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-light text-[#FAF8F5] tracking-tight leading-[1.12]">
          Make Every Moment Glow
        </h2>

        <p className="text-base sm:text-xl text-stone-200 font-light max-w-2xl mx-auto leading-relaxed">
          Thoughtful candles for moments worth remembering.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={onShopNow}
            className="px-9 py-4 bg-[#F5EADB] hover:bg-white text-stone-950 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] rounded-xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2.5 group"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-4 h-4 text-stone-900 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
