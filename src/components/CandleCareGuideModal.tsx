import React from 'react';
import { X, Flame, Scissors, Clock, Sparkles, Recycle, ShieldCheck } from 'lucide-react';

interface CandleCareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CandleCareGuideModal: React.FC<CandleCareGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xl font-medium text-stone-900">
              The Atelier &amp; Candle Care Ritual
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-800 transition-colors"
            aria-label="Close care guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-[10px] uppercase font-semibold text-amber-800 tracking-[0.2em]">
              The Art of the Clean Burn
            </span>
            <h3 className="font-editorial text-2xl font-light text-stone-900">
              Preserving the Lifespan &amp; Fragrance of BlossomGlow Candle Creations
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Hand-poured 100% soy wax has a natural memory. Following these artisan rituals ensures your candle burns evenly, throws fragrance cleanly, and lasts up to 80 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs">
                <Flame className="w-4 h-4 text-amber-700" />
                <span>1. The Vital "First Burn" Memory</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                When lighting your candle for the first time, allow it to burn for 2 to 3 consecutive hours until the liquid wax pool reaches the glass rim. This prevents future tunneling down the center.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs">
                <Scissors className="w-4 h-4 text-amber-700" />
                <span>2. Trim Wick to 1/4 Inch</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Always pinch off carbon buildup or snip wood/cotton wicks to 5mm before every lighting. A short wick produces a calm, teardrop flame with zero soot or mushrooming.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>3. 4-Hour Session Limit</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Never burn longer than 4 hours in one sitting. Prolonged heating can cause the glass vessel to overheat and burn off essential oils too rapidly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs">
                <Recycle className="w-4 h-4 text-amber-700" />
                <span>4. Vessel Upcycling Ritual</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                When 1/2 inch of wax remains, wash with warm soapy water. Repurpose your fluted ceramic or frosted amber jar as a chic desk planter, pen cup, or bathroom vanity holder.
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Safety First in the Sanctuary</span>
              <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                Keep lit candles out of direct air drafts, away from curtains and flammable items, and strictly out of reach of unattended children or pets. Never leave a burning flame unattended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
