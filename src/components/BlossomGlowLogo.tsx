import React, { useState } from 'react';
import officialLogoImg from '../assets/images/blossomglow_official_logo.jpg';

interface BlossomGlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const BlossomGlowLogo: React.FC<BlossomGlowLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'light',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Size mapping for the circular medallion
  const sizeClasses = {
    sm: 'w-10 h-10 sm:w-11 sm:h-11',
    md: 'w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14',
    lg: 'w-16 h-16 sm:w-18 sm:h-18',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const textSizes = {
    sm: { title: 'text-xl sm:text-2xl', sub: 'text-[8.5px] tracking-[0.25em]' },
    md: { title: 'text-2xl sm:text-[27px] md:text-[29px]', sub: 'text-[9.5px] sm:text-[10px] md:text-[10.5px] tracking-[0.3em]' },
    lg: { title: 'text-3xl sm:text-4xl', sub: 'text-[11px] sm:text-xs tracking-[0.32em]' },
    xl: { title: 'text-4xl sm:text-5xl', sub: 'text-xs sm:text-sm tracking-[0.34em]' },
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 sm:gap-3.5 shrink-0 select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Official Circular Medallion */}
      <div
        className={`relative ${sizeClasses[size]} rounded-full shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-[0_2px_16px_rgba(217,119,6,0.3)] group-hover:shadow-[0_4px_24px_rgba(217,119,6,0.48)] ring-2 ring-amber-500/40 group-hover:ring-amber-500/70 overflow-hidden bg-[#141416]`}
      >
        {/* Ambient back-glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-900/40 via-transparent to-amber-500/25 pointer-events-none" />

        {!imageError ? (
          <img
            src={officialLogoImg}
            alt="BlossomGlow Candle Creations Official Logo"
            className="w-full h-full object-cover rounded-full"
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-precision Vector SVG replica matching official logo */
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full p-1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dark background circle with inner glow */}
            <circle cx="100" cy="100" r="96" fill="#141517" />
            <circle
              cx="100"
              cy="100"
              r="94"
              stroke="#D97706"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />

            {/* Floral Arch: 16 delicate botanical blossoms */}
            <g id="floral-arch">
              {/* Petal groups forming semicircle arch */}
              {[
                { x: 50, y: 92, color: '#E28E58', s: 0.9 },
                { x: 52, y: 78, color: '#FAF6F0', s: 0.8 },
                { x: 58, y: 65, color: '#E28E58', s: 0.85 },
                { x: 68, y: 54, color: '#FAF6F0', s: 0.9 },
                { x: 80, y: 46, color: '#E28E58', s: 0.85 },
                { x: 94, y: 43, color: '#FAF6F0', s: 0.9 },
                { x: 106, y: 43, color: '#E28E58', s: 0.9 },
                { x: 120, y: 46, color: '#FAF6F0', s: 0.85 },
                { x: 132, y: 54, color: '#E28E58', s: 0.9 },
                { x: 142, y: 65, color: '#FAF6F0', s: 0.85 },
                { x: 148, y: 78, color: '#E28E58', s: 0.8 },
                { x: 150, y: 92, color: '#FAF6F0', s: 0.9 },
              ].map((f, i) => (
                <g key={i} transform={`translate(${f.x}, ${f.y}) scale(${f.s})`}>
                  <circle cx="0" cy="-3.5" r="2.2" fill={f.color} />
                  <circle cx="3.5" cy="-1" r="2.2" fill={f.color} />
                  <circle cx="2.2" cy="3" r="2.2" fill={f.color} />
                  <circle cx="-2.2" cy="3" r="2.2" fill={f.color} />
                  <circle cx="-3.5" cy="-1" r="2.2" fill={f.color} />
                  <circle cx="0" cy="0" r="1.5" fill="#FBBF24" />
                </g>
              ))}
            </g>

            {/* Glowing Golden Flame */}
            <path
              d="M100 52 C98 62 93 68 93 74 C93 80 97 84 100 84 C103 84 107 80 107 74 C107 68 102 62 100 52 Z"
              fill="url(#officialFlame)"
            />
            <path
              d="M100 64 C99 69 96 73 96 76 C96 79 98 81 100 81 C102 81 104 79 104 76 C104 73 101 69 100 64 Z"
              fill="#FDE68A"
            />

            {/* Melting Candle Top with Organic Dripping Wax */}
            <path
              d="M74 88 C74 86 86 85 100 85 C114 85 126 86 126 88 C126 94 126 98 126 102 C124 106 121 104 119 100 C117 96 116 103 114 106 C112 109 109 107 108 103 C107 99 105 104 103 107 C101 110 98 108 97 103 C96 98 94 105 91 108 C89 110 86 108 85 101 C84 96 82 101 80 102 C77 103 74 100 74 96 Z"
              fill="#FFFFFF"
            />
            {/* Candle Rim Oval */}
            <ellipse cx="100" cy="88" rx="26" ry="4" fill="#EAE5DC" />

            {/* Text: BLOSSOM GLOW */}
            <text
              x="36"
              y="126"
              fill="#FFFFFF"
              fontFamily="Georgia, serif"
              fontSize="21"
              fontWeight="bold"
              letterSpacing="0.5"
            >
              BLOSSOM
            </text>

            {/* Little Flame on the 'B' */}
            <path
              d="M40 107 C39.5 110 38.5 112 38.5 114 C38.5 116 39.5 117 40 117 C40.5 117 41.5 116 41.5 114 C41.5 112 40.5 110 40 107 Z"
              fill="#FFFFFF"
            />

            <text
              x="132"
              y="126"
              fill="#E28E58"
              fontFamily="Georgia, serif"
              fontSize="21"
              fontWeight="bold"
              letterSpacing="0.5"
            >
              GLOW
            </text>

            {/* Subtitle: CANDLE CREATIONS */}
            <text
              x="100"
              y="142"
              fill="#E28E58"
              fontFamily="Georgia, serif"
              fontSize="8.5"
              fontWeight="600"
              letterSpacing="4"
              textAnchor="middle"
            >
              CANDLE CREATIONS
            </text>

            <defs>
              <linearGradient id="officialFlame" x1="100" y1="52" x2="100" y2="84" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="0.6" stopColor="#E28E58" />
                <stop offset="1" stopColor="#B45309" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Brand Typography Lockup */}
      {showText && (
        <div className="flex flex-col text-left leading-none shrink-0 whitespace-nowrap">
          <div className="flex items-center gap-1.5 font-serif tracking-[0.02em] font-semibold transition-colors whitespace-nowrap">
            <span
              className={`${textSizes[size].title} ${
                variant === 'dark'
                  ? 'text-white group-hover:text-amber-100'
                  : 'text-[#1C1815] group-hover:text-black drop-shadow-2xs'
              }`}
            >
              Blossom
            </span>
            <span
              className={`${textSizes[size].title} ${
                variant === 'dark'
                  ? 'text-[#F59E0B] group-hover:text-amber-300'
                  : 'text-[#D97706] group-hover:text-[#B45309] drop-shadow-2xs'
              }`}
            >
              Glow
            </span>
          </div>
          <span
            className={`font-sans uppercase font-bold tracking-[0.3em] block mt-1 transition-colors whitespace-nowrap ${
              variant === 'dark'
                ? 'text-stone-300 group-hover:text-amber-200'
                : 'text-stone-500 group-hover:text-amber-900'
            } ${textSizes[size].sub}`}
          >
            Candle Creations
          </span>
        </div>
      )}
    </div>
  );
};
