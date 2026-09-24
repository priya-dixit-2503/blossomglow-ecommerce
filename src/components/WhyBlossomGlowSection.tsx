import React from 'react';
import { Sparkles, Flame, Gift, ShieldCheck, HeartHandshake, Feather } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brandConfig';

export const WhyBlossomGlowSection: React.FC = () => {
  const pillars = [
    {
      title: '100% SMOKELESS BURN',
      description: 'Clean, soot-free flame engineered for comfortable indoor spaces.',
      icon: Flame,
      detail: 'Formulated with ultra-refined clean-burning wax bases and lead-free organic cotton wicks that provide up to 25+ hours of steady luminescence.',
    },
    {
      title: 'PURE ESSENTIAL OILS',
      description: 'Awaken your senses with authentic therapeutic aromatherapy.',
      icon: Feather,
      detail: 'Infused with natural essential oils—Bulgarian rose, coastal marine salt, Mysore sandalwood, and warm cinnamon—for rich, long-lasting aroma throw.',
    },
    {
      title: 'HANDCRAFTED & SCULPTED',
      description: 'Artfully sculpted and hand-poured in small studio batches.',
      icon: Sparkles,
      detail: 'From delicate floating flower blossoms to hand-carved solid wooden troughs and peaceful Buddha statues, each creation is inspected with pride.',
    },
    {
      title: 'FESTIVE & GIFT READY',
      description: 'Thoughtful gifting for weddings, Diwali, poojas & celebrations.',
      icon: Gift,
      detail: 'Packed in luxurious rigid gift boxes with gold foil embossing, metallic hammered urlis, and protective bubble cushioning for safe pan-India arrival.',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#FAF7F2] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-amber-900 block">
            The BlossomGlow Distinction
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 leading-tight">
            Why Choose {BRAND_CONFIG.brandName}?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            We seek to awaken your senses, to bring to your life and home, a deep sense of joy, serenity, and illumination.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-7 border border-stone-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-200 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-editorial text-lg text-stone-900 font-medium tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-medium text-stone-700 leading-snug">
                    {pillar.description}
                  </p>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                    {pillar.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
