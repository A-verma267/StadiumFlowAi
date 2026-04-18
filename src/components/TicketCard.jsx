import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../context/AppContext';
import FloatingCard from '../components/FloatingCard';

// ──── Ticket Card ────
function TicketCard({ booking }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
      className="ticket-gradient rounded-2xl p-5 relative"
      style={{ perspective: '800px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] text-cyan-400 uppercase tracking-widest mb-0.5">Official Ticket</div>
          <div className="font-orbitron font-black text-lg text-white">{booking.match}</div>
        </div>
        <div className="text-3xl">🏟️</div>
      </div>

      {/* Details row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-[10px] text-slate-400">Section</div>
          <div className="text-sm font-bold text-white">{booking.section}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Row</div>
          <div className="text-sm font-bold text-white">{booking.row}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Seat</div>
          <div className="text-sm font-bold text-white">{booking.seat}</div>
        </div>
      </div>

      {/* Perforation line */}
      <div className="flex items-center gap-2 my-3">
        <div className="flex-1 border-t border-dashed border-white/10" />
        <span className="text-xs text-slate-500">✄</span>
        <div className="flex-1 border-t border-dashed border-white/10" />
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-400">Fan</div>
          <div className="text-sm font-semibold text-white">{booking.fan}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">Booking ID</div>
          <div className="text-xs font-mono text-cyan-400">{booking.id}</div>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-[1px]" style={{ background: Math.random() > 0.5 ? '#00d4ff' : 'transparent' }} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400">
        <span className="w-3 h-3 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-[8px]">✓</span>
        <span>Valid ticket • Powered by StadiumFlow AI</span>
      </div>
    </motion.div>
  );
}

// ──── Seat Preference Form ────
function SeatPreferenceForm() {
  const seatPreference = useAppStore((s) => s.seatPreference);
  const setSeatPreference = useAppStore((s) => s.setSeatPreference);
  const [form, setForm] = useState(seatPreference || { section: 'N1', row: '12', seat: '34' });
  const [saved, setSaved] = useState(false);

  const sections = [
    { id: 'N1', label: 'North Upper' },
    { id: 'N2', label: 'North Lower' },
    { id: 'S1', label: 'South Upper' },
    { id: 'S2', label: 'South Lower' },
    { id: 'E1', label: 'East Stand' },
    { id: 'W1', label: 'West Stand' },
    { id: 'VIP', label: 'VIP Lounge' },
  ];

  const handleSave = () => {
    setSeatPreference(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">💺</span>
        <h3 className="text-sm font-semibold text-white">My Seat Preference</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-[10px] text-slate-400 mb-1 block">Section</label>
          <select
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg text-xs text-white glass border border-white/10 focus:border-cyan-500/50 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id} style={{ background: '#0a0f1e' }}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-400 mb-1 block">Row</label>
          <input
            type="number"
            min="1"
            max="50"
            value={form.row}
            onChange={(e) => setForm({ ...form, row: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg text-xs text-white glass border border-white/10 focus:border-cyan-500/50 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 mb-1 block">Seat No.</label>
          <input
            type="number"
            min="1"
            max="100"
            value={form.seat}
            onChange={(e) => setForm({ ...form, seat: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg text-xs text-white glass border border-white/10 focus:border-cyan-500/50 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className="w-full py-2 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: saved
            ? 'rgba(34,197,94,0.15)'
            : 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))',
          border: saved ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(0,212,255,0.2)',
          color: saved ? '#22c55e' : '#00d4ff',
        }}
      >
        {saved ? '✓ Preference Saved!' : 'Save Seat Preference'}
      </motion.button>
      {seatPreference && (
        <div className="mt-2 text-[10px] text-slate-500 text-center">
          Current: {sections.find(s => s.id === seatPreference.section)?.label} · Row {seatPreference.row} · Seat {seatPreference.seat}
        </div>
      )}
    </div>
  );
}

export { TicketCard, SeatPreferenceForm };
