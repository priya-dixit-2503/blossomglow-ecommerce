import React from 'react';
import { Instagram, ExternalLink, Heart } from 'lucide-react';
import { PRODUCT_ASSETS } from '../assets/products';

export const InstagramSection: React.FC = () => {
  const posts = [
    {
      id: 1,
      image: PRODUCT_ASSETS.floralGarden,
      caption: 'Fresh morning bloom batch freshly demolded in our studio 🌸 #BlossomGlow',
      likes: '482',
    },
    {
      id: 2,
      image: PRODUCT_ASSETS.naturalSpice,
      caption: 'Coastal calm pillar candles burning smokeless and clean ✨ #BlossomGlowLiving',
      likes: '621',
    },
    {
      id: 3,
      image: PRODUCT_ASSETS.babyElephant,
      caption: 'Handcrafted ornamental sculpted candle with delicate botanical details 🐘 #BlossomGlow',
      likes: '519',
    },
    {
      id: 4,
      image: PRODUCT_ASSETS.lotusGlow,
      caption: 'Floating lotus flower candles shimmering in golden hammered urlis 🪔 #BlossomGlowFestive',
      likes: '743',
    },
    {
      id: 5,
      image: PRODUCT_ASSETS.minimalRibbed,
      caption: 'Ribbed minimalist pillar candle illuminated in a peaceful corner 🐚 #AestheticLiving',
      likes: '890',
    },
    {
      id: 6,
      image: PRODUCT_ASSETS.terrazzoArchVase,
      caption: 'Architectural terrazzo arch vase complementing our botanical candle collection 🌿 #BlossomGlowHome',
      likes: '654',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#FAF8F5] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-900">
            <Instagram className="w-3.5 h-3.5" />
            <span>@blossomglow.candles</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 leading-tight">
            Follow the Glow
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            See what is glowing at BlossomGlow Candle Creations. Behind-the-scenes pours, festive table styling, and customer living rooms.
          </p>
        </div>

        {/* 6 Grid of Square Images */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src={post.image}
                alt="BlossomGlow Instagram Post"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center text-white space-y-2">
                <Instagram className="w-5 h-5 text-amber-300" />
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span>{post.likes}</span>
                </div>
                <p className="text-[10px] text-stone-200 line-clamp-2 font-light">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Action Link */}
        <div className="text-center pt-2">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 hover:border-stone-900 bg-white text-xs font-semibold uppercase tracking-wider text-stone-900 hover:bg-stone-900 hover:text-white transition-all shadow-xs"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow Us on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>
    </section>
  );
};
