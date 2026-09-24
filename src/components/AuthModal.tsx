import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { CandleApiService } from '../services/api';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  // Always declare all hooks unconditionally before any early returns
  const [tab, setTab] = useState<'login' | 'register' | 'admin'>(initialMode);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'login' || tab === 'admin') {
        const user = await CandleApiService.login(usernameOrEmail, password);
        setSuccessMsg(`Welcome back, ${user.fullName}!`);
        setTimeout(() => {
          onAuthSuccess(user);
          onClose();
        }, 500);
      } else {
        if (!fullName.trim() || !usernameOrEmail.trim() || !password.trim()) {
          throw new Error('Please fill in all required fields');
        }
        const user = await CandleApiService.register({
          username: usernameOrEmail.split('@')[0],
          email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@blossomglow.in`,
          password,
          fullName,
          phone,
        });
        setSuccessMsg(`Account created! Welcome, ${user.fullName}`);
        setTimeout(() => {
          onAuthSuccess(user);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (role: 'admin' | 'customer') => {
    setError(null);
    if (role === 'admin') {
      setTab('admin');
      setUsernameOrEmail('admin');
      setPassword('blossomglow2026!');
    } else {
      setTab('login');
      setUsernameOrEmail('priya.dixit.25032002@gmail.com');
      setPassword('candleArtisan2026');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-700 via-stone-800 to-amber-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 mb-3 shadow-inner">
            {tab === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-serif tracking-wide text-white">
            {tab === 'admin' ? 'Atelier Admin Portal' : tab === 'register' ? 'Join BlossomGlow' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-amber-200/80 mt-1 font-sans">
            {tab === 'admin'
              ? 'Spring Security RBAC Protected Admin Console'
              : 'Sign in to access your orders, saved scents, and wishlist'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${
              tab === 'login'
                ? 'border-amber-700 text-amber-800 dark:text-amber-400 font-semibold bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Customer Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${
              tab === 'register'
                ? 'border-amber-700 text-amber-800 dark:text-amber-400 font-semibold bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('admin');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${
              tab === 'admin'
                ? 'border-amber-700 text-amber-800 dark:text-amber-400 font-semibold bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Admin Sign In
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {tab === 'admin' ? 'Admin Username or Email' : 'Email / Username'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder={tab === 'admin' ? 'admin' : 'your.email@example.com'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying via Spring Security...</span>
                </>
              ) : tab === 'admin' ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Admin JWT</span>
                </>
              ) : tab === 'register' ? (
                <>
                  <User className="w-4 h-4" />
                  <span>Create Customer Account</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mb-2 font-mono">Quick Test Credentials:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('customer')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[11px] text-stone-700 dark:text-stone-300 transition-colors"
              >
                👤 Customer Demo
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('admin')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 transition-colors font-medium border border-amber-200/50"
              >
                🛡️ Admin Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
