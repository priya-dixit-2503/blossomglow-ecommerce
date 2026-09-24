import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Film,
  Layers,
  Heart,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
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
    id: 'marbled-duo',
    badge: 'Artisan Atelier • Real Handcrafted Creation',
    title: 'Fluted Candle & Bud Vase with Marbled Mint Vanity Tray',
    subtitle: 'Hand-cast mint marble Jesmonite oval tray paired with an ivory fluted mini vase and matching ribbed soy candle dish for tranquil bedside and vanity spaces.',
    image: PRODUCT_ASSETS.flutedMarbledTrayDuo,
    category: 'Diffusers & Home Accents',
    ctaText: 'SHOP VANITY DUO',
    secondaryCtaText: 'VIEW ALL ACCENTS',
    stats: [
      { label: 'Crafting', value: 'Hand-Marbled' },
      { label: 'Wax Base', value: '100% Soy Wax' },
      { label: 'Tray Material', value: 'Cast Jesmonite' },
    ],
  },
  {
    id: 'teddy-favors',
    badge: 'Handmade Sculptural • Sweet Celebrations',
    title: 'Artisan Lotus Bowl Candles with Sculpted Teddy Bears',
    subtitle: 'Hand-poured white lotus flower bowls crowned with miniature sculpted teddy bears embracing baby-blue wax hearts. Bespoke gifting for cherished moments.',
    image: PRODUCT_ASSETS.teddyBabyShower,
    category: 'Sculptural Candles',
    ctaText: 'SHOP TEDDY FAVORS',
    secondaryCtaText: 'EXPLORE HAMPERS',
    stats: [
      { label: 'Sculpt', value: 'Hand-Carved' },
      { label: 'Petals', value: 'Lotus Flutes' },
      { label: 'Heart Accent', value: 'Pastel Wax' },
    ],
  },
  {
    id: 'carousel-jar',
    badge: 'Keepsake Vessel • Paris Carousel Flutes',
    title: 'Fluted Carousel Keepsake Jar & Scented Candle',
    subtitle: 'Architectural ribbed canister topped with a conical finial lid, holding aromatic slow-burn soy wax before transforming into an enduring pearl jewelry box.',
    image: PRODUCT_ASSETS.flutedCarouselJar,
    category: 'Jar & Container Candles',
    ctaText: 'SHOP CAROUSEL JAR',
    secondaryCtaText: 'SCENT FINDER',
    stats: [
      { label: 'Burn Time', value: '42+ Hours' },
      { label: 'Lid Style', value: 'Finial Dome' },
      { label: 'Reusability', value: 'Keepsake Box' },
    ],
  },
  {
    id: 'hollow-arch',
    badge: 'Minimalist Architecture • Botanical Propagation',
    title: 'Modernist Hollow Arch Test-Tube Bud Vase',
    subtitle: 'Sculptural rounded rectangular arch hand-cast in smooth matte white Jesmonite with a high-clarity laboratory glass tube for baby’s breath and dried florals.',
    image: PRODUCT_ASSETS.hollowArchBudVase,
    category: 'Diffusers & Home Accents',
    ctaText: 'SHOP ARCH VASE',
    secondaryCtaText: 'VIEW ALL ACCENTS',
    stats: [
      { label: 'Finish', value: 'Matte Velvety' },
      { label: 'Insert', value: 'Lab Glass' },
      { label: 'Style', value: 'Modernist' },
    ],
  },
  {
    id: 'pillars',
    badge: 'Signature Collection • 100% Smokeless Burn',
    title: 'Scented Pillar Candles for Everyday Serenity',
    subtitle: 'Awaken your senses with Coastal Calm & Amber Sandalwood pillar candles. Crafted for clean, smokeless radiance with up to 25 hours of burn time.',
    image: PRODUCT_ASSETS.naturalSpice,
    category: 'Pillar Candles',
    ctaText: 'SHOP PILLARS',
    secondaryCtaText: 'EXPLORE COLLECTIONS',
    stats: [
      { label: 'Burn Time', value: '25+ Hours' },
      { label: 'Formulation', value: 'Clean & Smokeless' },
      { label: 'Fragrance', value: 'Essential Oils' },
    ],
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopCandles,
  onExploreCollection,
}) => {
  const [heroMode, setHeroMode] = useState<'video' | 'slides'>('slides');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto advance slides only when in 'slides' mode
  useEffect(() => {
    if (heroMode !== 'slides' || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroMode, isPaused]);

  // Video play/pause toggle
  const togglePlayVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  // Sound mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextState = !isMuted;
    videoRef.current.muted = nextState;
    setIsMuted(nextState);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative w-full min-h-[90vh] lg:min-h-[92vh] bg-[#120F0D] text-[#FAF8F5] overflow-hidden flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ---------------- BACKGROUND LAYER ---------------- */}
      {heroMode === 'video' ? (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#181412]">
          <video
            ref={videoRef}
            src="/priya_candle_video.mp4"
            poster={PRODUCT_ASSETS.floralGarden}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.08] transition-opacity duration-1000"
          />
          {/* Subtle warm cinematic vignette overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-transparent to-black/45 pointer-events-none" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#181412]">
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
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/products/fluted-marbled-tray-duo.jpg';
                }}
                className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05] scale-105 transition-transform duration-7000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#120F0D]/95 via-[#120F0D]/60 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-transparent to-black/40 pointer-events-none" />
            </div>
          ))}
        </div>
      )}

      {/* ---------------- TOP FLOATING MODE SWITCHER ---------------- */}
      <div className="absolute top-6 right-4 sm:right-8 z-30 flex items-center gap-2">
        <div className="inline-flex items-center p-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md shadow-2xl">
          <button
            onClick={() => setHeroMode('video')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              heroMode === 'video'
                ? 'bg-[#D4AF37] text-stone-950 font-semibold shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Artisan Video</span>
          </button>
          <button
            onClick={() => setHeroMode('slides')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              heroMode === 'slides'
                ? 'bg-[#D4AF37] text-stone-950 font-semibold shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Collection Slides</span>
          </button>
        </div>

        {/* Video Audio & Playback Controls if in video mode */}
        {heroMode === 'video' && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-amber-200 border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg"
              title={isMuted ? 'Turn Sound On' : 'Mute Video'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-300" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
            </button>
            <button
              onClick={togglePlayVideo}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-stone-200 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg"
              title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
              aria-label={isVideoPlaying ? 'Pause' : 'Play'}
            >
              {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* ---------------- FOREGROUND CONTENT ---------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Left Copy */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Atelier Heritage Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-950/80 border border-amber-500/40 text-amber-200 text-[11px] sm:text-xs uppercase font-mono tracking-widest backdrop-blur-md shadow-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>
                {heroMode === 'video'
                  ? 'Priya Dixit Candle Atelier • Hand-Poured Real Studio'
                  : slide.badge}
              </span>
            </div>

            {/* Headline & Description */}
            <div className="space-y-4">
              <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#FAF8F5] tracking-tight leading-[1.06] drop-shadow-md [text-wrap:balance]">
                {heroMode === 'video' ? (
                  <>
                    Sacred Flames &{' '}
                    <span className="italic font-serif text-amber-300">Hand-Sculpted</span>{' '}
                    Sanctuary Decor
                  </>
                ) : (
                  slide.title
                )}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-stone-200 font-light leading-relaxed max-w-2xl drop-shadow">
                {heroMode === 'video' ? (
                  'Discover artisan scented soy candles, architectural Jesmonite decor trays, and delicate hand-sculpted floral creations — poured with love, clean wicks, and phthalate-free botanical essences by founder Priya Dixit.'
                ) : (
                  slide.subtitle
                )}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onShopCandles}
                className="px-8 py-4 bg-[#D4AF37] hover:bg-[#E5C358] text-stone-950 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
              >
                <span>Shop Real Creations</span>
                <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  if (heroMode === 'video') {
                    onExploreCollection('Diffusers & Home Accents');
                  } else {
                    onExploreCollection(slide.category);
                  }
                }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-[#FAF8F5] border border-white/30 hover:border-white/60 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>Explore Jesmonite & Trays</span>
              </button>
            </div>

            {/* Atelier Pillars / Micro Metrics */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-3 sm:gap-6 text-left max-w-lg">
              {heroMode === 'video' ? (
                <>
                  <div className="space-y-0.5">
                    <span className="font-editorial text-lg sm:text-2xl text-amber-300 font-normal">
                      100% Soy
                    </span>
                    <p className="text-[10px] sm:text-xs text-stone-300 font-light leading-tight">
                      Zero toxins, soot-free burn
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-editorial text-lg sm:text-2xl text-amber-300 font-normal">
                      Handmade
                    </span>
                    <p className="text-[10px] sm:text-xs text-stone-300 font-light leading-tight">
                      Cast & cured in small batches
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-editorial text-lg sm:text-2xl text-amber-300 font-normal">
                      Crackling
                    </span>
                    <p className="text-[10px] sm:text-xs text-stone-300 font-light leading-tight">
                      Natural FSC-certified wood wicks
                    </p>
                  </div>
                </>
              ) : (
                slide.stats.map((st, i) => (
                  <div key={i} className="space-y-0.5">
                    <span className="font-editorial text-base sm:text-xl text-amber-300 font-normal">
                      {st.value}
                    </span>
                    <p className="text-[10px] sm:text-xs text-stone-300 font-light leading-tight">
                      {st.label}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Floating Real Creations Preview Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-200">
                <span className="font-mono uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Real Atelier Works</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  By Priya Dixit
                </span>
              </div>

              {/* 3 Real Product Snapshots from user's authentic creations */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div
                  onClick={() => onExploreCollection('Diffusers & Home Accents')}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-white/15 cursor-pointer bg-stone-900"
                >
                  <img
                    src={PRODUCT_ASSETS.flutedMarbledTrayDuo}
                    alt="Marbled Mint Tray Duo"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/products/fluted-marbled-tray-duo.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] text-white font-medium truncate">Marbled Tray</span>
                  </div>
                </div>

                <div
                  onClick={() => onExploreCollection('Sculptural Candles')}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-white/15 cursor-pointer bg-stone-900"
                >
                  <img
                    src={PRODUCT_ASSETS.teddyBabyShower}
                    alt="Teddy Lotus Candle"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/products/teddy-baby-shower.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] text-white font-medium truncate">Teddy Lotus</span>
                  </div>
                </div>

                <div
                  onClick={() => onExploreCollection('Jar & Container Candles')}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-white/15 cursor-pointer bg-stone-900"
                >
                  <img
                    src={PRODUCT_ASSETS.flutedCarouselJar}
                    alt="Carousel Keepsake Jar"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/products/fluted-carousel-jar.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] text-white font-medium truncate">Carousel Jar</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-300">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real Photo Catalog</span>
                </span>
                <button
                  onClick={() => onExploreCollection()}
                  className="text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer"
                >
                  Browse all 16 items →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ---------------- SLIDE NAVIGATION (Only visible in Slides Mode) ---------------- */}
      {heroMode === 'slides' && (
        <>
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
        </>
      )}
    </section>
  );
};
