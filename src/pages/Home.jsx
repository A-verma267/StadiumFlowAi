import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingCard from '../components/FloatingCard';
import ComicAgent from '../components/ComicAgent';
import Footer from '../components/Footer';
import useAppStore from '../context/AppContext';

// ──── Stats ────
const stats = [
  { value: '78K+', label: 'Fans Guided', icon: '👥' },
  { value: '94%', label: 'AI Accuracy', icon: '🧠' },
  { value: '<2s', label: 'Alert Latency', icon: '⚡' },
  { value: '350+', label: 'Events Powered', icon: '🏟️' },
];

// ──── Features data with images ────
const FEATURES = [
  {
    id: 'booking',
    title: 'Instant Ticket Booking',
    desc: 'Pick your match, select multiple seats on our interactive seat map, and pay in under 60 seconds. Completely frictionless.',
    image: '/feat_booking.png',
    icon: '🎫',
    bullets: ['Multi-seat selection', 'Interactive seat map', 'Secure payment'],
    color: '#00d4ff',
  },
  {
    id: 'cricket',
    title: 'Live Cricket Scores',
    desc: 'Ball-by-ball updates right in your dashboard. Toss results, batting stats, wickets, run rates — never leave the app.',
    image: '/feat_cricket.png',
    icon: '🏏',
    bullets: ['Ball-by-ball live sim', 'Batting partnerships', 'Current Run Rate'],
    color: '#22c55e',
  },
  {
    id: 'navigation',
    title: 'AI Route Guidance',
    desc: 'Our AI monitors every gate, corridor and stall in real-time, guiding you to your seat via the shortest, least crowded path.',
    image: '/feat_nav.png',
    icon: '🧭',
    bullets: ['Real-time crowd data', 'Gate density heatmap', 'Personalized routes'],
    color: '#8b5cf6',
  },
  {
    id: 'alerts',
    title: 'Smart Crowd Alerts',
    desc: 'Receive proactive AI alerts before queues form — which food stall is fastest, which gate to avoid, when to leave your seat.',
    image: '/stadium_bg.png',
    icon: '🚨',
    bullets: ['< 2s alert latency', '< 1% false positives', 'Proactive nudges'],
    color: '#f472b6',
  },
  {
    id: 'seat',
    title: 'Seat Intelligence',
    desc: 'Enter your seat number or book through us — and get personalized walking distance, time estimates and optimal entry gate.',
    image: '/feat_nav.png',
    icon: '💺',
    bullets: ['Custom seat input', 'Walking distance', 'Best entry gate'],
    color: '#f59e0b',
  },
];

// ──── How it works ────
const HOW_STEPS = [
  { step: '01', icon: '🔑', title: 'Sign In with Google', desc: 'One-click auth. Your data stays private.', color: '#00d4ff' },
  { step: '02', icon: '🎫', title: 'Book Your Ticket', desc: 'Pick section, select multiple seats, pay instantly.', color: '#8b5cf6' },
  { step: '03', icon: '🧠', title: 'AI Guides You', desc: 'From gate to seat — zero queues, live alerts.', color: '#f472b6' },
  { step: '04', icon: '🏏', title: 'Watch & Track Live', desc: 'Ball-by-ball cricket scores on your dashboard.', color: '#22c55e' },
];

// ──── Testimonials ────
const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Cricket Fan, Mumbai', text: "Walked in 5 min before the match — AI found my seat instantly. Insane!", stars: 5, initials: 'PS', color: '#8b5cf6' },
  { name: 'Rahul G.', role: 'Season Ticket Holder', text: "No more 30-min queues at the snack bar. Saved 20 minutes every match!", stars: 5, initials: 'RG', color: '#00d4ff' },
  { name: 'Aisha K.', role: 'First-time Visitor', text: "Live cricket widget is perfect. My family tracked scores while I parked. 🙌", stars: 5, initials: 'AK', color: '#f472b6' },
  { name: 'Vikram P.', role: 'Corporate Box User', text: "Booked 6 VIP seats in 45 seconds. The seat map is super intuitive!", stars: 5, initials: 'VP', color: '#22c55e' },
  { name: 'Sneha R.', role: 'IPL Season Pass Holder', text: "AI told me Gate C was 80% less crowded. I entered in under 2 minutes!", stars: 5, initials: 'SR', color: '#f59e0b' },
];

export default function Home() {
  const setLoading = useAppStore((s) => s.setLoading);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, [setLoading]);

  return (
    <div className="min-h-screen animated-bg overflow-x-hidden">

      {/* BG glow orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-pink-500/4 blur-[100px]" />
      </div>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,8,17,0.7) 0%, rgba(5,8,17,0.85) 60%, rgba(5,8,17,1) 100%), url('/stadium_bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left: Copy */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-cyan-400 font-medium tracking-wider uppercase">AI-Powered Stadium Intelligence • Live</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="font-orbitron font-clamp-hero font-black leading-tight mb-5">
                Your Stadium,<br />
                <span className="gradient-text">Guided by AI</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Book tickets, pick <strong className="text-white">multiple seats</strong> on an interactive map, track live cricket scores & get AI route guidance — all in one place.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                <Link to="/booking">
                  <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,212,255,0.35)' }} whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-white text-sm sm:text-base shadow-lg shadow-cyan-500/25">
                    🎫 Book Tickets Now
                  </motion.button>
                </Link>
                {!isLoggedIn ? (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={openAuthModal}
                    className="w-full sm:w-auto px-8 py-4 glass border border-white/10 rounded-2xl font-semibold text-white text-sm sm:text-base hover:border-purple-500/30 transition-colors">
                    🔑 Sign In with Google
                  </motion.button>
                ) : (
                  <Link to="/dashboard">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      className="w-full sm:w-auto px-8 py-4 glass border border-white/10 rounded-2xl font-semibold text-white text-sm sm:text-base">
                      📊 Open Dashboard
                    </motion.button>
                  </Link>
                )}
              </motion.div>

              {/* Stats row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="flex gap-6 justify-center lg:justify-start overflow-x-auto scrollbar-hide pb-1">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }} className="text-center flex-shrink-0">
                    <div className="text-xl mb-0.5">{s.icon}</div>
                    <div className="font-orbitron font-black text-xl gradient-text">{s.value}</div>
                    <div className="text-[10px] text-slate-500">{s.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: Comic AI Guide */}
            <div className="order-1 lg:order-2 flex justify-center">
              <ComicAgent section="hero" size="lg" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs flex flex-col items-center gap-1">
          <span>Scroll to explore</span>
          <span>↓</span>
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 px-4 sm:px-6" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20 mb-5">
              <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">How It Works</span>
            </div>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-black mb-4">
              4 Steps to a <span className="gradient-text">Perfect Match Day</span>
            </h2>
          </motion.div>
          {/* Horizontal scroll on mobile */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
            {HOW_STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="glass-strong rounded-2xl p-6 border border-white/5 relative overflow-hidden group flex-shrink-0 w-64 sm:w-auto"
              >
                <div className="absolute top-3 right-3 font-orbitron text-6xl font-black text-white/3 select-none">{item.step}</div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-base text-white mb-2 font-orbitron">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES — Full width image + overlay + horizontal scroll highlights ─── */}
      <section className="py-4" id="features">
        {FEATURES.map((feat, idx) => (
          <div key={feat.id} className="relative mb-2 overflow-hidden" style={{ minHeight: '420px' }}>
            {/* Full-width background image with overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${feat.image}')` }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: idx % 2 === 0
                  ? `linear-gradient(135deg, rgba(5,8,17,0.92) 0%, rgba(5,8,17,0.75) 50%, rgba(5,8,17,0.92) 100%)`
                  : `linear-gradient(315deg, rgba(5,8,17,0.92) 0%, rgba(5,8,17,0.75) 50%, rgba(5,8,17,0.92) 100%)`,
              }}
            />

            {/* Content */}
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
              <div className={`grid lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text side */}
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={idx % 2 === 1 ? 'lg:order-2' : ''}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                    style={{ background: feat.color + '15', border: `1px solid ${feat.color}30`, color: feat.color }}>
                    <span className="text-base">{feat.icon}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider">Feature</span>
                  </div>
                  <h2 className="font-orbitron text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4">
                    {feat.title}
                  </h2>
                  <p className="text-slate-300 text-base leading-relaxed mb-6 max-w-lg">
                    {feat.desc}
                  </p>
                  {/* Bullet points */}
                  <div className="space-y-2 mb-6">
                    {feat.bullets.map((b) => (
                      <div key={b} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: feat.color }} />
                        <span className="text-sm text-slate-300">{b}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={feat.id === 'booking' || feat.id === 'seat' ? '/booking' : '/dashboard'}>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 py-3 rounded-xl font-semibold text-sm text-white"
                      style={{ background: feat.color + '20', border: `1px solid ${feat.color}50` }}
                    >
                      Explore {feat.title} →
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Comic Agent side — alternating */}
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className={`flex flex-col items-center ${idx % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  <ComicAgent
                    section={feat.id === 'booking' ? 'booking' : feat.id === 'cricket' ? 'features' : feat.id === 'navigation' ? 'navigation' : 'features'}
                    size="md"
                  />

                  {/* Highlight pills — horizontal scroll */}
                  <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1 w-full max-w-xs">
                    {feat.bullets.map((b) => (
                      <div key={b} className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap"
                        style={{ background: feat.color + '12', border: `1px solid ${feat.color}30`, color: feat.color }}>
                        {b}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── LIVE CRICKET TEASER ─── */}
      <section className="py-16 px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `url('/feat_cricket.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(5,8,17,0.88)' }} />
        <div className="relative max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="glass-strong rounded-3xl p-6 sm:p-10 border border-white/5">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <div className="cricket-live-dot" />
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Live on Dashboard</span>
                </div>
                <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-white mb-4">
                  Never Miss a <span className="gradient-text">Ball</span>
                </h2>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                  Ball-by-ball updates every 4 seconds. Batting stats, wicket alerts, toss results, run rates — right in your dashboard.
                </p>
                {/* Feature tags — horizontal scroll */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {['Ball-by-ball', 'Toss Results', 'Batting Stats', 'Run Rate', 'Wicket Alerts', 'CRR Live'].map(tag => (
                    <span key={tag} className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full glass border border-white/10 text-slate-300">{tag}</span>
                  ))}
                </div>
              </div>
              {/* Mock match card */}
              <div className="glass rounded-2xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">🏆 T20 World Cup 2026</span>
                  <div className="flex items-center gap-1.5">
                    <div className="cricket-live-dot" />
                    <span className="text-[10px] font-bold text-red-400">LIVE</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🇮🇳</div>
                    <div className="font-orbitron font-black text-xl text-white">148<span className="text-slate-500">/4</span></div>
                    <div className="text-[10px] text-slate-400">18.2 ov</div>
                  </div>
                  <div className="text-slate-500 font-bold text-sm">vs</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🇦🇺</div>
                    <div className="font-orbitron font-black text-xl text-slate-400">Yet to bat</div>
                    <div className="text-[10px] text-slate-500">AUS</div>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-3 mt-2">
                  <div className="text-[10px] text-slate-500 mb-1.5">This Over</div>
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                    {['4', '6', 'W', '1', '6', '2'].map((b, i) => (
                      <div key={i} className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold"
                        style={{
                          background: b === 'W' ? 'rgba(239,68,68,0.15)' : b === '6' ? 'rgba(139,92,246,0.2)' : b === '4' ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${b === 'W' ? '#ef444450' : b === '6' ? '#8b5cf650' : b === '4' ? '#00d4ff50' : '#ffffff11'}`,
                          color: b === 'W' ? '#ef4444' : b === '6' ? '#a78bfa' : b === '4' ? '#00d4ff' : '#94a3b8',
                        }}>{b}</div>
                    ))}
                  </div>
                </div>
                <Link to="/dashboard">
                  <motion.button whileHover={{ scale: 1.02 }}
                    className="w-full mt-3 py-2.5 rounded-xl text-xs font-semibold text-white border border-white/10 glass hover:border-cyan-500/30 transition-all">
                    Open Full Dashboard →
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS — horizontal scroll on mobile ─── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-white mb-2">
              Fans <span className="gradient-text">Love It</span>
            </h2>
            <p className="text-slate-400 text-sm">Real experiences from real fans</p>
          </motion.div>
          {/* Horizontal scroll on all screen sizes */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-strong rounded-2xl p-5 border border-white/5 flex-shrink-0 w-64 sm:w-auto"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, idx) => (
                    <span key={idx} className="text-yellow-400 text-xs">★</span>
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t.name}</div>
                    <div className="text-[10px] text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-10 sm:p-14 text-center overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(139,92,246,0.15) 50%, rgba(244,114,182,0.1) 100%), url('/stadium_bg.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(5,8,17,0.78)' }} />
            <div className="relative">
              <div className="text-5xl mb-4">🏟️</div>
              <h2 className="font-orbitron text-2xl sm:text-4xl font-black mb-4">
                Ready for a <span className="gradient-text">frictionless</span> match day?
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-lg mx-auto">
                Join 78,000+ fans who book tickets, track live scores, and arrive stress-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/booking">
                  <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(0,212,255,0.35)' }} whileTap={{ scale: 0.97 }}
                    className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold text-white text-base shadow-xl shadow-cyan-500/20">
                    🎫 Book Tickets →
                  </motion.button>
                </Link>
                {!isLoggedIn && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={openAuthModal}
                    className="px-10 py-4 glass border border-white/10 rounded-2xl font-semibold text-white text-base hover:border-cyan-500/20 transition-colors">
                    🔑 Sign In Free
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <Footer />
    </div>
  );
}
