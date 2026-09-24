import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Flame, ShieldCheck, Truck } from 'lucide-react';
import { PRODUCT_ASSETS } from '../assets/products';

interface HeroSectionProps {
  onShopCandles: () => void;
  onExploreCollection: (category?: string) => void;
}

interface SlideItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  ctaText: string;
  secondaryCtaText: string;
  stats: { label: string; value: string }[];
}

const HERO_SLIDES: SlideItem[] = [
  {
    id: 'pillars',
    badge: 'Signature Collection • 100% Smokeless Burn',
    title: 'Scented Pillar Candles for Everyday Serenity',
    subtitle: 'Awaken your senses with our Coastal Calm & Amber Sandalwood pillar candles. Crafted for clean, smokeless radiance with up to 25 hours of burn time.',
    image: PRODUCT_ASSETS.naturalSpice,
    category: 'Pillar Candles',
    ctaText: 'SHOP PILLAR CANDLES',
    secondaryCtaText: 'VIEW ALL COLLECTIONS',
    stats: [
      { label: 'Burn Time', value: '25+ Hours' },
      { label: 'Formulation', value: 'Clean & Smokeless' },
      { label: 'Fragrance', value: 'Essential Oils' },
    ],
  },
  {
    id: 'floating-urli',
    badge: 'Festive Illumination • Handcrafted Florals',
    title: 'Floating Flower Candles & Hammered Golden Urlis',
    subtitle: 'Elevate your festive decor, pooja thalis, and dining ambiance with hand-sculpted rose & lotus blossoms that gracefully float upon water bowls.',
    image: PRODUCT_ASSETS.lotusGlow,
    category: 'Floating & Urli Sets',
    ctaText: 'SHOP FLOATING & URLI',
    secondaryCtaText: 'EXPLORE GIFT SETS',
    stats: [
      { label: 'Shapes', value: 'Rose & Lotus' },
      { label: 'Aroma', value: 'Bulgarian Rose' },
      { label: 'Craft', value: 'Handmade' },
    ],
  },
  {
    id: 'amber-jars',
    badge: 'Apothecary Soya Wax • Pure Essential Oils',
    title: 'Amber Jar Soya Wax Candles with Botanical Aromas',
    subtitle: 'Awaken your senses, bring deep joy and serenity to your home with non-toxic, slow-burning soy wax poured in protective amber glass vessels.',
    image: PRODUCT_ASSETS.floralGarden,
    category: 'Jar & Container Candles',
    ctaText: 'SHOP AMBER JARS',
    secondaryCtaText: 'SCENT FINDER',
    stats: [
      { label: 'Wax Base', value: '100% Soy Wax' },
      { label: 'Toxins', value: 'Zero Phthalates' },
      { label: 'Wick', value: 'Organic Cotton' },
    ],
  },
  {
    id: 'wooden-bowls',
    badge: 'Statement Centerpieces • Crackling Wicks',
    title: 'Multi-Wick Carved Wooden Dough Bowl Candles',
    subtitle: 'Hand-carved rustic solid wood troughs filled with botanical soy wax, whole cinnamon quills, star anise, and crackling natural wicks.',
    image: PRODUCT_ASSETS.woodenDoughBowl,
    category: 'Botanical Bowls & Shells',
    ctaText: 'SHOP WOOD BOWLS',
    secondaryCtaText: 'CUSTOM HAMPER',
    stats: [
      { label: 'Wicks', value: '3-Wick Crackle' },
      { label: 'Weight', value: '650g Grand' },
      { label: 'Reusability', value: 'Keepsake Bowl' },
    ],
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopCandles,
  onExploreCollection,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      className="relative w-full min-h-[85vh] sm:min-h-[88vh] bg-[#161311] text-[#FAF8F5] overflow-hidden flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides with crossfade transition */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1] scale-105 transition-transform duration-7000 ease-out"
          />
          {/* Editorial Vignette & BlossomGlow Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/40 to-black/80" />
        </div>
      ))}

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="max-w-2xl space-y-6 sm:space-y-8">
          {/* BlossomGlow Mission Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/80 border border-amber-500/40 text-amber-200 text-[11px] sm:text-xs uppercase font-mono tracking-widest backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{slide.badge}</span>
          </div>

          {/* Headline & Description */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#FAF8F5] tracking-tight leading-[1.08] drop-shadow-md">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-stone-200 font-light leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={() => {
                onExploreCollection(slide.category);
              }}
              className="px-8 py-4 bg-[#D4AF37] hover:bg-[#E5C358] text-stone-950 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onShopCandles}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-[#FAF8F5] border border-white/30 hover:border-white/60 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{slide.secondaryCtaText}</span>
            </button>
          </div>

          {/* Micro Value Metrics for current slide */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-3 sm:gap-6 text-left max-w-lg">
            {slide.stats.map((st, i) => (
              <div key={i} className="space-y-0.5">
                <span className="font-editorial text-base sm:text-xl text-amber-300 font-normal">
                  {st.value}
                </span>
                <p className="text-[10px] sm:text-xs text-stone-300 font-light leading-tight">
                  {st.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 sm:right-8 bottom-8 z-20 flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="p-2.5 sm:p-3 rounded-full bg-stone-900/70 hover:bg-stone-900 text-stone-300 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2.5 sm:p-3 rounded-full bg-stone-900/70 hover:bg-stone-900 text-stone-300 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators / Dots */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
