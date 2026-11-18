import React from 'react';
import { Gift, ArrowRight, Cake, Heart, Home, Sparkles, HandHeart, Smile } from 'lucide-react';
import { PRODUCT_ASSETS } from '../assets/products';

interface GiftingSectionProps {
  onExploreGifting: () => void;
  onOpenCustomHamper: () => void;
}

interface OccasionCard {
  title: string;
  icon: React.ElementType;
  tagline: string;
  colorBg: string;
  borderColor: string;
}

const OCCASIONS: OccasionCard[] = [
  {
    title: 'Birthday',
    icon: Cake,
    tagline: 'Delight their special day with sculpted floral cakes and fragrant honey botanicals.',
    colorBg: 'bg-rose-50/70',
    borderColor: 'border-rose-200/80',
  },
  {
    title: 'Anniversary',
    icon: Heart,
    tagline: 'Twin lotus blooms & crackling wooden wicks to celebrate timeless togetherness.',
    colorBg: 'bg-amber-50/70',
    borderColor: 'border-amber-200/80',
  },
  {
    title: 'Housewarming',
    icon: Home,
    tagline: 'Warm amber dough bowls & evil eye protectors to bless new beginnings.',
    colorBg: 'bg-stone-50',
    borderColor: 'border-stone-200',
  },
  {
    title: 'Festivals',
    icon: Sparkles,
    tagline: 'Opulent gilded lotus trays & temple incense candles for auspicious celebrations.',
    colorBg: 'bg-yellow-50/70',
    borderColor: 'border-yellow-200/80',
  },
  {
    title: 'Thank You',
    icon: HandHeart,
    tagline: 'Thoughtful token candles that express your deepest gratitude with warmth.',
    colorBg: 'bg-emerald-50/60',
    borderColor: 'border-emerald-200/70',
  },
  {
    title: 'Self-Care',
    icon: Smile,
    tagline: 'Unwind with calming lavender mist and a seated Buddha serenity flame.',
    colorBg: 'bg-purple-50/60',
    borderColor: 'border-purple-200/70',
  },
];

export const GiftingSection: React.FC<GiftingSectionProps> = ({ onExploreGifting, onOpenCustomHamper }) => {
  return (
    <section id="gifting" className="scroll-mt-24 py-20 sm:py-28 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
            <Gift className="w-3.5 h-3.5" />
            <span>The Gifting Concierge</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 leading-tight">
            Gift a Little Glow
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Every memorable milestone deserves a thoughtful flame. Explore curated gifts wrapped in foil-stamped keepsake boxes with your personalized sentiment.
          </p>
        </div>

        {/* 6 Occasion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OCCASIONS.map((occ) => {
            const Icon = occ.icon;
            return (
              <div
                key={occ.title}
                onClick={onExploreGifting}
                className={`p-6 rounded-2xl border ${occ.borderColor} ${occ.colorBg} shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-stone-200/60 flex items-center justify-center text-amber-900 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 font-semibold group-hover:text-amber-800 transition-colors">
                    Gift Ready
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-editorial text-xl font-medium text-stone-900 group-hover:text-amber-900 transition-colors">
                    {occ.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {occ.tagline}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-stone-800 group-hover:text-amber-900 transition-colors">
                  <span>Explore Gift Sets</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary CTA Banner */}
        <div className="bg-[#24201E] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold">
              Bespoke Gift Studio
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-light text-[#FAF8F5]">
              Looking for Wedding, Corporate or Bulk Gifting?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Customize wax colors, fragrance notes, hot-stamped gold monograms, and ribbons with our master artisans.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onExploreGifting}
              className="px-6 py-3.5 bg-amber-100 hover:bg-white text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Gift Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCustomHamper}
              className="px-6 py-3.5 bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-stone-700 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Hamper Studio</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
