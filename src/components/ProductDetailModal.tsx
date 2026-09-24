import React, { useState, useEffect } from 'react';
import { X, Star, Flame, ShieldCheck, Heart, ShoppingBag, Check, Info, Sparkles, Sliders, Play, Wind, Compass, MessageSquare, Send } from 'lucide-react';
import { Product, VesselColor, WickType, CandleSize, Review } from '../types';
import { ambientAudio } from '../utils/soundEffects';
import { CandleApiService } from '../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    vessel: VesselColor,
    wick: WickType,
    size: CandleSize,
    quantity: number
  ) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  // Always declare all hooks unconditionally at top level
  const [selectedImage, setSelectedImage] = useState<string>(product?.image || '');
  const [selectedVessel, setSelectedVessel] = useState<VesselColor>(product?.availableVessels[0] || 'Frosted Amber');
  const [selectedWick, setSelectedWick] = useState<WickType>(product?.availableWicks[0] || 'Crackling Wood Wick');
  const [selectedSize, setSelectedSize] = useState<CandleSize>('280g (Double Wick)');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'notes' | 'specs' | 'care' | 'reviews'>('notes');
  const [addedToast, setAddedToast] = useState(false);
  const [viewMode, setViewMode] = useState<'photos' | 'burnSimulator'>('photos');
  const [simulatedHour, setSimulatedHour] = useState<number>(15);
  const [isSimFlameLit, setIsSimFlameLit] = useState<boolean>(true);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessToast, setReviewSuccessToast] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedVessel(product.availableVessels[0] || 'Fluted Ivory');
      setSelectedWick(product.availableWicks[0] || 'Crackling Wood Wick');
      CandleApiService.getReviewsForProduct(product.id).then((revs) => {
        setReviews(revs);
      });
    }
  }, [product?.id]);

  if (!product) return null;

  // Price modifier according to size
  let computedPrice = product.price;
  if (selectedSize === '180g (Single Wick)') computedPrice = Math.round(product.price * 0.85);
  if (selectedSize === '420g (3-Wick Grande)') computedPrice = Math.round(product.price * 1.45);

  const isOutOfStock = product.inStock === false || product.stockQuantity === 0;
  const isLowStock = product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAdd = () => {
    if (isOutOfStock) return;
    ambientAudio.playSoftClick();
    onAddToCart(product, selectedVessel, selectedWick, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleToggleSimFlame = () => {
    if (!isSimFlameLit) {
      ambientAudio.playMatchStrike();
      setIsSimFlameLit(true);
    } else {
      setIsSimFlameLit(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const added = await CandleApiService.addReview({
        productId: product.id,
        author: newReviewAuthor.trim(),
        rating: newReviewRating,
        title: newReviewTitle.trim() || 'Exquisite Candle Craft',
        comment: newReviewComment.trim(),
        candleName: product.name,
      });
      setReviews([added, ...reviews]);
      setNewReviewAuthor('');
      setNewReviewTitle('');
      setNewReviewComment('');
      setReviewSuccessToast(true);
      setTimeout(() => setReviewSuccessToast(false), 3000);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const allImages = [product.image, ...(product.galleryImages || []).filter((img) => img !== product.image)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200 dark:border-stone-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-stone-100 transition-colors shadow-sm cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Gallery & Burn Simulator */}
          <div className="p-6 bg-[#F8F6F2] dark:bg-stone-800/60 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200/80 dark:border-stone-800">
            <div className="space-y-4">
              {/* View Switcher Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 dark:bg-stone-700/60 rounded-xl text-xs">
                <button
                  onClick={() => setViewMode('photos')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer ${
                    viewMode === 'photos'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  Atelier Photos
                </button>
                <button
                  onClick={() => setViewMode('burnSimulator')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    viewMode === 'burnSimulator'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Burn Simulator</span>
                </button>
              </div>

              {/* Main Visual */}
              {viewMode === 'photos' ? (
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 relative">
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {isOutOfStock ? (
                      <span className="absolute top-3 left-3 bg-stone-900/90 text-stone-300 text-xs px-2.5 py-1 rounded-full">
                        Sold Out
                      </span>
                    ) : isLowStock ? (
                      <span className="absolute top-3 left-3 bg-rose-900/90 text-rose-100 text-xs px-2.5 py-1 rounded-full font-medium">
                        Only {product.stockQuantity} Left in Stock
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 bg-emerald-950/80 text-emerald-300 text-[11px] px-2.5 py-1 rounded-full font-medium">
                        In Stock ({product.stockQuantity || 35} ready)
                      </span>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                          selectedImage === img
                            ? 'border-amber-800 ring-2 ring-amber-700/20 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Burn Simulator View */
                <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-mono">Simulated Burn Progression</span>
                    <button
                      onClick={handleToggleSimFlame}
                      className="px-2 py-1 rounded bg-amber-600/30 text-amber-300 hover:bg-amber-600/50 cursor-pointer text-[11px]"
                    >
                      {isSimFlameLit ? 'Extinguish Flame' : 'Light Flame'}
                    </button>
                  </div>

                  <div className="relative aspect-video rounded-xl bg-stone-950 flex items-center justify-center overflow-hidden border border-amber-500/20">
                    <div className="text-center">
                      <Flame
                        className={`w-12 h-12 mx-auto transition-all ${
                          isSimFlameLit ? 'text-amber-400 animate-pulse scale-110 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'text-stone-600'
                        }`}
                      />
                      <p className="text-xs font-mono text-stone-400 mt-2">
                        {isSimFlameLit ? `Burning at Hour ${simulatedHour} of ${product.burnTimeHours}h` : 'Candle is Unlit'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                      <span>Hour 0</span>
                      <span>Hour {simulatedHour}</span>
                      <span>Hour {product.burnTimeHours}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={product.burnTimeHours}
                      value={simulatedHour}
                      onChange={(e) => setSimulatedHour(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700/60 text-xs text-stone-500 flex items-center justify-between">
              <span>Free Artisan Packaging Included</span>
              <span className="font-mono">100% Biodegradable Soy</span>
            </div>
          </div>

          {/* Right Column: Configuration & Details */}
          <div className="p-6 flex flex-col justify-between space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-amber-800 dark:text-amber-400">
                  {product.category}
                </span>
                <h1 className="text-2xl font-serif text-stone-900 dark:text-stone-100 mt-0.5">
                  {product.name}
                </h1>
                <p className="text-xs text-stone-500 mt-1">{product.tagline}</p>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                    ₹{computedPrice}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 line-through font-mono">
                      ₹{Math.round(product.originalPrice * (computedPrice / product.price))}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {product.rating.toFixed(1)}
                  </span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 underline cursor-pointer"
                  >
                    ({reviews.length || product.reviewsCount} reviews)
                  </button>
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Vessel Size &amp; Pour:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['180g (Single Wick)', '280g (Double Wick)', '420g (3-Wick Grande)'] as CandleSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-semibold ring-1 ring-amber-800'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <p className="font-medium text-[11px]">{size.split(' ')[0]}</p>
                      <p className="text-[10px] text-stone-500">{size.split(' ')[1]}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wick Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Wick Type:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(product.availableWicks || ['Crackling Wood Wick', 'Organic Cotton Wick']).map((wick) => (
                    <button
                      key={wick}
                      onClick={() => setSelectedWick(wick)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedWick === wick
                          ? 'border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-semibold ring-1 ring-amber-800'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <p className="font-medium text-xs">{wick}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-mono font-semibold tabular-nums min-w-8 text-center text-stone-900 dark:text-stone-100">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className="flex-1 bg-amber-900 hover:bg-amber-950 text-white py-3 px-5 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>
                      {isOutOfStock ? 'Sold Out' : `Add to Bag · ₹${(computedPrice * quantity).toLocaleString('en-IN')}`}
                    </span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-stone-300 dark:border-stone-700 text-stone-600 hover:border-stone-400'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {addedToast && (
                  <div className="text-center py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 animate-in fade-in flex items-center justify-center gap-1.5 font-medium">
                    <Check className="w-4 h-4" /> Added to your BlossomGlow bag!
                  </div>
                )}
              </div>

              {/* Accordion Tabs */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="flex border-b border-stone-200 dark:border-stone-800 text-xs overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`pb-2 px-3 font-semibold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === 'notes'
                        ? 'text-amber-900 dark:text-amber-400 border-b-2 border-amber-900 dark:border-amber-400'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Scent Pyramid
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 px-3 font-semibold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === 'specs'
                        ? 'text-amber-900 dark:text-amber-400 border-b-2 border-amber-900 dark:border-amber-400'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Atelier Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 px-3 font-semibold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === 'care'
                        ? 'text-amber-900 dark:text-amber-400 border-b-2 border-amber-900 dark:border-amber-400'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Burn Care
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 px-3 font-semibold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === 'reviews'
                        ? 'text-amber-900 dark:text-amber-400 border-b-2 border-amber-900 dark:border-amber-400'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Reviews ({reviews.length})
                  </button>
                </div>

                <div className="py-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {activeTab === 'notes' && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 uppercase text-[10px] w-14 shrink-0">
                          Top:
                        </span>
                        <span>{product.scentPyramid?.topNotes?.join(' · ') || 'Citrus, Bergamot'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 uppercase text-[10px] w-14 shrink-0">
                          Heart:
                        </span>
                        <span>{product.scentPyramid?.heartNotes?.join(' · ') || 'Rose Petals, Spices'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 uppercase text-[10px] w-14 shrink-0">
                          Base:
                        </span>
                        <span>{product.scentPyramid?.baseNotes?.join(' · ') || 'Sandalwood, Vanilla Amber'}</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Burn Duration</span>
                        <span className="font-mono text-stone-900 dark:text-stone-100 font-medium">
                          {product.burnTimeHours} Hours
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Wax Composition</span>
                        <span className="text-stone-900 dark:text-stone-100 font-medium">
                          {product.waxType || '100% Organic Soy Wax'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Net Wax Weight</span>
                        <span className="font-mono text-stone-900 dark:text-stone-100 font-medium">
                          {product.weightGrams}g
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Artisan Origin</span>
                        <span className="text-stone-900 dark:text-stone-100 font-medium">
                          Priya Dixit Atelier, India
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'care' && (
                    <p className="text-stone-600 dark:text-stone-300">
                      On first burn, allow wax pool to melt completely to the edge (approx. 2–3 hours). Always trim wick to 1/4 inch before relighting to ensure an even, soot-free flame and preserve the jar.
                    </p>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {reviewSuccessToast && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5" /> Thank you! Your review has been published.
                        </div>
                      )}

                      {/* Add Review Form */}
                      <form onSubmit={handleReviewSubmit} className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                        <p className="font-serif text-xs font-semibold text-stone-900 dark:text-stone-100">
                          Leave a Verified Review
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-500">Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReviewRating(star)}
                                className="p-0.5 cursor-pointer"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    star <= newReviewRating
                                      ? 'fill-amber-500 text-amber-500'
                                      : 'text-stone-300 dark:text-stone-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Your Name *"
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Review Headline"
                            value={newReviewTitle}
                            onChange={(e) => setNewReviewTitle(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none"
                          />
                        </div>

                        <textarea
                          required
                          rows={2}
                          placeholder="Share your experience with the fragrance throw and aesthetic..."
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none"
                        />

                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="w-full py-1.5 bg-stone-900 hover:bg-black text-white text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit Verified Review</span>
                        </button>
                      </form>

                      {/* Reviews List */}
                      <div className="space-y-2.5 max-h-44 overflow-y-auto">
                        {reviews.length === 0 ? (
                          <p className="text-center text-stone-400 py-3 text-xs">
                            No reviews yet for this creation. Be the first to share your thoughts!
                          </p>
                        ) : (
                          reviews.map((rev) => (
                            <div
                              key={rev.id}
                              className="p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/30 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-stone-800 dark:text-stone-200">
                                  {rev.author}
                                </span>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < rev.rating
                                          ? 'fill-amber-500 text-amber-500'
                                          : 'text-stone-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {rev.title && (
                                <p className="font-medium text-stone-900 dark:text-stone-100 text-[11px] mt-0.5">
                                  {rev.title}
                                </p>
                              )}
                              <p className="text-stone-600 dark:text-stone-300 text-[11px] mt-1">
                                {rev.comment}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
