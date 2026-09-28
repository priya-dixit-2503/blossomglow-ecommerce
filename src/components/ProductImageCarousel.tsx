import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
  intervalMs?: number;
  aspectRatioClass?: string;
  className?: string;
  isParentHovered?: boolean;
  onImageClick?: () => void;
}

export const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  alt,
  intervalMs = 3500,
  aspectRatioClass = 'aspect-[4/3]',
  className = '',
  isParentHovered = false,
  onImageClick,
}) => {
  // Ensure we always have only valid, non-empty string image URLs
  const validImages = React.useMemo(() => {
    const list = (images || []).filter((img) => typeof img === 'string' && img.trim().length > 0);
    return list.length > 0 ? list : ['/products/floral-garden.jpg'];
  }, [images]);

  const hasMultiple = validImages.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualPause, setIsManualPause] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Touch gesture state for mobile swiping
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);
  const manualPauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Go to next slide
  const nextSlide = useCallback((isManual = false) => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
    if (isManual) {
      triggerManualPause();
    }
  }, [hasMultiple, validImages.length]);

  // Go to prev slide
  const prevSlide = useCallback((isManual = false) => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    if (isManual) {
      triggerManualPause();
    }
  }, [hasMultiple, validImages.length]);

  // Go to specific slide
  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    triggerManualPause();
  };

  // When manually switched, pause auto transition for 5 seconds, then continue automatically
  const triggerManualPause = () => {
    setIsManualPause(true);
    if (manualPauseTimerRef.current) {
      clearTimeout(manualPauseTimerRef.current);
    }
    manualPauseTimerRef.current = setTimeout(() => {
      setIsManualPause(false);
    }, 5000);
  };

  // Automatic slide timer (runs every 3-4s when not hovered and not manually paused)
  useEffect(() => {
    if (!hasMultiple || isHovered || isManualPause || isParentHovered) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [hasMultiple, isHovered, isManualPause, isParentHovered, intervalMs, validImages.length]);

  // Cleanup manual pause timer on unmount
  useEffect(() => {
    return () => {
      if (manualPauseTimerRef.current) {
        clearTimeout(manualPauseTimerRef.current);
      }
    };
  }, []);

  // Handle Touch Events (Mobile Swiping)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultiple) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchCurrentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasMultiple || touchStartXRef.current === null) return;
    touchCurrentXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasMultiple || touchStartXRef.current === null || touchCurrentXRef.current === null) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      touchCurrentXRef.current = null;
      return;
    }

    const deltaX = touchStartXRef.current - touchCurrentXRef.current;
    const threshold = 40; // min 40px swipe distance

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swiped Left -> Next Image
        nextSlide(true);
      } else {
        // Swiped Right -> Previous Image
        prevSlide(true);
      }
    }

    // Reset touch refs
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchCurrentXRef.current = null;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, imgSrc: string) => {
    const target = e.currentTarget;
    // Attempt fallback from /src/assets/products/ to /products/
    if (target.src.includes('/src/assets/products/')) {
      const filename = target.src.split('/').pop()?.split('?')[0];
      if (filename) {
        target.src = `/products/${filename}`;
        return;
      }
    }
    // Attempt fallback to default floral-garden if another path broke
    if (!target.src.includes('floral-garden.jpg')) {
      target.src = '/products/floral-garden.jpg';
      return;
    }
    setFailedImages((prev) => ({ ...prev, [imgSrc]: true }));
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#F5F2EC] select-none ${aspectRatioClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onImageClick}
    >
      {/* Sliding Image Track */}
      <div
        className="flex w-full h-full transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {validImages.map((src, index) => {
          const isFailed = failedImages[src];

          return (
            <div
              key={`${src}-${index}`}
              className="relative w-full h-full flex-shrink-0 overflow-hidden"
            >
              {!isFailed && src && src.trim() !== '' ? (
                <img
                  src={src}
                  alt={`${alt} - View ${index + 1}`}
                  referrerPolicy="no-referrer"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                  onError={(e) => handleImageError(e, src)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
                  <Flame className="w-8 h-8 text-amber-400 mb-1" />
                  <span className="text-xs font-serif italic text-stone-600">{alt}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Buttons for Desktop Hover */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide(true);
            }}
            aria-label="Previous product image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-15 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md focus:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide(true);
            }}
            aria-label="Next product image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-15 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md focus:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Navigation Dots Indicator at the Bottom */}
      {hasMultiple && (
        <div
          className={`absolute inset-x-0 z-15 flex items-center justify-center gap-1.5 pointer-events-auto transition-all duration-300 ${
            isParentHovered ? 'bottom-14 sm:bottom-14' : 'bottom-2.5 sm:bottom-3'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {validImages.map((_, dotIndex) => {
            const isActive = dotIndex === currentIndex;
            return (
              <button
                key={dotIndex}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(dotIndex);
                }}
                aria-label={`Show image ${dotIndex + 1} of ${validImages.length}`}
                className="p-1 focus:outline-none group/dot"
              >
                <span
                  className={`block rounded-full transition-all duration-300 shadow-xs ${
                    isActive
                      ? 'w-4 h-1.5 bg-white ring-1 ring-black/20'
                      : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/95 group-hover/dot:scale-110'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
