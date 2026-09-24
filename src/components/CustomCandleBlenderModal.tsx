import React, { useState } from 'react';
import { X, Sparkles, Flame, Check, ShoppingBag, Sliders, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { Product, CartItem, VesselColor, WickType } from '../types';
import { ambientAudio } from '../utils/soundEffects';

interface CustomCandleBlenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomCandleToCart: (cartItem: CartItem) => void;
}

const TOP_NOTES = [
  { id: 'bergamot', name: 'Italian Bergamot', mood: 'Uplifting citrus clarity', color: '#F7E7A9' },
  { id: 'mint', name: 'Crisp Mountain Mint', mood: 'Refreshing herbal chill', color: '#D2F5D7' },
  { id: 'cardamom', name: 'Green Cardamom Pod', mood: 'Subtle Himalayan spice', color: '#E5DFB8' },
  { id: 'mandarin', name: 'Sun-Drenched Mandarin', mood: 'Joyful radiant sweetness', color: '#FED7AA' },
];

const HEART_NOTES = [
  { id: 'damask-rose', name: 'Damask Rose Petals', mood: 'Sensual floral velvet', color: '#FECDD3' },
  { id: 'lavender', name: 'Wild French Lavender', mood: 'Deep nervous calm', color: '#DDD6FE' },
  { id: 'fig', name: 'Ripe Wild Fig Leaf', mood: 'Earthy lush botanical', color: '#BBF7D0' },
  { id: 'jasmine', name: 'Midnight Jasmine Bloom', mood: 'Heady nocturnal allure', color: '#FEF08A' },
];

const BASE_NOTES = [
  { id: 'sandalwood', name: 'Aged Mysore Sandalwood', mood: 'Warm sacred woods', color: '#E2C39B' },
  { id: 'amber', name: 'Golden Baltic Amber', mood: 'Cozy resinous glow', color: '#FCD34D' },
  { id: 'vanilla', name: 'Bourbon Vanilla Bean', mood: 'Comforting creamy depth', color: '#FEF3C7' },
  { id: 'cedar', name: 'Smoky Himalayan Cedar', mood: 'Grounding campfire timber', color: '#D6C0B3' },
];

export const CustomCandleBlenderModal: React.FC<CustomCandleBlenderModalProps> = ({
  isOpen,
  onClose,
  onAddCustomCandleToCart,
}) => {
  if (!isOpen) return null;

  const [topNote, setTopNote] = useState(TOP_NOTES[0]);
  const [heartNote, setHeartNote] = useState(HEART_NOTES[0]);
  const [baseNote, setBaseNote] = useState(BASE_NOTES[0]);
  const [vesselColor, setVesselColor] = useState<VesselColor>('Frosted Amber');
  const [wickType, setWickType] = useState<WickType>('Crackling Wood Wick');
  const [customLabel, setCustomLabel] = useState('Sanctuary Reserve No. 1');
  const [makerName, setMakerName] = useState('Hand-blended for You');
  const [isLit, setIsLit] = useState(true);

  // Vessel style visual properties
  const vesselStyles: Record<VesselColor, { bg: string; text: string; labelBg: string; border: string }> = {
    'Frosted Amber': { bg: 'from-amber-900 via-amber-800 to-amber-950', text: 'text-amber-100', labelBg: 'bg-amber-950/80', border: 'border-amber-700/60' },
    'Matte Blush Cream': { bg: 'from-rose-100 via-stone-100 to-stone-200', text: 'text-stone-900', labelBg: 'bg-white/90', border: 'border-stone-300' },
    'Fluted Ivory': { bg: 'from-stone-50 via-stone-100 to-stone-200', text: 'text-stone-900', labelBg: 'bg-white', border: 'border-stone-300' },
    'Slate Obsidian': { bg: 'from-stone-900 via-stone-950 to-black', text: 'text-stone-100', labelBg: 'bg-stone-900/90', border: 'border-stone-700' },
  };

  // Dynamic harmony rating calculation based on pairings
  const harmonyScore = 92 + ((topNote.name.length + heartNote.name.length + baseNote.name.length) % 7);
  const blendPrice = 1499;

  const handleRandomize = () => {
    ambientAudio.playSoftClick();
    setTopNote(TOP_NOTES[Math.floor(Math.random() * TOP_NOTES.length)]);
    setHeartNote(HEART_NOTES[Math.floor(Math.random() * HEART_NOTES.length)]);
    setBaseNote(BASE_NOTES[Math.floor(Math.random() * BASE_NOTES.length)]);
  };

  const handleAddToCart = () => {
    ambientAudio.playMatchStrike();
    const customProduct: Product = {
      id: `custom-blend-${Date.now()}`,
      name: customLabel || 'Bespoke Atelier Creation',
      tagline: `${topNote.name} · ${heartNote.name} · ${baseNote.name}`,
      category: 'Aromatherapy Jars',
      fragranceFamily: 'Woody & Amber',
      price: blendPrice,
      originalPrice: 1799,
      rating: 5.0,
      reviewsCount: 1,
      image: '/src/assets/images/bloom_rose_candles_1790142304223.jpg',
      galleryImages: ['/src/assets/images/bloom_rose_candles_1790142304223.jpg'],
      burnTimeHours: 65,
      weightGrams: 280,
      scentIntensity: 5,
      scentPyramid: {
        topNotes: [topNote.name],
        heartNotes: [heartNote.name],
        baseNotes: [baseNote.name],
      },
      description: `Bespoke botanical blend hand-poured in ${vesselColor} with ${wickType}. Custom personalized inscription: "${customLabel}". Dedicated: "${makerName}".`,
      artisanStory: 'Formulated in the BlossomGlow Custom Scent Bar and individually hand-poured.',
      availableVessels: [vesselColor],
      availableWicks: [wickType],
      inStock: true,
    };

    const cartItem: CartItem = {
      id: `cart-custom-${Date.now()}`,
      productId: customProduct.id,
      product: customProduct,
      quantity: 1,
      selectedVessel: vesselColor,
      selectedWick: wickType,
      selectedSize: '280g (Double Wick)',
      itemPrice: blendPrice,
    };

    onAddCustomCandleToCart(cartItem);
    onClose();
  };

  const currentVessel = vesselStyles[vesselColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-medium text-stone-900">
                  The Scent Laboratory
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest bg-amber-800 text-amber-100 px-2 py-0.5 rounded-full font-semibold">
                  Interactive Blender
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Formulate your signature botanical perfume notes &amp; personalize your vessel label in real time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 transition-colors"
            aria-label="Close blender"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Interactive Formulator Controls (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-stone-200">
            {/* Action Tools */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-900">
                1. Olfactory Accord Selection
              </span>
              <button
                onClick={handleRandomize}
                className="text-xs text-stone-600 hover:text-amber-900 flex items-center gap-1 font-medium transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Atelier Surprise Blend</span>
              </button>
            </div>

            {/* Note Selector: Top */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-900">Top Note (First 15 mins diffusion)</span>
                <span className="text-stone-500 text-[11px] italic">{topNote.mood}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TOP_NOTES.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      ambientAudio.playSoftClick();
                      setTopNote(note);
                    }}
                    className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                      topNote.id === note.id
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 hover:border-stone-400 bg-white text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{note.name}</span>
                      {topNote.id === note.id && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Selector: Heart */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-900">Heart Note (Core character &amp; body)</span>
                <span className="text-stone-500 text-[11px] italic">{heartNote.mood}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {HEART_NOTES.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      ambientAudio.playSoftClick();
                      setHeartNote(note);
                    }}
                    className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                      heartNote.id === note.id
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 hover:border-stone-400 bg-white text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{note.name}</span>
                      {heartNote.id === note.id && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Selector: Base */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-900">Base Note (Enduring warmth &amp; throw)</span>
                <span className="text-stone-500 text-[11px] italic">{baseNote.mood}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BASE_NOTES.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      ambientAudio.playSoftClick();
                      setBaseNote(note);
                    }}
                    className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                      baseNote.id === note.id
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 hover:border-stone-400 bg-white text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{note.name}</span>
                      {baseNote.id === note.id && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Vessel & Label Personalization */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-900 block">
                2. Vessel Finish &amp; Wick
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1.5">Vessel Finish</label>
                  <select
                    value={vesselColor}
                    onChange={(e) => setVesselColor(e.target.value as VesselColor)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-stone-800 font-sans"
                  >
                    <option value="Frosted Amber">Frosted Amber</option>
                    <option value="Matte Blush Cream">Matte Blush Cream</option>
                    <option value="Fluted Ivory">Fluted Ivory</option>
                    <option value="Slate Obsidian">Slate Obsidian</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1.5">Wick Type</label>
                  <select
                    value={wickType}
                    onChange={(e) => setWickType(e.target.value as WickType)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-stone-800 font-sans"
                  >
                    <option value="Crackling Wood Wick">Crackling Wood Wick (FSC)</option>
                    <option value="Organic Cotton Wick">Organic Cotton Wick (Twin)</option>
                  </select>
                </div>
              </div>

              {/* Custom Laser Inscription Text Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Custom Candle Title (Front Label)
                  </label>
                  <input
                    type="text"
                    maxLength={28}
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="e.g. Maya's Solitude"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Dedication Sub-Title
                  </label>
                  <input
                    type="text"
                    maxLength={32}
                    value={makerName}
                    onChange={(e) => setMakerName(e.target.value)}
                    placeholder="e.g. Winter Solstice 2026"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Live Vessel & Accord Visualizer (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF8F5] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Harmony Score Meter */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-400 block">
                    Olfactory Harmony Index
                  </span>
                  <span className="font-editorial text-2xl font-light text-stone-900">
                    {harmonyScore}% Serene Balance
                  </span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {topNote.name.split(' ')[0]} + {heartNote.name.split(' ')[0]} + {baseNote.name.split(' ')[0]}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border-3 border-amber-600 flex items-center justify-center font-mono text-xs font-bold text-amber-900 bg-amber-50">
                  {harmonyScore}%
                </div>
              </div>

              {/* Dynamic Live Rendered Vessel */}
              <div className="relative py-8 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-stone-100 to-stone-200/60 border border-stone-200 shadow-inner overflow-hidden">
                {/* Flame */}
                <div
                  onClick={() => setIsLit(!isLit)}
                  className="cursor-pointer flex flex-col items-center mb-1 transition-transform hover:scale-110"
                  title="Click to toggle flame"
                >
                  {isLit ? (
                    <div className="relative w-5 h-10 flex items-center justify-center">
                      <div className="w-4 h-10 rounded-full bg-gradient-to-t from-amber-600 via-amber-400 to-amber-100 blur-[1.5px] animate-pulse" />
                      <div className="absolute w-2 h-6 rounded-full bg-yellow-200 -bottom-0.5" />
                    </div>
                  ) : (
                    <div className="w-1 h-4 bg-stone-500 rounded-full opacity-50" />
                  )}
                  {/* Wick */}
                  <div className="w-1.5 h-2.5 bg-amber-950 rounded-xs" />
                </div>

                {/* 3D-styled Candle Vessel Container */}
                <div
                  className={`w-44 h-48 rounded-2xl bg-gradient-to-b ${currentVessel.bg} shadow-2xl border ${currentVessel.border} p-4 flex flex-col items-center justify-between transition-all duration-500 relative overflow-hidden`}
                >
                  {/* Wax Molten Pool Rim */}
                  <div className="w-full h-3 bg-amber-100/40 rounded-full shadow-inner blur-[1px]" />

                  {/* Personalized Label Card */}
                  <div
                    className={`w-36 py-3 px-2 rounded-lg ${currentVessel.labelBg} shadow-md border border-stone-200/50 backdrop-blur-xs text-center space-y-1`}
                  >
                    <span className="text-[8px] uppercase tracking-[0.25em] text-amber-700 font-semibold block">
                      BLOSSOMGLOW ATELIER
                    </span>
                    <h5 className="font-editorial text-xs font-semibold text-stone-900 leading-tight line-clamp-1">
                      {customLabel || 'Custom Blend'}
                    </h5>
                    <p className="text-[8px] text-stone-500 font-sans tracking-wide truncate">
                      {makerName || 'Handcrafted'}
                    </p>
                    <div className="pt-1 border-t border-stone-200/60 flex items-center justify-center gap-1 text-[7px] text-stone-400 uppercase font-mono">
                      <span>{topNote.name.split(' ')[0]}</span>
                      <span>·</span>
                      <span>{heartNote.name.split(' ')[0]}</span>
                      <span>·</span>
                      <span>{baseNote.name.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Vessel Base Specs */}
                  <span className={`text-[8px] uppercase tracking-widest opacity-60 font-mono ${currentVessel.text}`}>
                    280G · 65H CLEAN BURN
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Checkout / Add to Bag */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Custom Formulation Price:</span>
                  <span className="font-mono text-2xl font-semibold text-stone-900 tabular-nums">
                    ₹{blendPrice}
                  </span>
                </div>
                <div className="text-right text-[10px] text-emerald-800 font-medium">
                  <span className="flex items-center gap-1 justify-end">
                    <Check className="w-3 h-3" /> Includes Custom Box &amp; Label
                  </span>
                  <span>Hand-poured in 48 hours</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-[#262220] hover:bg-black text-white py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Add Custom Creation to Bag · ₹{blendPrice}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
