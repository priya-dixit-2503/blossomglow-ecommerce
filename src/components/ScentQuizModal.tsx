import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { CandleApiService } from '../services/api';
import { resolveImage } from '../utils/productNormalizer';

interface ScentQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ScentQuizModal: React.FC<ScentQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState({
    mood: '',
    profile: '',
    space: ''
  });
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  if (!isOpen) return null;

  const moods = [
    { id: 'fireside', title: 'Cozy Fireside Solitude', subtitle: 'Warm, grounding, introspective retreat' },
    { id: 'calm', title: 'Deep Rest & Sleep Calm', subtitle: 'Stress relief, soothing restorative unwinding' },
    { id: 'romantic', title: 'Romantic Candlelit Intimacy', subtitle: 'Sensual botanical florals and velvet petals' },
    { id: 'invigorating', title: 'Morning Clarity & Focus', subtitle: 'Crisp herbal air to stimulate the mind' },
  ];

  const profiles = [
    { id: 'wood', title: 'Aged Sandalwood, Amber & Resins', tag: 'Woody & Warm' },
    { id: 'floral', title: 'Damask Rose, Peony & Jasmine Petals', tag: 'Botanical Floral' },
    { id: 'gourmand', title: 'Creamy French Vanilla, Honey & Lavender', tag: 'Sweet & Soothing' },
    { id: 'fresh', title: 'Eucalyptus, Peppermint & Cypress Pine', tag: 'Herbal & Spa' },
  ];

  const spaces = [
    { id: 'living', title: 'Living Room & Hearth', tag: 'Open Social Spaces' },
    { id: 'bedroom', title: 'Master Bed Sanctuary', tag: 'Private Rest' },
    { id: 'spa', title: 'Bath & Powder Room', tag: 'Self-Care Rituals' },
    { id: 'office', title: 'Work Desk / Creative Studio', tag: 'Clarity & Productivity' },
  ];

  const handleSelectMood = (moodId: string) => {
    setAnswers({ ...answers, mood: moodId });
    setStep(2);
  };

  const handleSelectProfile = (profileId: string) => {
    setAnswers({ ...answers, profile: profileId });
    setStep(3);
  };

  const handleSelectSpace = (spaceId: string) => {
    const finalAnswers = { ...answers, space: spaceId };
    setAnswers(finalAnswers);
    const candle = CandleApiService.recommendCandle(finalAnswers);
    setRecommendedProduct(candle);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({ mood: '', profile: '', space: '' });
    setRecommendedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xl font-medium text-stone-900">
              Find Your Signature Glow
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-800 transition-colors"
            aria-label="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-6 sm:p-8">
          {step < 4 && (
            <div className="space-y-6">
              {/* Progress dots */}
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-medium uppercase tracking-wider text-stone-600">
                  Step {step} of 3
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`w-8 h-1.5 rounded-full transition-all ${
                        s === step ? 'bg-amber-700' : s < step ? 'bg-stone-800' : 'bg-stone-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-editorial text-2xl font-normal text-stone-900">
                      What ambiance do you wish to evoke?
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Choose the primary atmosphere you seek in your sanctuary.
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {moods.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMood(m.id)}
                        className="w-full text-left p-3.5 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all group"
                      >
                        <span className="text-xs font-semibold text-stone-900 block group-hover:text-amber-900">
                          {m.title}
                        </span>
                        <span className="text-[11px] text-stone-500 block mt-0.5">
                          {m.subtitle}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-editorial text-2xl font-normal text-stone-900">
                      Which scent profile speaks to you?
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Select the primary botanical or wood essence you enjoy most.
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProfile(p.id)}
                        className="w-full text-left p-3.5 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <span className="text-xs font-semibold text-stone-900 block group-hover:text-amber-900">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-stone-400 block mt-0.5 uppercase tracking-wider">
                            {p.tag}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-editorial text-2xl font-normal text-stone-900">
                      Where will this candle live?
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      The room dimensions influence wick sizing and scent throw density.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {spaces.map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => handleSelectSpace(sp.id)}
                        className="text-left p-4 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all"
                      >
                        <span className="text-xs font-semibold text-stone-900 block">
                          {sp.title}
                        </span>
                        <span className="text-[10px] text-amber-800 uppercase tracking-wider block mt-1">
                          {sp.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && recommendedProduct && (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 text-xs font-semibold tracking-wider uppercase rounded-full border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Your Curated Signature Match
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 text-left">
                <img
                  src={resolveImage(recommendedProduct.image || (recommendedProduct as any)?.imageUrl, recommendedProduct.id, recommendedProduct.name)}
                  alt={recommendedProduct.name}
                  onError={(e) => {
                    e.currentTarget.src = '/products/floral-garden.jpg';
                  }}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg object-cover bg-stone-100 shrink-0"
                />
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                    {recommendedProduct.fragranceFamily} · {recommendedProduct.burnTimeHours}h Clean Burn
                  </span>
                  <h4 className="font-editorial text-xl font-medium text-stone-900">
                    {recommendedProduct.name}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {recommendedProduct.description}
                  </p>
                  <p className="text-sm font-semibold font-mono text-stone-950 pt-1">
                    ₹{recommendedProduct.price}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    onQuickAdd(recommendedProduct);
                    onClose();
                  }}
                  className="flex-1 bg-[#262220] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Add Recommended to Bag</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onSelectProduct(recommendedProduct);
                  }}
                  className="px-4 py-3 border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-medium rounded-xl transition-colors"
                >
                  View Details
                </button>

                <button
                  onClick={handleReset}
                  className="p-3 text-stone-400 hover:text-stone-700 transition-colors"
                  title="Retake Quiz"
                  aria-label="Retake Quiz"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
