import React, { useState, useEffect, useRef } from 'react';
import { Flame, Volume2, VolumeX, Moon, Sun, Sparkles, X, Wind, Music, Bell } from 'lucide-react';
import { ambientAudio } from '../utils/soundEffects';

interface SanctuaryAmbianceDockProps {
  isCandlelitMode: boolean;
  onToggleCandlelitMode: () => void;
}

export const SanctuaryAmbianceDock: React.FC<SanctuaryAmbianceDockProps> = ({
  isCandlelitMode,
  onToggleCandlelitMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLit, setIsLit] = useState(true);
  const [soundTrack, setSoundTrack] = useState<'crackle' | 'hearth' | 'breeze' | 'none'>('none');
  const [isMuted, setIsMuted] = useState(false);
  const [flickerOffset, setFlickerOffset] = useState({ x: 0, y: 0 });
  const flameRef = useRef<HTMLDivElement>(null);

  // Micro flame flicker effect
  useEffect(() => {
    if (!isLit) return;
    const interval = setInterval(() => {
      const rx = (Math.random() - 0.5) * 4;
      const ry = (Math.random() - 0.5) * 3;
      setFlickerOffset({ x: rx, y: ry });
    }, 120);
    return () => clearInterval(interval);
  }, [isLit]);

  // Handle atmosphere audio
  useEffect(() => {
    if (isMuted || soundTrack === 'none' || !isLit) {
      ambientAudio.stopAtmosphere();
    } else {
      ambientAudio.startAtmosphere(soundTrack);
    }
    return () => {
      ambientAudio.stopAtmosphere();
    };
  }, [soundTrack, isMuted, isLit]);

  const handleToggleFlame = () => {
    if (!isLit) {
      ambientAudio.playMatchStrike();
      setIsLit(true);
      if (soundTrack === 'none') {
        setSoundTrack('crackle');
      }
    } else {
      setIsLit(false);
      ambientAudio.stopAtmosphere();
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    ambientAudio.setMuted(nextMuted);
  };

  const handlePlaySingingBowl = () => {
    ambientAudio.playSingingBowl();
  };

  return (
    <>
      {/* Floating Minimized Widget Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-xl border backdrop-blur-md transition-all group ${
            isLit
              ? 'bg-stone-900/90 hover:bg-stone-900 text-stone-100 border-amber-500/40 shadow-amber-900/20'
              : 'bg-stone-800/90 text-stone-300 border-stone-700'
          }`}
          title="Open Sanctuary Soundscape & Virtual Flame"
        >
          {/* Flame Icon with subtle glow */}
          <div className="relative">
            <Flame
              className={`w-4 h-4 transition-all duration-300 ${
                isLit ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-110' : 'text-stone-500'
              }`}
            />
            {isLit && soundTrack !== 'none' && !isMuted && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>

          <span className="text-xs font-serif tracking-wide hidden sm:inline">
            {isLit ? (soundTrack !== 'none' && !isMuted ? 'Atelier Glow · Live' : 'Virtual Flame') : 'Unlit Flame'}
          </span>

          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            Ambiance
          </span>
        </button>
      </div>

      {/* Expanded Interactive Sanctuary Console Modal / Flyout */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-80 sm:w-88 bg-stone-900/95 text-stone-100 rounded-2xl p-5 shadow-2xl border border-amber-500/30 backdrop-blur-lg animate-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="font-editorial text-base font-normal text-white">
                  Sanctuary Ambiance
                </h4>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                  Himalayan Sensory Ritual
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Virtual Candle Display */}
          <div className="my-4 py-4 px-3 rounded-xl bg-[#151210] border border-stone-800/80 flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Ambient Radial Glow */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                isLit ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'radial-gradient(circle at 50% 45%, rgba(251, 146, 60, 0.22) 0%, rgba(180, 83, 9, 0.08) 50%, transparent 80%)'
              }}
            />

            {/* Interactive Candle Vessel & Wick */}
            <div
              ref={flameRef}
              onClick={handleToggleFlame}
              className="cursor-pointer relative flex flex-col items-center py-2 select-none"
              title="Click to light or extinguish flame"
            >
              {/* Flame Component */}
              <div className="h-14 flex items-end justify-center mb-1">
                {isLit ? (
                  <div
                    className="relative flex items-center justify-center transition-transform duration-100"
                    style={{
                      transform: `translate(${flickerOffset.x}px, ${flickerOffset.y}px)`
                    }}
                  >
                    {/* Outer Flame Aura */}
                    <div className="w-6 h-12 rounded-full bg-gradient-to-t from-amber-600 via-amber-400 to-amber-200 blur-[2px] animate-pulse opacity-90" />
                    {/* Inner Core Flame */}
                    <div className="absolute w-3 h-8 rounded-full bg-gradient-to-t from-orange-500 via-yellow-200 to-white -bottom-0.5" />
                    {/* Blue Base Oxygen Core */}
                    <div className="absolute w-2 h-2.5 rounded-full bg-sky-400 blur-[1px] bottom-0" />
                  </div>
                ) : (
                  /* Smoke Whispers when unlit */
                  <div className="w-1 h-6 bg-stone-700 rounded-full opacity-40 animate-pulse" />
                )}
              </div>

              {/* Wooden Wick */}
              <div className="w-1.5 h-3 bg-amber-950 rounded-xs mb-0.5 relative">
                {isLit && <div className="absolute -top-0.5 left-0 right-0 h-1 bg-amber-300 rounded-full shadow-xs" />}
              </div>

              {/* Ceramic Candle Vessel */}
              <div className="w-32 h-14 rounded-b-xl border-t-2 border-stone-700 bg-gradient-to-b from-stone-800 to-stone-900 shadow-lg flex flex-col items-center justify-center px-2">
                <span className="font-editorial text-[10px] tracking-[0.2em] text-amber-200 uppercase">
                  BLOSSOMGLOW
                </span>
                <span className="text-[8px] text-stone-400 tracking-wider font-mono">
                  {isLit ? 'BURNING SOOT-FREE' : 'CLICK TO LIGHT WICK'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleFlame}
              className="mt-2 text-[10px] uppercase tracking-wider font-semibold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1"
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{isLit ? 'Extinguish Candle' : 'Strike Match & Light'}</span>
            </button>
          </div>

          {/* Audio Atmosphere Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-300 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                Acoustic Soundscapes
              </span>
              <button
                onClick={handleMuteToggle}
                className="text-stone-400 hover:text-stone-200 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-stone-300" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'crackle', label: 'Wood Wick Crackle' },
                { id: 'hearth', label: 'Evening Hearth' },
                { id: 'breeze', label: 'Mountain Breeze' },
                { id: 'none', label: 'Silent Burn' },
              ].map((trk) => (
                <button
                  key={trk.id}
                  onClick={() => {
                    setSoundTrack(trk.id as any);
                    if (trk.id !== 'none' && !isLit) {
                      setIsLit(true);
                      ambientAudio.playMatchStrike();
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-medium transition-all ${
                    soundTrack === trk.id
                      ? 'border-amber-500/60 bg-amber-500/20 text-amber-200'
                      : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {trk.label}
                </button>
              ))}
            </div>

            {/* Extra Sensory Ritual: Singing Bowl */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handlePlaySingingBowl}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Bell className="w-3 h-3 text-amber-400" />
                <span>Chime Tibetan Bowl (G4)</span>
              </button>
            </div>

            {/* Candlelit Mode Switch */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-medium text-stone-200 block text-[11px]">
                  Candlelit Sanctuary Mode
                </span>
                <span className="text-[10px] text-stone-400 block">
                  Dims lighting &amp; adds cozy golden hearth aura
                </span>
              </div>
              <button
                onClick={onToggleCandlelitMode}
                className={`p-2 rounded-lg border transition-all ${
                  isCandlelitMode
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-stone-700 bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
                title="Toggle Candlelit Mode"
              >
                {isCandlelitMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
