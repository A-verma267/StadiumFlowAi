import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSimulation } from '../hooks/useSimulation';
import useAppStore from '../context/AppContext';
import Heatmap from '../components/Heatmap';
import RouteSuggestion from '../components/RouteSuggestion';
import QueuePanel from '../components/QueuePanel';
import AlertBanner from '../components/AlertBanner';
import FloatingCard from '../components/FloatingCard';
import LiveCricket from '../components/LiveCricket';
import FoodOrder from '../components/FoodOrder';
import { SeatPreferenceForm } from '../components/TicketCard';
import ComicAgent from '../components/ComicAgent';
import { calcOverallRisk } from '../utils/predictionEngine';

// ──── Mini AI Agent notification bubble ────
function MiniAIAgent({ message, visible, onDismiss }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
        >
          {/* Speech bubble */}
          <div
            className="relative px-4 py-3 rounded-2xl rounded-br-none text-xs font-medium text-white max-w-[220px] shadow-2xl"
            style={{
              background: 'rgba(10,15,30,0.97)',
              border: '1.5px solid rgba(0,212,255,0.4)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="text-[10px] text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />AI Update
            </div>
            {message}
            <button
              onClick={onDismiss}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-white"
              style={{ background: 'rgba(15,20,40,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
            >×</button>
            {/* Tail */}
            <div className="absolute -bottom-2.5 right-4"
              style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '4px solid transparent', borderTop: '12px solid rgba(0,212,255,0.4)' }} />
          </div>
          {/* Mini character icon */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex-shrink-0"
          >
            <div
              className="w-14 h-14 rounded-full overflow-hidden border-2 shadow-xl cursor-pointer"
              style={{ borderColor: 'rgba(0,212,255,0.5)', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}
              onClick={onDismiss}
            >
              <img src="/ai_guide.png" alt="AI Guide" className="w-full h-full object-cover object-top" />
            </div>
            <div className="text-[9px] text-cyan-400 text-center mt-0.5 font-medium">AI Guide</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ──── Seat Input Modal (for users who didn't book via website) ────
function SeatInputModal({ onClose, onSubmit }) {
  const [section, setSection] = useState('');
  const [row, setRow] = useState('');
  const [seat, setSeat] = useState('');

  const sections = [
    'North Upper', 'North Lower', 'South Upper', 'South Lower',
    'East Stand', 'West Stand', 'VIP Lounge', 'Pitch Side',
  ];

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 30 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        className="relative w-full max-w-md mx-4"
        style={{
          background: 'rgba(10, 15, 30, 0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all text-xl">
          ×
        </button>

        {/* Comic agent */}
        <div className="flex justify-center mb-4">
          <ComicAgent section="navigation" size="sm" />
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-1">Where's Your Seat?</h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          Enter your seat details so I can guide you to the best route and entry gate
        </p>

        <div className="space-y-3 mb-5">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Section / Stand</label>
            <select
              value={section}
              onChange={e => setSection(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white glass border border-white/10 focus:border-cyan-500/50 outline-none transition-all"
              style={{ background: '#0a0f1e' }}
            >
              <option value="" style={{ background: '#0a0f1e' }}>— Select Section —</option>
              {sections.map(s => (
                <option key={s} value={s} style={{ background: '#0a0f1e' }}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Row Number</label>
              <input
                type="number" min="1" max="50"
                value={row} onChange={e => setRow(e.target.value)}
                placeholder="e.g. 12"
                className="w-full px-4 py-3 rounded-xl text-sm text-white glass border border-white/10 focus:border-cyan-500/50 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Seat Number</label>
              <input
                type="number" min="1" max="100"
                value={seat} onChange={e => setSeat(e.target.value)}
                placeholder="e.g. 34"
                className="w-full px-4 py-3 rounded-xl text-sm text-white glass border border-white/10 focus:border-cyan-500/50 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: (section && row && seat) ? 1.03 : 1 }}
          whileTap={{ scale: (section && row && seat) ? 0.97 : 1 }}
          onClick={() => { if (section && row && seat) { onSubmit({ section, row, seat }); onClose(); } }}
          disabled={!section || !row || !seat}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all"
          style={{
            background: (section && row && seat) ? 'linear-gradient(135deg, #00d4ff, #8b5cf6)' : 'rgba(255,255,255,0.05)',
            color: (section && row && seat) ? '#fff' : '#475569',
            cursor: (section && row && seat) ? 'pointer' : 'not-allowed',
            boxShadow: (section && row && seat) ? '0 8px 30px rgba(0,212,255,0.25)' : 'none',
          }}
        >
          Show My Route & Gate →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ──── AI Seat Recommendation Panel ────
function SeatRecommendationPanel({ seatInfo, fromBooking = false }) {
  // Simulate AI recommendations based on section
  const gateMap = {
    'North Upper': { gate: 'Gate C', walk: '4 min', distance: '320m', best: 'Via North Tunnel' },
    'North Lower': { gate: 'Gate C', walk: '3 min', distance: '240m', best: 'Via Ground Floor' },
    'South Upper': { gate: 'Gate B', walk: '5 min', distance: '380m', best: 'Via South Stairs' },
    'South Lower': { gate: 'Gate B', walk: '4 min', distance: '290m', best: 'Via South Ramp' },
    'East Stand':  { gate: 'Gate D', walk: '6 min', distance: '450m', best: 'Via East Corridor' },
    'West Stand':  { gate: 'Gate A', walk: '7 min', distance: '510m', best: 'Via West Concourse' },
    'VIP Lounge':  { gate: 'Gate VIP', walk: '2 min', distance: '120m', best: 'Direct VIP Access' },
    'Pitch Side':  { gate: 'Gate PS', walk: '3 min', distance: '180m', best: 'Pitch Side Entry' },
  };

  const section = seatInfo?.section || seatInfo?.sectionLabel || 'North Lower';
  const rec = gateMap[section] || gateMap['North Lower'];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🧭</span>
        <h3 className="text-sm font-bold text-white">AI Route to Your Seat</h3>
        {fromBooking && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 ml-auto">
            ✓ Auto from booking
          </span>
        )}
      </div>

      {/* Seat info */}
      <div className="flex items-center gap-2 p-3 rounded-xl mb-3"
        style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
        <span className="text-xl">💺</span>
        <div>
          <div className="text-xs text-slate-400">Your Seat</div>
          <div className="text-sm font-bold text-white">{section} · Row {seatInfo?.row} · Seat {seatInfo?.seat}</div>
        </div>
      </div>

      {/* Recommendation cards — horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-3">
        {[
          { icon: '🚪', label: 'Best Gate', value: rec.gate, color: '#00d4ff' },
          { icon: '🚶', label: 'Walk Time', value: rec.walk, color: '#22c55e' },
          { icon: '📏', label: 'Distance', value: rec.distance, color: '#8b5cf6' },
          { icon: '🛤️', label: 'Route', value: rec.best, color: '#f59e0b' },
        ].map(r => (
          <div key={r.label} className="flex-shrink-0 p-3 rounded-xl min-w-[100px] text-center"
            style={{ background: r.color + '10', border: `1px solid ${r.color}25` }}>
            <div className="text-lg mb-1">{r.icon}</div>
            <div className="text-[10px] text-slate-400 mb-0.5">{r.label}</div>
            <div className="text-xs font-bold" style={{ color: r.color }}>{r.value}</div>
          </div>
        ))}
      </div>

      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-[10px] text-emerald-400 flex items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        AI guidance active · Updates every 3s
      </motion.div>
    </div>
  );
}

// ──── Live Cricket Horizontal Banner ────
function LiveCricketBanner() {
  const [state, setState] = useState(() => {
    const match = { id: 1, team1: { name: 'India', short: 'IND', flag: '🇮🇳' }, team2: { name: 'Australia', short: 'AUS', flag: '🇦🇺' }, format: 'T20 World Cup', venue: 'Narendra Modi Stadium' };
    const batPool = ['V. Kohli', 'R. Sharma'];
    const bowlPool = ['P. Cummins', 'M. Starc'];
    return {
      match,
      score: Math.floor(Math.random() * 60) + 80,
      wickets: Math.floor(Math.random() * 3),
      balls: Math.floor(Math.random() * 24) + 24,
      batter1: { name: batPool[0], runs: Math.floor(Math.random() * 50) + 30, balls: Math.floor(Math.random() * 40) + 25, onStrike: true },
      batter2: { name: batPool[1], runs: Math.floor(Math.random() * 30) + 10, balls: Math.floor(Math.random() * 25) + 12, onStrike: false },
      bowler: { name: bowlPool[0], wickets: Math.floor(Math.random() * 2), runs: Math.floor(Math.random() * 25) + 10, overs: Math.floor(Math.random() * 3) + 1 },
      tossWinner: 'India', tossChoice: 'Bat',
      lastOver: ['1', '4', '2', '0', '6', '1'],
    };
  });
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        const runs = Math.floor(Math.random() * 4);
        const isWicket = Math.random() < 0.06;
        const ball = isWicket ? 'W' : (runs === 4 ? '4' : runs === 6 ? '6' : String(runs));
        const lastOver = [...prev.lastOver.slice(-5), ball];
        return {
          ...prev,
          score: prev.score + (isWicket ? 0 : runs),
          wickets: Math.min(10, prev.wickets + (isWicket ? 1 : 0)),
          balls: prev.balls + 1,
          batter1: prev.batter1.onStrike ? { ...prev.batter1, runs: prev.batter1.runs + (isWicket ? 0 : runs), balls: prev.batter1.balls + 1 } : prev.batter1,
          batter2: !prev.batter1.onStrike ? { ...prev.batter2, runs: prev.batter2.runs + (isWicket ? 0 : runs), balls: prev.batter2.balls + 1 } : prev.batter2,
          lastOver,
        };
      });
      if (Math.random() > 0.3) { setFlashing(true); setTimeout(() => setFlashing(false), 500); }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const { match, score, wickets, balls, batter1, batter2, bowler, tossWinner, tossChoice, lastOver } = state;
  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
  const crr = balls > 0 ? ((score / balls) * 6).toFixed(1) : '0.0';

  const ballColor = (v) => v === 'W' ? '#ef4444' : v === '6' ? '#a78bfa' : v === '4' ? '#00d4ff' : v === '0' ? '#475569' : '#4ade80';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl border border-emerald-500/15 mb-4 sm:mb-6 overflow-hidden"
      style={{ background: 'rgba(34,197,94,0.03)' }}
    >
      <div className="flex items-stretch gap-0 divide-x divide-white/5 overflow-x-auto scrollbar-hide">

        {/* ── Match Header ── */}
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-400 uppercase">Live</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white whitespace-nowrap">🏏 {match.format}</div>
            <div className="text-[10px] text-slate-500 whitespace-nowrap">📍 {match.venue}</div>
          </div>
        </div>

        {/* ── Score ── */}
        <div className="flex items-center gap-4 px-5 py-3 flex-shrink-0">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 mb-0.5">{match.team1.flag} {match.team1.name}</div>
            <motion.div
              className="font-orbitron font-black text-xl leading-none text-white"
              animate={flashing ? { scale: [1, 1.1, 1], color: ['#ffffff', '#22c55e', '#ffffff'] } : {}}
              transition={{ duration: 0.4 }}
            >
              {score}/{wickets}
            </motion.div>
            <div className="text-[10px] text-slate-500 font-orbitron mt-0.5">{overs} ov</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-slate-600 mb-0.5">vs</div>
            <div className="text-[10px] px-2 py-0.5 rounded glass text-slate-400 whitespace-nowrap">CRR {crr}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-slate-400 mb-0.5">{match.team2.flag} {match.team2.name}</div>
            <div className="font-orbitron font-black text-sm text-slate-500">Yet to bat</div>
          </div>
        </div>

        {/* ── Toss ── */}
        <div className="flex items-center px-4 py-3 flex-shrink-0">
          <div>
            <div className="text-[10px] text-slate-500 mb-1">Toss</div>
            <div className="text-[11px] text-slate-400 whitespace-nowrap">
              🪙 <span className="text-cyan-400">{tossWinner}</span> won · chose <span className="text-white font-medium">{tossChoice}</span>
            </div>
          </div>
        </div>

        {/* ── Batting ── */}
        <div className="flex flex-col justify-center px-4 py-3 min-w-[180px] flex-shrink-0">
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1.5">Batting</div>
          {[batter1, batter2].map((b, i) => (
            <div key={i} className={`flex items-center justify-between py-0.5 px-1.5 rounded ${b.onStrike ? 'bg-cyan-500/8' : ''}`}>
              <div className="flex items-center gap-1">
                {b.onStrike && <span className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0" />}
                <span className={`text-[11px] whitespace-nowrap ${b.onStrike ? 'text-white font-semibold' : 'text-slate-400'}`}>
                  {b.name}{b.onStrike ? ' *' : ''}
                </span>
              </div>
              <div className="flex items-center gap-1.5 ml-3">
                <span className="text-xs font-orbitron font-bold text-white">{b.runs}</span>
                <span className="text-[10px] text-slate-500">({b.balls})</span>
                {b.balls > 0 && <span className="text-[9px] text-emerald-400">{((b.runs / b.balls) * 100).toFixed(0)} SR</span>}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bowler ── */}
        <div className="flex flex-col justify-center px-4 py-3 flex-shrink-0">
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1.5">Bowling</div>
          <div className="flex items-center gap-2">
            <span className="text-xs">🎳</span>
            <span className="text-[11px] text-slate-300 whitespace-nowrap">{bowler.name}</span>
          </div>
          <div className="text-[11px] text-white font-bold mt-0.5">
            {bowler.wickets}-{bowler.runs} <span className="text-[10px] text-slate-500 font-normal">({bowler.overs} ov)</span>
          </div>
        </div>

        {/* ── This Over ── */}
        <div className="flex flex-col justify-center px-4 py-3 flex-shrink-0">
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">This Over</div>
          <div className="flex items-center gap-1.5">
            {lastOver.map((v, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: ballColor(v) + '22', border: `1px solid ${ballColor(v)}66`, color: ballColor(v) }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// ──── Stat Card ────
function StatCard({ label, value, unit, icon, color, delay }) {
  const colorMap = {
    blue:   'from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-400',
    purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400',
    green:  'from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 text-emerald-400',
    orange: 'from-orange-500/10 to-yellow-500/10 border-orange-500/20 text-orange-400',
  };
  const textColor = colorMap[color]?.split(' ').pop() || 'text-white';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 border bg-gradient-to-br ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-xl sm:text-2xl">{icon}</span>
        <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider">Live</span>
      </div>
      <motion.div
        className={`font-orbitron text-xl sm:text-3xl font-black ${textColor}`}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {value}
        {unit && <span className="text-sm sm:text-lg font-medium ml-1">{unit}</span>}
      </motion.div>
      <div className="text-[10px] sm:text-xs text-slate-400 mt-1">{label}</div>
    </motion.div>
  );
}

function AIStatusBar() {
  const isAIThinking = useAppStore((s) => s.isAIThinking);
  const aiConfidence = useAppStore((s) => s.aiConfidence);
  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-500 ${
        isAIThinking ? 'glass border-yellow-500/30 bg-yellow-500/5' : 'glass border-emerald-500/20 bg-emerald-500/5'
      }`}
    >
      <motion.div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${isAIThinking ? 'bg-yellow-400' : 'bg-emerald-400'}`}
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${isAIThinking ? 'text-yellow-400' : 'text-emerald-400'}`}>
        {isAIThinking ? 'AI thinking…' : `AI active — ${aiConfidence}% confidence`}
      </span>
    </motion.div>
  );
}

export default function Dashboard() {
  useSimulation(true);
  const gates          = useAppStore((s) => s.gates);
  const alerts         = useAppStore((s) => s.alerts);
  const userProfile    = useAppStore((s) => s.userProfile);
  const totalAttendees = useAppStore((s) => s.totalAttendees);
  const user           = useAppStore((s) => s.user);
  const bookingHistory = useAppStore((s) => s.bookingHistory);
  const setSeatPreference = useAppStore((s) => s.setSeatPreference);
  const seatPreference = useAppStore((s) => s.seatPreference);

  const [showSeatModal, setShowSeatModal] = useState(false);
  const [manualSeat, setManualSeat] = useState(null);
  // ✅ Fixed: was referenced but never declared — caused a runtime ReferenceError
  const [agentVisible, setAgentVisible] = useState(false);

  const overallRisk   = calcOverallRisk(gates);
  const criticalGates = gates.filter((g) => g.density >= 85).length;
  const displayName   = user?.name || userProfile.name;

  // Show the AI mini-agent bubble after 5s, then cycle every 30s
  useEffect(() => {
    const show = setTimeout(() => setAgentVisible(true), 5000);
    const cycle = setInterval(() => {
      setAgentVisible(true);
    }, 30000);
    return () => { clearTimeout(show); clearInterval(cycle); };
  }, []);

  // Determine if user has a seat from booking or manual input
  const latestBooking = bookingHistory[0];
  const activeSeat = latestBooking
    ? { section: latestBooking.section, sectionLabel: latestBooking.section, row: latestBooking.row, seat: latestBooking.seat, fromBooking: true }
    : manualSeat
    ? { ...manualSeat, fromBooking: false }
    : null;

  const handleManualSeat = (data) => {
    setManualSeat(data);
    setSeatPreference(data);
  };

  return (
    <div className="min-h-screen animated-bg pt-16 sm:pt-20 pb-10 sm:pb-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-8 pt-4 sm:pt-0">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="font-orbitron text-xl sm:text-2xl md:text-3xl font-black text-white">
              Stadium <span className="gradient-text">Intelligence</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-slate-400">{userProfile.event} · {userProfile.stadium}</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full glass border border-white/10 text-slate-400">{userProfile.ticketId}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                👤 {displayName}
              </span>
            </div>
          </motion.div>
          <AIStatusBar />
        </div>

        {/* ─── Live Cricket Horizontal Banner (replaces stat cards at top) ─── */}
        <LiveCricketBanner />

        {/* ─── Seat Input Modal ─── */}
        <AnimatePresence>
          {showSeatModal && (
            <SeatInputModal
              onClose={() => setShowSeatModal(false)}
              onSubmit={handleManualSeat}
            />
          )}
        </AnimatePresence>

        {/* ─── Mini AI Agent floating bubble ─── */}
        <MiniAIAgent
          message={alerts[0]?.message || 'All gates clear. Great time to head in!'}
          visible={agentVisible}
          onDismiss={() => setAgentVisible(false)}
        />

        {/* ─── Main Content Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* ══════════════════════════════════════
              LEFT / MAIN COLUMN — Navigation Hub
              (2/3 width — the primary purpose)
          ══════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">

            {/* ── Seat guidance banner OR active seat strip ── */}
            {!activeSeat ? (
              /* No seat yet → prompt user */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl border border-cyan-500/20 p-4 sm:p-5"
                style={{ background: 'rgba(0,212,255,0.04)' }}
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                      🧭
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white mb-0.5">Where's your seat?</div>
                      <div className="text-xs text-slate-400 leading-relaxed">
                        Book a ticket or enter your seat number so the AI can guide you to the best gate, route, and entry point in real time.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setShowSeatModal(true)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-white"
                      style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}
                    >
                      Enter Seat No. →
                    </motion.button>
                    <Link to="/booking">
                      <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
                      >
                        🎫 Book Now
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Seat is known → show the confirmed ticket strip */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl sm:rounded-2xl border border-emerald-500/20 p-3 sm:p-4"
                style={{ background: 'rgba(34,197,94,0.04)' }}
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-hide">
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-base sm:text-lg">🎫</div>
                    <div>
                      <div className="text-[10px] text-slate-400">Your Seat</div>
                      <div className="font-bold text-white text-xs sm:text-sm">
                        {activeSeat.section} · Row {activeSeat.row} · Seat {activeSeat.seat}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-[10px] text-slate-400">Arrival</div>
                    <div className="font-bold text-cyan-400 text-sm font-orbitron">{userProfile.arrivalTime}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-[10px] text-slate-400">Match Start</div>
                    <div className="font-bold text-white text-sm font-orbitron">{userProfile.matchStart}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-[10px] text-slate-400">Fan</div>
                    <div className="font-bold text-white text-xs sm:text-sm">{displayName}</div>
                  </div>
                  <div className="sm:ml-auto flex-shrink-0 flex gap-2 items-center">
                    {activeSeat.fromBooking && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400">
                        ✓ Booked via StadiumFlow
                      </span>
                    )}
                    <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}
                      className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] sm:text-xs text-emerald-400 font-medium whitespace-nowrap">
                      ✓ AI guiding you
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── AI Seat Recommendation (main navigation card) ── */}
            <FloatingCard glow="cyan" className="p-4 sm:p-6">
              {activeSeat ? (
                <SeatRecommendationPanel seatInfo={activeSeat} fromBooking={activeSeat.fromBooking} />
              ) : (
                <div className="text-center py-6">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-5xl mb-4"
                  >🧭</motion.div>
                  <div className="text-base font-bold text-white mb-2">AI Navigation Waiting</div>
                  <div className="text-xs text-slate-400 mb-4 max-w-xs mx-auto leading-relaxed">
                    Once you enter your seat number or complete a booking, the AI will instantly calculate your optimal gate, route, and walking time.
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowSeatModal(true)}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(0,212,255,0.3)' }}
                  >
                    Enter Seat Number →
                  </motion.button>
                </div>
              )}
            </FloatingCard>

            {/* ── AI Route Suggestion ── */}
            <FloatingCard glow="blue" className="p-4 sm:p-5">
              <RouteSuggestion seatKnown={!!activeSeat} onEnterSeat={() => setShowSeatModal(true)} />
            </FloatingCard>

            {/* ── Queue + Food side by side on desktop ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FloatingCard glow="purple" className="p-4 sm:p-5">
                <QueuePanel />
              </FloatingCard>
              <FloatingCard glow="cyan" className="p-4 sm:p-5">
                <FoodOrder />
              </FloatingCard>
            </div>

            {/* Live Cricket moved to top banner strip — removed from here */}
          </div>

          {/* ══════════════════════════════════════
              RIGHT SIDEBAR — Stadium Overview
              (1/3 width — supplementary intel)
          ══════════════════════════════════════ */}
          <div className="space-y-4 sm:space-y-6">

            {/* 💺 Seat Preference */}
            <FloatingCard glow="purple" className="p-3 sm:p-5">
              <SeatPreferenceForm />
            </FloatingCard>

            {/* 🗺️ Stadium Heatmap */}
            <FloatingCard glow="blue" className="p-3 sm:p-5">
              <Heatmap />
            </FloatingCard>

            {/* 🚪 Gate Status */}
            <FloatingCard glow="blue" className="p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🚪</span>
                <h3 className="text-sm font-semibold text-white">Gate Status</h3>
                <span className="ml-auto text-[10px] text-slate-500">Real-time</span>
              </div>
              <div className="space-y-3">
                {gates.map((gate, i) => {
                  const color = gate.density >= 85 ? '#ef4444' : gate.density >= 65 ? '#f97316' : gate.density >= 40 ? '#eab308' : '#22c55e';
                  return (
                    <motion.div key={gate.id} layout>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ color, backgroundColor: color + '22' }}>{gate.id}</span>
                          <span className="text-xs text-slate-300">{gate.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{gate.people.toLocaleString()} ppl</span>
                          <motion.span className="text-xs font-bold font-orbitron" style={{ color }}
                            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
                            {Math.round(gate.density)}%
                          </motion.span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                          animate={{ width: `${gate.density}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </FloatingCard>

            {/* 🚨 Live Alerts */}
            <FloatingCard className="p-3 sm:p-5">
              <AlertBanner />
            </FloatingCard>
          </div>

        </div>

        {/* ─── Stat Cards — moved to bottom of dashboard ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-8 flex gap-3 overflow-x-auto scrollbar-hide pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:gap-4"
        >
          <div className="flex-shrink-0 w-40 sm:w-auto">
            <StatCard label="Total Attendees" value={totalAttendees.toLocaleString()} icon="👥" color="blue" delay={0.55} />
          </div>
          <div className="flex-shrink-0 w-40 sm:w-auto">
            <StatCard label="Crowd Risk" value={overallRisk} unit="%" icon="📊" color={overallRisk > 75 ? 'orange' : 'green'} delay={0.6} />
          </div>
          <div className="flex-shrink-0 w-40 sm:w-auto">
            <StatCard label="Critical Gates" value={criticalGates} icon="🚨" color={criticalGates > 0 ? 'orange' : 'green'} delay={0.65} />
          </div>
          <div className="flex-shrink-0 w-40 sm:w-auto">
            <StatCard label="Active Alerts" value={alerts.length} icon="⚡" color="purple" delay={0.7} />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
