import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../context/AppContext';

const navLinks = [
  { path: '/',           label: 'Home' },
  { path: '/dashboard',  label: 'Dashboard' },
  { path: '/booking',    label: 'Book Tickets' },
  { path: '/simulation', label: 'Simulation' },
];

const AVATAR_COLORS = ['#00d4ff', '#8b5cf6', '#f472b6', '#22c55e', '#f97316'];
function hashColor(str = '') {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export default function Navbar() {
  const location = useLocation();
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isAIThinking  = useAppStore((s) => s.isAIThinking);
  const aiConfidence  = useAppStore((s) => s.aiConfidence);
  const isLoggedIn    = useAppStore((s) => s.isLoggedIn);
  const user          = useAppStore((s) => s.user);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const logout        = useAppStore((s) => s.logout);
  const userMenuRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const initials    = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || '?';
  const avatarColor = user ? hashColor(user.email) : '#00d4ff';

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg animate-pulse-neon" />
              <div className="relative flex items-center justify-center h-full text-sm sm:text-lg font-bold text-white font-orbitron">SF</div>
            </div>
            <div>
              <span className="font-orbitron font-bold text-xs sm:text-sm gradient-text tracking-wider block">
                StadiumFlow AI
              </span>
              <div className="hidden sm:flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isAIThinking ? 'bg-yellow-400 animate-blink' : 'bg-emerald-400'}`} />
                <span className="text-[10px] text-slate-400 font-medium">
                  {isAIThinking ? 'AI thinking...' : `AI ${aiConfidence}% confident`}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav — hidden on tablet and below, shown on lg+ */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navActive"
                      className="absolute inset-0 bg-white/5 border border-cyan-400/20 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live indicator — hide on smallest screens */}
            <div className="hidden sm:flex glass px-2.5 py-1.5 rounded-full items-center gap-2 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">Live</span>
            </div>

            {/* Auth — shown at lg+ */}
            <div className="hidden lg:flex items-center gap-2" ref={userMenuRef}>
              {isLoggedIn ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ background: avatarColor }}>
                      {initials}
                    </div>
                    <span className="text-xs text-white font-medium max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                    <span className={`text-slate-400 text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>▾</span>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-2xl border border-white/10 p-2 shadow-2xl shadow-black/50 z-50"
                      >
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                          <div className="text-xs font-semibold text-white">{user?.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                        </div>
                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                          📊 Dashboard
                        </Link>
                        <Link to="/booking" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                          🎫 My Bookings
                        </Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-all">
                          🚪 Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openAuthModal}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 whitespace-nowrap"
                >
                  Sign In
                </motion.button>
              )}
            </div>

            {/* Hamburger — shown below lg */}
            <button
              className="lg:hidden glass p-2 rounded-lg flex-shrink-0"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-white/5 pt-3 mt-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2 mb-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: avatarColor }}>{initials}</div>
                      <div>
                        <div className="text-sm text-white font-medium">{user?.name}</div>
                        <div className="text-[10px] text-slate-400">{user?.email}</div>
                      </div>
                    </div>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 transition-all">
                      📊 Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      🚪 Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { openAuthModal(); setMenuOpen(false); }}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
                  >
                    Sign In with Google
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
