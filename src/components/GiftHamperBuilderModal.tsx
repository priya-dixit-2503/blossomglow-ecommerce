import React, { useState } from 'react';
import { X, Gift, Check, Sparkles, ShoppingBag, Plus } from 'lucide-react';
import { Product, CartItem } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface GiftHamperBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHamperToCart: (hamperItem: CartItem) => void;
}

export const GiftHamperBuilderModal: React.FC<GiftHamperBuilderModalProps> = ({
  isOpen,
  onClose,
  onAddHamperToCart,
}) => {
  if (!isOpen) return null;

  const candleOptions = MOCK_PRODUCTS.filter(p => p.category !== 'Artisanal Decor' && p.category !== 'Diffusers & Home Accents');

  const [selectedCandleIds, setSelectedCandleIds] = useState<string[]>([
    candleOptions[0]?.id || 'bg-evil-eye-box',
    candleOptions[1]?.id || 'bg-bloom-rose-jar',
  ]);
  const [boxStyle, setBoxStyle] = useState<'Matte Ivory & Gold' | 'Heritage Emerald' | 'Midnight Obsidian'>('Matte Ivory & Gold');
  const [ribbon, setRibbon] = useState<'Champagne Gold' | 'Deep Amber' | 'Forest Velvet'>('Champagne Gold');
  const [giftNote, setGiftNote] = useState('Wishing you warmth, light, and serene moments.');
  const [recipient, setRecipient] = useState('For Someone Cherished');
  const [includeSnuffer, setIncludeSnuffer] = useState(true);

  const toggleCandle = (id: string) => {
    if (selectedCandleIds.includes(id)) {
      if (selectedCandleIds.length > 1) {
        setSelectedCandleIds(selectedCandleIds.filter(c => c !== id));
      }
    } else {
      if (selectedCandleIds.length < 3) {
        setSelectedCandleIds([...selectedCandleIds, id]);
      }
    }
  };

  // Pricing math
  const selectedProducts = candleOptions.filter(p => selectedCandleIds.includes(p.id));
  const rawSum = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const packagingAndSnufferFee = includeSnuffer ? 599 : 299;
  const originalHamperTotal = rawSum + packagingAndSnufferFee;
  // 15% Hamper Bundle Discount
  const hamperDiscount = Math.round(originalHamperTotal * 0.15);
  const finalHamperPrice = originalHamperTotal - hamperDiscount;

  const handleCreateHamper = () => {
    const customHamperProduct: Product = {
      id: `custom-hamper-${Date.now()}`,
      name: `Custom Curated Atelier Hamper (${selectedCandleIds.length} Candles)`,
      tagline: `Curated with ${selectedProducts.map(p => p.name.split(' ')[0]).join(', ')}`,
      category: 'Gift Hampers',
      fragranceFamily: 'Floral',
      price: finalHamperPrice,
      originalPrice: originalHamperTotal,
      rating: 5.0,
      reviewsCount: 1,
      image: '/src/assets/images/gilded_lotus_hamper_1790142539828.jpg',
      galleryImages: [
        '/src/assets/images/gilded_lotus_hamper_1790142539828.jpg',
        '/src/assets/images/evil_eye_gift_box_1790142259757.jpg'
      ],
      burnTimeHours: selectedCandleIds.length * 55,
      weightGrams: selectedCandleIds.length * 240 + 350,
      scentIntensity: 5,
      scentPyramid: {
        topNotes: ['Custom Curated Trio'],
        heartNotes: ['Handcrafted Botanical Soy'],
        baseNotes: ['Bespoke Gift Packaging']
      },
      description: `Bespoke gift box in ${boxStyle} with ${ribbon} ribbon. Enclosed message: "${giftNote}". Included candles: ${selectedProducts.map(p => p.name).join(', ')}.`,
      artisanStory: 'Assembled and gift-wrapped by master artisans at BlossomGlow Atelier.',
      availableVessels: ['Fluted Ivory'],
      availableWicks: ['Crackling Wood Wick'],
      inStock: true
    };

    const cartItem: CartItem = {
      id: `hamper-cart-${Date.now()}`,
      productId: customHamperProduct.id,
      product: customHamperProduct,
      quantity: 1,
      selectedVessel: 'Fluted Ivory',
      selectedWick: 'Crackling Wood Wick',
      selectedSize: '280g (Double Wick)',
      itemPrice: finalHamperPrice
    };

    onAddHamperToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-800" />
            <span className="font-editorial text-xl font-medium text-stone-900">
              The Artisan Gift Studio · Build A Custom Hamper
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-800 transition-colors"
            aria-label="Close gift builder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Select 2-3 Candles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-800 block">
                1. Select 2 or 3 Fragrance Jars:
              </label>
              <span className="text-xs font-mono text-amber-800 font-semibold">
                {selectedCandleIds.length} of 3 selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {candleOptions.map((candle) => {
                const isSelected = selectedCandleIds.includes(candle.id);
                return (
                  <button
                    key={candle.id}
                    onClick={() => toggleCandle(candle.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/50 shadow-xs ring-1 ring-amber-600'
                        : 'border-stone-200 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-stone-100">
                      <img src={candle.image} alt={candle.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-stone-900 block line-clamp-1">
                        {candle.name}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">₹{candle.price}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className={isSelected ? 'text-amber-800 font-semibold' : 'text-stone-400'}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Box Style & Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-800 block mb-2">
                2. Luxury Gift Box Finish:
              </label>
              <div className="space-y-2">
                {[
                  { id: 'Matte Ivory & Gold', desc: 'Textured linen paper with gold hot-stamping' },
                  { id: 'Heritage Emerald', desc: 'Deep botanical green with copper foil' },
                  { id: 'Midnight Obsidian', desc: 'Rich charcoal with brushed champagne foil' },
                ].map(box => (
                  <label
                    key={box.id}
                    onClick={() => setBoxStyle(box.id as any)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      boxStyle === box.id ? 'border-stone-900 bg-stone-50 font-medium' : 'border-stone-200 hover:bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <span className="text-stone-900 block">{box.id}</span>
                      <span className="text-[10px] text-stone-500 font-normal">{box.desc}</span>
                    </div>
                    {boxStyle === box.id && <Check className="w-4 h-4 text-stone-900 shrink-0" />}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-800 block mb-2">
                3. Satin Ribbon &amp; Snuffer:
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(['Champagne Gold', 'Deep Amber', 'Forest Velvet'] as const).map(rib => (
                    <button
                      key={rib}
                      onClick={() => setRibbon(rib)}
                      className={`flex-1 py-2 px-2 text-center text-xs rounded-lg border transition-all ${
                        ribbon === rib ? 'border-stone-900 bg-stone-900 text-white font-medium' : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {rib}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-3 p-2.5 rounded-lg border border-amber-200 bg-amber-50/40 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSnuffer}
                    onChange={(e) => setIncludeSnuffer(e.target.checked)}
                    className="rounded text-amber-700 focus:ring-amber-600"
                  />
                  <div>
                    <span className="font-semibold text-stone-900 block">Include Solid Brass Wick Snuffer</span>
                    <span className="text-[10px] text-stone-600">Extinguishes clean without wax splatter (Worth ₹499)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Step 3: Handwritten Gift Card */}
          <div className="pt-4 border-t border-stone-200">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-800 block mb-1">
              4. Personalized Handwritten Calligraphy Card:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Recipient Name"
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
              />
              <input
                type="text"
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Personal message"
                className="sm:col-span-2 w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
              />
            </div>
          </div>

          {/* Summary & Add To Bag */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-editorial text-2xl font-semibold text-stone-900 tabular-nums">
                  ₹{finalHamperPrice}
                </span>
                <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  ₹{originalHamperTotal}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Save 15% on Hamper Bundle
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Includes {selectedCandleIds.length} candles + {boxStyle} box + {includeSnuffer ? 'brass snuffer' : 'greeting card'}
              </p>
            </div>

            <button
              onClick={handleCreateHamper}
              className="w-full sm:w-auto bg-[#262220] hover:bg-black text-white py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>Add Custom Hamper to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
