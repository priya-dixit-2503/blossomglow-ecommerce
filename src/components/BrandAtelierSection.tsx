import React from 'react';
import { Sparkles, ShieldCheck, Heart, Leaf, Wind } from 'lucide-react';

export const BrandAtelierSection: React.FC = () => {
  return (
    <section className="w-full py-20 bg-[#F4EFEB] border-t border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-white">
              <img
                src="/src/assets/images/wooden_dough_bowl_1790142271592.jpg"
                alt="BlossomGlow Candle Creations artisanal botanical candle crafting"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-52 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-stone-200 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-semibold mb-1">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>14-Day Slow Cure</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Allowing natural botanical waxes to settle at steady temperatures ensures an ultra-clean burn.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Manifesto */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-amber-800">
                <span>The BlossomGlow Philosophy</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Small-Batch Craft</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 leading-tight [text-wrap:balance]">
                Hand-Poured With Reverence For Pure Nature
              </h2>
            </div>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-light">
              BlossomGlow Candle Creations was born out of a dedication to superior aesthetic lighting, 100% smokeless performance, and non-toxic waxes. We pour every single vessel by hand in small artisan batches, infusing pure essential oils and clean wicks to bring soothing warmth to your living spaces.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-white/80 border border-stone-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>100% Organic Soy Wax</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Renewable, biodegradable, and clean-burning at lower temperatures for longer burn hours.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-white/80 border border-stone-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                  <Wind className="w-4 h-4 text-amber-700" />
                  <span>Crackling Wood Wicks</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Sourced from FSC-certified sustainable timber, creating a nostalgic campfire crackle.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-white/80 border border-stone-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Pure Botanical Petals</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Infused with real sun-dried rosebuds, lavender florets, and steam-distilled essential oils.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-white/80 border border-stone-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Zero Toxic Chemical Additives</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  100% free from phthalates, parabens, synthetic paraffin, and artificial dyes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
