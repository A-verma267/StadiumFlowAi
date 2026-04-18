import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound';
import GoogleAuthModal from './components/GoogleAuthModal';
import useAppStore from './context/AppContext';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function AnimatedRoute({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Protected route — redirects to home if not logged in
function ProtectedRoute({ children }) {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const openAuthModal = useAppStore((s) => s.openAuthModal);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen animated-bg grid-pattern pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-10 text-center max-w-md w-full border border-white/5"
        >
          <div className="text-5xl mb-5">🔒</div>
          <h2 className="font-orbitron text-2xl font-black text-white mb-3">Sign In Required</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You need to sign in with your Google account to access the Dashboard and all AI-powered features.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={openAuthModal}
            className="px-8 py-3.5 rounded-2xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)', boxShadow: '0 8px 30px rgba(0,212,255,0.3)' }}
          >
            Sign in with Google →
          </motion.button>
        </motion.div>
      </div>
    );
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const isLoading = useAppStore((s) => s.isLoading);
  const setLoading = useAppStore((s) => s.setLoading);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, [setLoading]);

  return (
    <>
      <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>

      {!isLoading && (
        <>
          <Navbar />
          <GoogleAuthModal />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />
              <Route path="/dashboard" element={
                <AnimatedRoute>
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                </AnimatedRoute>
              } />
              <Route path="/simulation" element={<AnimatedRoute><Simulation /></AnimatedRoute>} />
              <Route path="/booking" element={<AnimatedRoute><Booking /></AnimatedRoute>} />
              <Route path="*" element={<AnimatedRoute><NotFound /></AnimatedRoute>} />
            </Routes>
          </AnimatePresence>
        </>
      )}
    </>
  );
}
