import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../context/AppContext';

const GOOGLE_ACCOUNTS = [
  { name: 'Alex Chen', email: 'alex.chen@gmail.com', initials: 'AC' },
  { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', initials: 'PS' },
  { name: 'Rahul Gupta', email: 'rahul.gupta@gmail.com', initials: 'RG' },
];

const AVATAR_COLORS = ['#00d4ff', '#8b5cf6', '#f472b6', '#22c55e', '#f97316'];

function hashColor(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function GoogleAuthModal() {
  const showAuthModal = useAppStore((s) => s.showAuthModal);
  const closeAuthModal = useAppStore((s) => s.closeAuthModal);
  const simulateGoogleLogin = useAppStore((s) => s.simulateGoogleLogin);
  const authLoading = useAppStore((s) => s.authLoading);

  const [step, setStep] = useState('choose'); // 'choose' | 'email' | 'loading' | 'success'
  const [email, setEmail] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [successUser, setSuccessUser] = useState(null);

  useEffect(() => {
    if (showAuthModal) {
      setStep('choose');
      setEmail('');
      setSelectedAccount(null);
      setSuccessUser(null);
    }
  }, [showAuthModal]);

  const handleAccountSelect = async (account) => {
    setSelectedAccount(account);
    setStep('loading');
    const user = await simulateGoogleLogin(account.email);
    setSuccessUser(user);
    setStep('success');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep('loading');
    const user = await simulateGoogleLogin(email.trim());
    setSuccessUser(user);
    setStep('success');
  };

  if (!showAuthModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
          className="relative w-full max-w-md mx-4"
          style={{
            background: 'rgba(10, 15, 30, 0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '40px 36px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.05)',
          }}
        >
          {/* Close btn */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all text-lg"
          >
            ×
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-2xl animate-pulse-neon">
                🏟️
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* Step: Choose Account */}
            {step === 'choose' && (
              <motion.div key="choose" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold text-white text-center mb-1">Sign in to StadiumFlow AI</h2>
                <p className="text-sm text-slate-400 text-center mb-6">Continue with your Google account</p>

                <div className="space-y-2 mb-4">
                  {GOOGLE_ACCOUNTS.map((acc) => (
                    <motion.button
                      key={acc.email}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAccountSelect(acc)}
                      className="w-full flex items-center gap-3 px-4 py-3 glass rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: hashColor(acc.email) }}
                      >
                        {acc.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{acc.name}</div>
                        <div className="text-xs text-slate-400">{acc.email}</div>
                      </div>
                      <div className="ml-auto">
                        <GoogleLogo />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-slate-500">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('email')}
                  className="btn-google"
                >
                  <GoogleLogo />
                  Continue with another Google account
                </motion.button>

                <p className="text-xs text-slate-500 text-center mt-5">
                  By signing in, you agree to our{' '}
                  <span className="text-cyan-400 cursor-pointer hover:underline">Terms of Service</span>
                </p>
              </motion.div>
            )}

            {/* Step: Email input */}
            {step === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep('choose')} className="flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-4 transition-colors">
                  ← Back
                </button>
                <h2 className="text-xl font-bold text-white mb-1">Enter your Google email</h2>
                <p className="text-sm text-slate-400 mb-6">We'll simulate the authentication flow</p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                    autoFocus
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-cyan-500/20"
                  >
                    Continue with Google →
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step: Loading */}
            {step === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-purple-500 border-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <GoogleLogo />
                    </div>
                  </div>
                </div>
                <p className="text-white font-semibold mb-1">Connecting to Google...</p>
                <p className="text-sm text-slate-400">Verifying your account</p>
                <div className="flex justify-center gap-1 mt-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step: Success */}
            {step === 'success' && successUser && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: hashColor(successUser.email) }}
                >
                  {successUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.6, delay: 0.3 }}
                  className="text-2xl mb-2"
                >
                  ✅
                </motion.div>
                <h2 className="text-lg font-bold text-white mb-1">Welcome, {successUser.name.split(' ')[0]}!</h2>
                <p className="text-sm text-slate-400 mb-4">{successUser.email}</p>
                <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-2 px-3">
                  ✓ Successfully authenticated via Google
                </div>
                <p className="text-xs text-slate-500 mt-3">Redirecting you to the dashboard...</p>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
