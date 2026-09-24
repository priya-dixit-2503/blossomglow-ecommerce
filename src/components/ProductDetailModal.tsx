import React, { useState } from 'react';
import { X, Star, Flame, ShieldCheck, Heart, ShoppingBag, Check, Info, Sparkles, Sliders, Play, Wind, Compass } from 'lucide-react';
import { Product, VesselColor, WickType, CandleSize } from '../types';
import { ambientAudio } from '../utils/soundEffects';

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
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedVessel, setSelectedVessel] = useState<VesselColor>(product.availableVessels[0] || 'Frosted Amber');
  const [selectedWick, setSelectedWick] = useState<WickType>(product.availableWicks[0] || 'Crackling Wood Wick');
  const [selectedSize, setSelectedSize] = useState<CandleSize>('280g (Double Wick)');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'notes' | 'specs' | 'care'>('notes');
  const [addedToast, setAddedToast] = useState(false);
  const [viewMode, setViewMode] = useState<'photos' | 'burnSimulator'>('photos');
  const [simulatedHour, setSimulatedHour] = useState<number>(15);
  const [isSimFlameLit, setIsSimFlameLit] = useState<boolean>(true);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedVessel(product.availableVessels[0] || 'Fluted Ivory');
      setSelectedWick(product.availableWicks[0] || 'Crackling Wood Wick');
    }
  }, [product?.id]);

  // Price modifier according to size
  let computedPrice = product.price;
  if (selectedSize === '180g (Single Wick)') computedPrice = Math.round(product.price * 0.85);
  if (selectedSize === '420g (3-Wick Grande)') computedPrice = Math.round(product.price * 1.45);

  const handleAdd = () => {
    ambientAudio.playSoftClick();
    onAddToCart(product, selectedVessel, selectedWick, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  // Burn Simulator Calculations
  const maxHours = product.burnTimeHours || 60;
  const burnProgressPercent = Math.min(100, Math.round((simulatedHour / maxHours) * 100));
  const meltPoolRadiusPercent = simulatedHour === 0 ? 0 : Math.min(100, Math.round(40 + (simulatedHour / 4) * 60));
  const diffusionCoverageSqFt = Math.round(180 + (product.scentIntensity / 5) * 320);

  const handleToggleSimFlame = () => {
    if (!isSimFlameLit) {
      ambientAudio.playMatchStrike();
      setIsSimFlameLit(true);
    } else {
      setIsSimFlameLit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-stone-700 hover:text-black hover:bg-stone-100 transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Gallery & Burn Simulator */}
          <div className="p-6 bg-[#F8F6F2] flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200/80">
            <div className="space-y-4">
              {/* View Switcher Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg text-xs">
                <button
                  onClick={() => setViewMode('photos')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
                    viewMode === 'photos'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Atelier Photos
                </button>
                <button
                  onClick={() => setViewMode('burnSimulator')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${
                    viewMode === 'burnSimulator'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Burn &amp; Throw Sim</span>
                </button>
              </div>

              {viewMode === 'photos' ? (
                <>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-sm border border-stone-200/60">
                    <img
                      src={selectedImage}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-all duration-300"
                    />
                  </div>

                  {/* Gallery Thumbnails */}
                  {product.galleryImages.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {product.galleryImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                            selectedImage === img ? 'border-amber-700 shadow-sm scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Dynamic Interactive Burn & Diffusion Simulator Screen */
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950 border border-stone-800 p-4 flex flex-col items-center justify-between text-white">
                    {/* Simulated Room Diffusion Rings */}
                    {isSimFlameLit && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        <div className="w-36 h-36 rounded-full border border-amber-500/20 animate-ping opacity-30" />
                        <div className="absolute w-56 h-56 rounded-full border border-amber-500/10 animate-pulse opacity-40" />
                      </div>
                    )}

                    {/* Top status bar inside simulator */}
                    <div className="w-full flex items-center justify-between text-[11px] font-mono text-stone-300 z-10">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        {isSimFlameLit ? 'Combustion Active' : 'Flame Extinguished'}
                      </span>
                      <span className="text-stone-400">Coverage: ~{diffusionCoverageSqFt} sq ft</span>
                    </div>

                    {/* Interactive Virtual Candle Cutaway */}
                    <div className="relative flex flex-col items-center my-auto z-10">
                      {/* Flame */}
                      <button
                        onClick={handleToggleSimFlame}
                        className="group cursor-pointer flex flex-col items-center"
                        title="Click to toggle flame"
                      >
                        {isSimFlameLit ? (
                          <div className="relative w-5 h-11 flex items-center justify-center animate-pulse">
                            <div className="w-4 h-10 rounded-full bg-gradient-to-t from-amber-600 via-amber-400 to-amber-100 blur-[1px]" />
                            <div className="absolute w-2 h-6 rounded-full bg-white -bottom-0.5" />
                          </div>
                        ) : (
                          <div className="w-1 h-5 bg-stone-600 rounded-full mb-1 opacity-50" />
                        )}
                        <div className="w-1.5 h-3 bg-amber-950 rounded-xs" />
                      </button>

                      {/* Vessel top-down perspective rim & molten pool */}
                      <div className="w-36 h-20 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border-2 border-stone-700 shadow-2xl p-2 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Molten wax pool animation */}
                        <div
                          className="h-10 rounded-xl transition-all duration-300 shadow-inner flex items-center justify-center"
                          style={{
                            width: `${meltPoolRadiusPercent}%`,
                            background: isSimFlameLit
                              ? 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.85) 0%, rgba(217, 119, 6, 0.6) 70%, rgba(180, 83, 9, 0.4) 100%)'
                              : 'rgba(214, 211, 209, 0.25)',
                          }}
                        >
                          <span className="text-[8px] font-mono uppercase tracking-widest text-stone-900/80 font-bold">
                            {simulatedHour < 3 ? 'Melt Pool Forming' : 'Full Rim Pool'}
                          </span>
                        </div>
                        <div className="text-[8px] font-mono text-stone-400 uppercase mt-1">
                          Wax Remaining: {100 - burnProgressPercent}%
                        </div>
                      </div>
                    </div>

                    {/* Timeline Stage Description */}
                    <div className="w-full text-center text-[10px] text-stone-300 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700/60 z-10">
                      {simulatedHour === 0 && 'Hour 0: Unlit pure organic soy wax surface with centered wooden wick.'}
                      {simulatedHour > 0 && simulatedHour <= 3 && 'Hours 1–3: First burn ritual. Molten pool spreads fully to prevent tunneling.'}
                      {simulatedHour > 3 && simulatedHour <= 40 && `Hour ${simulatedHour}: Peak fragrance throw. Heart & base botanical notes diffusing.`}
                      {simulatedHour > 40 && simulatedHour < maxHours && `Hour ${simulatedHour}: Clean, even burn down to vessel base without smoke.`}
                      {simulatedHour >= maxHours && `Hour ${maxHours}: Fully enjoyed! Vessel easily cleans with warm soapy water for repurposing.`}
                    </div>
                  </div>

                  {/* Scrubbable Hour Slider */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-amber-700" /> Burn Progression:
                      </span>
                      <span className="font-mono font-bold text-amber-900">
                        {simulatedHour} / {maxHours} Hours
                      </span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={maxHours}
                      step={1}
                      value={simulatedHour}
                      onChange={(e) => setSimulatedHour(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-700"
                    />

                    <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                      <span>0h (Fresh Jar)</span>
                      <span>3h (First Pool)</span>
                      <span>{Math.round(maxHours / 2)}h (Midpoint)</span>
                      <span>{maxHours}h (Repurpose)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Scent Throw Gauge */}
            <div className="pt-6 border-t border-stone-200/80 mt-6">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
                <span className="uppercase tracking-widest text-[10px] font-semibold text-stone-500">
                  Fragrance Throw Intensity
                </span>
                <span className="font-mono font-medium">{product.scentIntensity} of 5</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      level <= product.scentIntensity ? 'bg-amber-600' : 'bg-stone-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Subtle Sanctuary</span>
                <span>Room-Filling Radiance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Family & Release kicker */}
              <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-widest font-medium">
                <span>{product.category}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-amber-800">{product.fragranceFamily}</span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-stone-900 leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 italic font-light">
                  {product.tagline}
                </p>
              </div>

              {/* Rating & Stock row */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-1.5 text-xs text-amber-700">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="font-mono font-semibold text-stone-900 tabular-nums">{product.rating.toFixed(1)}</span>
                  <span className="text-stone-500">({product.reviewsCount} verified reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock, Hand-Poured</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-stone-950 tabular-nums">
                  ₹{computedPrice}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-sm text-stone-400 line-through tabular-nums">
                    ₹{Math.round(product.originalPrice * (computedPrice / product.price))}
                  </span>
                )}
                <span className="text-[11px] text-stone-500">Includes all taxes</span>
              </div>

              {/* Vessel Finish Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Vessel Ceramic &amp; Glass Finish: <span className="font-normal text-stone-500">{selectedVessel}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableVessels.map((vessel) => (
                    <button
                      key={vessel}
                      onClick={() => setSelectedVessel(vessel)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                        selectedVessel === vessel
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {vessel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wick Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Wick Style: <span className="font-normal text-stone-500">{selectedWick}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.availableWicks.map((wick) => (
                    <button
                      key={wick}
                      onClick={() => setSelectedWick(wick)}
                      className={`p-2.5 text-left rounded-lg border transition-all ${
                        selectedWick === wick
                          ? 'border-amber-700 bg-amber-50/60 text-stone-900'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span>{wick}</span>
                        {selectedWick === wick && <Check className="w-3.5 h-3.5 text-amber-700" />}
                      </div>
                      <span className="text-[10px] text-stone-500 block mt-0.5">
                        {wick === 'Crackling Wood Wick' ? 'Nostalgic fireplace crackle' : 'Even, quiet flame burn'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Vessel Size &amp; Net Weight:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['180g (Single Wick)', '280g (Double Wick)', '420g (3-Wick Grande)'] as CandleSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                        selectedSize === size
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 text-stone-700 hover:border-stone-300 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-mono font-semibold tabular-nums min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 bg-[#262220] hover:bg-black text-white py-3 px-6 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Add to Bag · ₹{computedPrice * quantity}</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3 rounded-lg border transition-colors ${
                    isWishlisted ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-stone-300 text-stone-600 hover:border-stone-400'
                  }`}
                  title="Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {addedToast && (
                <div className="text-center py-1.5 px-3 bg-emerald-50 text-emerald-800 text-xs rounded-md border border-emerald-200 animate-in fade-in flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Added to your BlossomGlow bag!
                </div>
              )}

              {/* Accordion Tabs */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex border-b border-stone-200 text-xs">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`pb-2 px-3 font-semibold uppercase tracking-wider transition-colors ${
                      activeTab === 'notes' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Scent Pyramid
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 px-3 font-semibold uppercase tracking-wider transition-colors ${
                      activeTab === 'specs' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Atelier Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 px-3 font-semibold uppercase tracking-wider transition-colors ${
                      activeTab === 'care' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Clean Burn Care
                  </button>
                </div>

                <div className="py-3 text-xs text-stone-600 leading-relaxed">
                  {activeTab === 'notes' && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-stone-900 uppercase text-[10px] w-14 shrink-0">Top:</span>
                        <span>{product.scentPyramid.topNotes.join(' · ')}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-stone-900 uppercase text-[10px] w-14 shrink-0">Heart:</span>
                        <span>{product.scentPyramid.heartNotes.join(' · ')}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-stone-900 uppercase text-[10px] w-14 shrink-0">Base:</span>
                        <span>{product.scentPyramid.baseNotes.join(' · ')}</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Burn Duration</span>
                        <span className="font-mono text-stone-900 font-medium">{product.burnTimeHours} Hours</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Wax Composition</span>
                        <span className="text-stone-900 font-medium">100% Organic Soy Wax</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Net Wax Weight</span>
                        <span className="font-mono text-stone-900 font-medium">{product.weightGrams}g</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Handcrafted In</span>
                        <span className="text-stone-900 font-medium">Himalayan Foothills, India</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'care' && (
                    <p className="text-stone-600">
                      On first burn, allow wax pool to melt completely to the edge (approx. 2–3 hours). Always trim wick to 1/4 inch before relighting to ensure an even, soot-free flame.
                    </p>
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
