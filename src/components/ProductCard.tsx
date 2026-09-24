import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Flame, Star, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductImageCarousel } from './ProductImageCarousel';
import { ambientAudio } from '../utils/soundEffects';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [isCardPopping, setIsCardPopping] = useState(false);

  // Collect all available gallery images, guaranteeing product.image is included
  const allImages = React.useMemo(() => {
    if (product.galleryImages && product.galleryImages.length > 0) {
      if (!product.galleryImages.includes(product.image)) {
        return [product.image, ...product.galleryImages];
      }
      return product.galleryImages;
    }
    return [product.image];
  }, [product.image, product.galleryImages]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    ambientAudio.playSoftClick();
    onQuickAdd(product);

    // Trigger subtle tactile pop & scale animations
    setIsPopping(true);
    setIsCardPopping(true);
    setJustAdded(true);

    setTimeout(() => setIsPopping(false), 450);
    setTimeout(() => setIsCardPopping(false), 400);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      className={`group relative flex flex-col bg-white border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        isCardPopping
          ? 'animate-gentle-pop ring-2 ring-amber-500/50 border-amber-300 shadow-xl'
          : 'border-stone-200/70'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Slot with Automatic Carousel / Slider (fixed aspect-[4/3]) */}
      <div className="relative aspect-[4/3] w-full bg-[#F5F2EC] overflow-hidden">
        <ProductImageCarousel
          images={allImages}
          alt={product.name}
          intervalMs={3500}
          aspectRatioClass="aspect-[4/3]"
          isParentHovered={isHovered}
          onImageClick={() => onQuickView(product)}
        />

        {/* Subtle Status Tag */}
        {product.isBestSeller && (
          <div className="absolute top-3 left-3 z-15 bg-[#262220]/90 text-amber-200 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded backdrop-blur-xs shadow-xs pointer-events-none">
            Signature Bestseller
          </div>
        )}
        {product.isNewArrival && !product.isBestSeller && (
          <div className="absolute top-3 left-3 z-15 bg-amber-950/85 text-amber-100 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded backdrop-blur-xs shadow-xs pointer-events-none">
            New Atelier Edition
          </div>
        )}

        {/* Wishlist Affordance */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            ambientAudio.playSoftClick();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm scale-110'
              : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Dynamic Scent Throw Dots Floating Tag (hidden on mobile and hidden on hover) */}
        {!isHovered && (
          <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1 bg-stone-900/75 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-amber-300 font-mono opacity-80 pointer-events-none">
            <Flame className="w-2.5 h-2.5 text-amber-400" />
            <span>Throw {product.scentIntensity}/5</span>
          </div>
        )}

        {/* Floating Quick Add Pop Confirmation Pill */}
        {justAdded && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-1.5 px-3 py-1 bg-stone-950/95 text-amber-200 text-[11px] font-mono tracking-wider font-semibold rounded-full shadow-2xl border border-amber-400/40 backdrop-blur-md animate-pop-bounce">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            <span>+1 ADDED TO BAG</span>
          </div>
        )}

        {/* Quick View & Quick Add Action Overlay */}
        <div
          className={`absolute inset-x-3 bottom-3 z-20 flex items-center gap-2 transition-all duration-200 ${
            isHovered || justAdded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 bg-white/95 hover:bg-white text-stone-900 py-2.5 px-3 rounded-lg text-xs font-medium tracking-wider uppercase shadow-md flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            <span>Atelier View</span>
          </button>
          
          <button
            onClick={handleQuickAdd}
            className={`relative py-2.5 px-3.5 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 ${
              isPopping ? 'animate-pop-bounce ring-4 ring-emerald-400/40' : ''
            } ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-105'
                : 'bg-[#262220] hover:bg-black text-white hover:scale-105 active:scale-90'
            }`}
            title="Quick Add to Bag"
            aria-label="Quick Add"
          >
            {justAdded ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-white stroke-[2.5]" />
                <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">Added</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-amber-300 transition-transform group-hover:scale-110" />
                <span className="text-[11px] font-mono tracking-wider uppercase hidden group-hover:inline-block">Add</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Burn Time Metadata */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 tracking-wider uppercase font-medium">
            <span>{product.fragranceFamily}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{product.burnTimeHours}h Burn</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-editorial text-lg font-medium text-stone-900 tracking-normal hover:text-amber-800 transition-colors cursor-pointer mt-1 line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Scent notes summary */}
          <p className="text-stone-500 text-xs line-clamp-1 mt-0.5">
            {product.scentPyramid.topNotes.slice(0, 2).join(', ')} &amp; {product.scentPyramid.heartNotes[0]}
          </p>
        </div>

        {/* Rating & Price Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-amber-700">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-mono font-medium text-stone-800 tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400 text-[11px]">({product.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-1.5">
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-sm sm:text-base font-semibold text-stone-900 font-mono tabular-nums">
                ₹{product.price}
              </span>
            </div>

            {/* Mobile-Friendly Quick Add Icon Button with Pop Animation */}
            <button
              onClick={handleQuickAdd}
              className={`sm:hidden p-2 rounded-lg text-xs flex items-center justify-center transition-all ${
                isPopping ? 'animate-pop-bounce ring-2 ring-emerald-400/40' : ''
              } ${
                justAdded
                  ? 'bg-emerald-600 text-white scale-105'
                  : 'bg-stone-900 text-amber-300 active:scale-90'
              }`}
              title="Quick Add to Bag"
              aria-label="Quick Add"
            >
              {justAdded ? <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
