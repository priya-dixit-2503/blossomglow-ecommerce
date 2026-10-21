import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { PRODUCT_ASSETS } from '../assets/products';
import { BRAND_CONFIG } from '../config/brandConfig';

interface AboutBlossomGlowSectionProps {
  onOpenOurStory: () => void;
}

export const AboutBlossomGlowSection: React.FC<AboutBlossomGlowSectionProps> = ({ onOpenOurStory }) => {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#F4EFEA] border-t border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image: Atelier Candle Studio */}
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                <img
                  src={PRODUCT_ASSETS.terrazzoArchVase}
                  alt="BlossomGlow Candle Creations Handcrafted Candle Studio and Sculptural Vessels"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700"
                />
              </div>

              {/* Floating Accent Badge */}
              <div className="relative sm:absolute sm:-bottom-6 sm:right-6 mt-4 sm:mt-0 bg-[#181412] text-white p-4 sm:p-5 rounded-2xl shadow-xl sm:shadow-2xl border border-stone-700 w-full sm:max-w-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono uppercase tracking-wider font-semibold">
                  <span>BlossomGlow Atelier</span>
                </div>
                <p className="text-xs font-light text-stone-200">
                  "We seek to awaken your senses, bringing to your life and home deep joy, serenity, and illumination."
                </p>
                <span className="text-[10px] text-amber-300 font-medium block">
                  — The BlossomGlow Collective
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Story Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-900">
              <Heart className="w-3.5 h-3.5 text-amber-800" />
              <span>The BlossomGlow Philosophy</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight leading-[1.12]">
              Awaken Your Senses. Illuminate Your World.
            </h2>

            <div className="space-y-4 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
              <p>
                At <strong>BlossomGlow Candle Creations</strong>, our journey began with a timeless belief: that a flame is more than just light—it is a sacred transformer of space, mood, and spirit. Inspired by the beauty of botanical flora and modern home aesthetics, we craft creations that awaken your senses.
              </p>
              <p>
                From our bestselling <strong>Coastal Calm &amp; Amber Sandalwood Scented Pillar Candles</strong> that provide up to 25 hours of smokeless radiance, to delicate <strong>Floating Rose &amp; Lotus Petals</strong> designed to shimmer across brass urlis and water bowls, every item is crafted with devotion.
              </p>
              <p>
                We use premium clean-burn waxes, pure therapeutic essential oils, and lead-free organic wicks. No synthetic smoke, no harsh paraffin soot. Only pure, radiant serenity delivered right to your doorstep across India.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onOpenOurStory}
                className="px-8 py-3.5 bg-[#181412] hover:bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition-all shadow-md inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>EXPLORE OUR STORY</span>
                <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
