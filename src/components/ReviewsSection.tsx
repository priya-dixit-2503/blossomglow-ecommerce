import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Plus, Sparkles, MessageSquare } from 'lucide-react';
import { Review } from '../types';
import { CandleApiService } from '../services/api';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [candleName, setCandleName] = useState(MOCK_PRODUCTS[0]?.name || 'Damask Rose & Velvet Peony');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const loadReviews = async () => {
    const list = await CandleApiService.getReviews();
    setReviews(list);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    await CandleApiService.addReview({
      productId: 'bg-damask-rose',
      author,
      location: location || 'India',
      rating,
      title: title || 'Pure tranquility in a jar',
      comment,
      candleName,
      verified: true
    });

    setModalOpen(false);
    setAuthor('');
    setLocation('');
    setTitle('');
    setComment('');
    loadReviews();
  };

  return (
    <section className="w-full py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-amber-800">
              <span>Verified Patron Impressions</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>4.9 / 5.0 Average Glow Rating</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-light text-stone-900 mt-2">
              Words From Our Sanctuary Keepers
            </h2>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 border border-stone-300 hover:border-stone-900 text-stone-900 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-xl border border-stone-200/80 bg-[#FAF8F5] flex flex-col justify-between space-y-4 hover:shadow-xs transition-shadow"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{rev.date}</span>
                </div>

                <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                  "{rev.title}"
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-medium text-stone-900 block">{rev.author}</span>
                  <span className="text-stone-400 text-[10px]">{rev.location}</span>
                </div>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-editorial text-xl font-medium text-stone-900">
                Review Your BlossomGlow Creation
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Maya Sen"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">City / State</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800 bg-white"
                  >
                    <option value={5}>5 Stars - Pure Sanctuary</option>
                    <option value={4}>4 Stars - Wonderful Glow</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Candle Scent Burned</label>
                <select
                  value={candleName}
                  onChange={(e) => setCandleName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800 bg-white"
                >
                  {MOCK_PRODUCTS.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Heavenly aroma that lingers gently"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Your Fragrance Experience *</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the scent throw, burn evenness, and vessel aesthetic..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#262220] hover:bg-black text-white py-2.5 rounded-lg font-semibold uppercase tracking-wider text-xs shadow-md transition-colors"
              >
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
