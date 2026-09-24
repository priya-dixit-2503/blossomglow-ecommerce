import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-[#201C1A] text-white border-t border-stone-800 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/40 border border-amber-600/30 text-amber-300 text-[11px] uppercase font-mono tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The BlossomGlow Circle</span>
        </div>

        <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-light text-[#FAF8F5] tracking-tight">
          Stay in the Glow
        </h2>

        <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed">
          Be the first to discover new collections, festive gifting ideas and special releases. Plus receive 10% off your first artisanal order.
        </p>

        {isSubscribed ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl max-w-md mx-auto text-emerald-200 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Welcome to our circle! Your 10% discount code <strong>GLOW10</strong> is ready.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-11 pr-4 py-3.5 bg-stone-900/90 border border-stone-700 rounded-xl text-xs sm:text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 bg-amber-100 hover:bg-white text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
            >
              JOIN US
            </button>
          </form>
        )}

        <p className="text-[11px] text-stone-400 font-light">
          We honor your inbox. Zero spam, unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};
