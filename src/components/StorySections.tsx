import React from 'react';
import { ArrowRight, Heart, Sparkles, Feather } from 'lucide-react';
import { PRODUCT_ASSETS } from '../assets/products';

interface StorySectionsProps {
  onExploreProduct: (categoryName: string) => void;
  onOpenStory?: () => void;
}

export const StorySections: React.FC<StorySectionsProps> = ({ onExploreProduct, onOpenStory }) => {
  return (
    <section className="w-full py-16 sm:py-24 bg-[#FAF8F5] space-y-24 sm:space-y-32 overflow-hidden">
      {/* ========================================================
          STORY SECTION 1: From Our Hands to Your Home
          Layout: Text Left, Image Right
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-800">
              <Heart className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
              <span>Artisan Heritage</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight leading-[1.14]">
              From Our Hands to Your Home
            </h2>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Every BlossomGlow Candle Creations candle is created with attention to detail, creativity and love.
            </p>

            <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
              In our atelier studio, our artisans hand-carve wicks, blend slow-release botanical essences, and mold delicate sculptures one by one. We believe candles are not mere objects, but sacred vessels of warmth, joy, and illumination.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onExploreProduct('Sculptural Candles')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-900 hover:text-amber-900 border-b border-stone-900 hover:border-amber-900 pb-1 transition-all group"
              >
                <span>Discover The Craft</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 group">
              <img
                src={PRODUCT_ASSETS.teddyBabyShower}
                alt="From Our Hands to Your Home - Handcrafted BlossomGlow Sculptural Candles"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-200/60 text-xs text-stone-800 shadow-sm flex items-center justify-between">
                <span className="font-editorial text-sm font-medium">100% Hand-Poured Botanical Soy Wax</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded">Small Batch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          STORY SECTION 2: Create a Moment of Calm
          Layout: Image Left, Text Right (Alternating)
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="lg:col-span-6 order-1">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 group">
              <img
                src={PRODUCT_ASSETS.buddhaSerenity}
                alt="Create a Moment of Calm - Buddha Serenity Candle"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#221E1C]/90 backdrop-blur-md border border-stone-700/60 text-xs text-stone-200 shadow-sm flex items-center justify-between">
                <span className="font-editorial text-sm font-light text-amber-100">Sacred Dhyana Meditation Mudra</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-semibold bg-amber-900/40 px-2 py-0.5 rounded border border-amber-600/30">Mindfulness</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 order-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-800">
              <Feather className="w-3.5 h-3.5 text-amber-700" />
              <span>Mindful Rituals</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight leading-[1.14]">
              Create a Moment of Calm
            </h2>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Slow down, light a candle and make space for yourself.
            </p>

            <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
              Our meditative Buddha and sacred lotus candles were molded to turn any hectic evening into a serene sanctuary. As the pure organic flame casts soft reflections, sacred sandalwood, amber, and frankincense waft gently into the air, helping you breathe deeper.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onExploreProduct('Meditation Candles')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-900 hover:text-amber-900 border-b border-stone-900 hover:border-amber-900 pb-1 transition-all group"
              >
                <span>Shop Meditation Candles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          STORY SECTION 3: Made for Beautiful Spaces
          Layout: Text Left, Image Right (Alternating)
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Modern Aesthetics</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight leading-[1.14]">
              Made for Beautiful Spaces
            </h2>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Decorative candles that bring warmth and personality to your home.
            </p>

            <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
              Designed as modern art sculptures even before the flame is sparked. With tactile fluted ribbing, organic conch curves, and architectural concrete trays, BlossomGlow Candle Creations elevate your coffee table, bedside nook, or dining centerpiece into an interior showcase.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onExploreProduct('Home Décor Candles')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-900 hover:text-amber-900 border-b border-stone-900 hover:border-amber-900 pb-1 transition-all group"
              >
                <span>Explore Home Décor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 group">
              <img
                src={PRODUCT_ASSETS.concreteArchClock}
                alt="Made for Beautiful Spaces - Concrete Arch Home Decor"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-200/60 text-xs text-stone-800 shadow-sm flex items-center justify-between">
                <span className="font-editorial text-sm font-medium">Architectural Cast Accent</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-stone-700 font-semibold bg-stone-100 px-2 py-0.5 rounded">Modern Elegance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
