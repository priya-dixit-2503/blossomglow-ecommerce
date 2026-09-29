import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Flame,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';

interface HeroSectionProps {
  onShopCandles: () => void;
  onExploreCollection: (category?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopCandles,
  onExploreCollection,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize and ensure video plays smoothly
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 1.0;
    video.defaultPlaybackRate = 1.0;
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoPlaying(true);
        })
        .catch(() => {
          setIsVideoPlaying(false);
        });
    }
  }, []);

  // Video play/pause toggle
  const togglePlayVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.playbackRate = 1.0;
      video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-[92vh] bg-[#120F0D] text-[#FAF8F5] overflow-hidden flex items-center select-none">
      {/* ---------------- ARTISAN VIDEO BACKGROUND LAYER ---------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-stone-900">
        <video
          ref={videoRef}
          src="/atelier_candle_video.mp4?v=20260928_natural"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onRateChange={(e) => {
            if (e.currentTarget.playbackRate !== 1.0) {
              e.currentTarget.playbackRate = 1.0;
            }
          }}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
          className="w-full h-full object-cover object-center"
        />
        {/* Living warm candlelight breathing ambiance */}
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none mix-blend-screen" />
      </div>

      {/* ---------------- TOP RIGHT MINIMAL PLAYBACK CONTROLLER ---------------- */}
      <div className="absolute top-6 right-4 sm:right-8 z-30 flex items-center">
        <button
          onClick={togglePlayVideo}
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-stone-200 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
          aria-label={isVideoPlaying ? 'Pause Artisan Video' : 'Play Artisan Video'}
        >
          {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* ---------------- FOREGROUND CONTENT ---------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="max-w-3xl space-y-6 sm:space-y-8 bg-transparent">
          {/* Artisan Atelier Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/10 backdrop-blur-sm border border-stone-950/20 text-stone-950 text-xs uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span className="text-stone-950 font-semibold">Handcrafted Atelier • Living Artisan Creations</span>
          </div>

          {/* Headline & Description */}
          <div className="space-y-4">
            <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-stone-950 tracking-tight leading-[1.06] [text-wrap:balance]">
              Sacred Flames &{' '}
              <span className="italic font-serif text-stone-950">Hand-Sculpted</span>{' '}
              Sanctuary Decor
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-900 font-normal leading-relaxed max-w-2xl">
              Discover artisan scented soy candles, architectural Jesmonite decor trays, and delicate hand-sculpted floral creations — poured with love, clean wicks, and phthalate-free botanical essences in our handcrafted atelier.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={onShopCandles}
              className="px-8 py-4 bg-stone-950 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <span>Shop Real Creations</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onExploreCollection('Diffusers & Home Accents')}
              className="px-8 py-4 bg-white/80 hover:bg-white text-stone-950 border border-stone-300 hover:border-stone-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] rounded-xl shadow-md backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Flame className="w-4 h-4 text-amber-700" />
              <span>Explore Jesmonite & Trays</span>
            </button>
          </div>

          {/* Atelier Pillars / Micro Metrics */}
          <div className="pt-6 border-t border-stone-950/15 grid grid-cols-3 gap-3 sm:gap-6 text-left max-w-lg">
            <div className="space-y-0.5">
              <span className="font-editorial text-lg sm:text-2xl text-stone-950 font-medium">
                100% Soy
              </span>
              <p className="text-[10px] sm:text-xs text-stone-800 font-normal leading-tight">
                Zero toxins, soot-free burn
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="font-editorial text-lg sm:text-2xl text-stone-950 font-medium">
                Handmade
              </span>
              <p className="text-[10px] sm:text-xs text-stone-800 font-normal leading-tight">
                Cast & cured in small batches
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="font-editorial text-lg sm:text-2xl text-stone-950 font-medium">
                Crackling
              </span>
              <p className="text-[10px] sm:text-xs text-stone-800 font-normal leading-tight">
                Natural FSC-certified wood wicks
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
