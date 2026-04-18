import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Generate seating layout for a section
function generateSeats(rows, cols, reservedPct = 0.25) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const rand = Math.random();
      let status = 'available'; // green
      if (rand < reservedPct * 0.5) status = 'sold';     // dark grey
      else if (rand < reservedPct) status = 'reserved';  // orange
      return { id: `R${r + 1}S${c + 1}`, row: r + 1, col: c + 1, status };
    })
  );
}

const STATUS_STYLE = {
  available: { bg: '#22c55e', border: '#16a34a', label: 'Available' },
  reserved:  { bg: '#f97316', border: '#ea580c', label: 'Reserved' },
  sold:      { bg: '#334155', border: '#1e293b', label: 'Sold Out' },
  selected:  { bg: '#00d4ff', border: '#0284c7', label: 'Selected' },
};

const SECTIONS_CONFIG = [
  { id: 'N2', label: 'North Lower', rows: 6, cols: 18, price: 1800, reservedPct: 0.25 },
  { id: 'S2', label: 'South Lower', rows: 6, cols: 18, price: 1800, reservedPct: 0.30 },
  { id: 'E1', label: 'East Stand',  rows: 5, cols: 20, price: 800,  reservedPct: 0.15 },
  { id: 'W1', label: 'West Stand',  rows: 5, cols: 20, price: 800,  reservedPct: 0.20 },
  { id: 'VIP', label: 'VIP Lounge', rows: 4, cols: 12, price: 5000, reservedPct: 0.45 },
  { id: 'PS',  label: 'Pitch Side', rows: 3, cols: 10, price: 3500, reservedPct: 0.60 },
];

function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
      {Object.entries(STATUS_STYLE).map(([k, v]) => (
        <div key={k} className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-sm" style={{ background: v.bg, border: `1px solid ${v.border}` }} />
          <span>{v.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function InteractiveSeatMap({ onSeatsConfirmed }) {
  const [activeSectionId, setActiveSectionId] = useState('N2');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [maxSeats] = useState(8); // max per booking

  // Generate stable seat layouts per section
  const layouts = useMemo(() => {
    const map = {};
    SECTIONS_CONFIG.forEach(sec => { map[sec.id] = generateSeats(sec.rows, sec.cols, sec.reservedPct); });
    return map;
  }, []);

  const activeSection = SECTIONS_CONFIG.find(s => s.id === activeSectionId);
  const layout = layouts[activeSectionId] || [];

  const toggleSeat = (seat) => {
    if (seat.status === 'sold' || seat.status === 'reserved') return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      const key = `${activeSectionId}:${seat.id}`;
      if (next.has(key)) {
        next.delete(key);
      } else {
        if (next.size >= maxSeats) return prev; // limit
        next.add(key);
      }
      return next;
    });
  };

  const selectedInSection = [...selectedIds].filter(k => k.startsWith(activeSectionId + ':'));
  const totalSelected = selectedIds.size;
  const totalPrice = [...selectedIds].reduce((sum, key) => {
    const secId = key.split(':')[0];
    const sec = SECTIONS_CONFIG.find(s => s.id === secId);
    return sum + (sec?.price || 0);
  }, 0);

  const handleConfirm = () => {
    if (totalSelected === 0) return;
    const seats = [...selectedIds].map(key => {
      const [secId, seatId] = key.split(':');
      const sec = SECTIONS_CONFIG.find(s => s.id === secId);
      const [, rowStr, colStr] = seatId.match(/R(\d+)S(\d+)/) || [];
      return { sectionId: secId, sectionLabel: sec?.label, row: rowStr, seat: colStr, price: sec?.price };
    });
    onSeatsConfirmed({ seats, total: totalPrice, section: activeSection });
  };

  // Stadium overview SVG map
  function StadiumOverview() {
    const sections = [
      { id: 'N2', x: 180, y: 10, w: 140, h: 40, label: 'N Lower' },
      { id: 'S2', x: 180, y: 150, w: 140, h: 40, label: 'S Lower' },
      { id: 'E1', x: 340, y: 50, w: 40, h: 100, label: 'E' },
      { id: 'W1', x: 120, y: 50, w: 40, h: 100, label: 'W' },
      { id: 'VIP', x: 195, y: 50, w: 50, h: 35, label: 'VIP' },
      { id: 'PS', x: 255, y: 50, w: 50, h: 35, label: 'PS' },
    ];
    return (
      <div className="glass rounded-xl p-3 mb-4 border border-white/5">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Stadium Map — Select a Section</div>
        <div className="overflow-x-auto scrollbar-hide">
          <svg viewBox="0 0 500 210" className="w-full max-w-sm mx-auto" style={{ minWidth: 280 }}>
            <ellipse cx="250" cy="103" rx="125" ry="88" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.15)" strokeWidth="1" />
            <text x="250" y="108" textAnchor="middle" fill="rgba(34,197,94,0.5)" fontSize="10" fontFamily="Orbitron">PITCH</text>
            {sections.map(s => {
              const sec = SECTIONS_CONFIG.find(sc => sc.id === s.id);
              const isActive = activeSectionId === s.id;
              const color = isActive ? '#00d4ff' : '#475569';
              return (
                <g key={s.id} onClick={() => { setActiveSectionId(s.id); setSelectedIds(new Set()); }} style={{ cursor: 'pointer' }}>
                  <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="6"
                    fill={isActive ? 'rgba(0,212,255,0.18)' : 'rgba(255,255,255,0.04)'}
                    stroke={color} strokeWidth={isActive ? 2 : 1} />
                  <text x={s.x + s.w / 2} y={s.y + s.h / 2 - 4} textAnchor="middle" fill={color} fontSize="9" fontWeight="bold" fontFamily="Arial">{s.label}</text>
                  <text x={s.x + s.w / 2} y={s.y + s.h / 2 + 8} textAnchor="middle" fill={isActive ? '#00d4ff' : '#64748b'} fontSize="8" fontFamily="Arial">₹{sec?.price?.toLocaleString()}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StadiumOverview />

      {/* Section tabs — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
        {SECTIONS_CONFIG.map(sec => (
          <button
            key={sec.id}
            onClick={() => { setActiveSectionId(sec.id); }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: activeSectionId === sec.id ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activeSectionId === sec.id ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: activeSectionId === sec.id ? '#00d4ff' : '#94a3b8',
            }}
          >
            {sec.label} · ₹{sec.price.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Seat grid — scrollable horizontally */}
      <div className="glass rounded-xl p-3 sm:p-4 mb-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-sm font-bold text-white">{activeSection?.label}</span>
            <span className="text-xs text-slate-400 ml-2">₹{activeSection?.price?.toLocaleString()} / seat</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>🎯 PITCH SIDE ↓</span>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="inline-block min-w-full">
            {layout.map((row, rowIdx) => {
              const rowNum = rowIdx + 1;
              return (
                <div key={rowIdx} className="flex items-center gap-1 mb-1">
                  {/* Row label */}
                  <div className="w-5 text-[9px] text-slate-600 text-right flex-shrink-0">{rowNum}</div>
                  <div className="w-1 flex-shrink-0" />
                  {/* Seats */}
                  {row.map((seat) => {
                    const key = `${activeSectionId}:${seat.id}`;
                    const isSelected = selectedIds.has(key);
                    const style = isSelected ? STATUS_STYLE.selected : STATUS_STYLE[seat.status];
                    return (
                      <motion.button
                        key={seat.id}
                        whileHover={seat.status === 'available' || isSelected ? { scale: 1.25, zIndex: 10 } : {}}
                        whileTap={seat.status === 'available' || isSelected ? { scale: 0.9 } : {}}
                        onClick={() => toggleSeat(seat)}
                        title={`Row ${seat.row}, Seat ${seat.col} — ${style.label}`}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm flex-shrink-0 relative"
                        style={{
                          background: style.bg,
                          border: `1px solid ${style.border}`,
                          cursor: seat.status === 'sold' || seat.status === 'reserved' ? 'not-allowed' : 'pointer',
                          opacity: seat.status === 'sold' ? 0.4 : 1,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">✓</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5">
          <SeatLegend />
        </div>
      </div>

      {/* Selection summary */}
      <AnimatePresence>
        {totalSelected > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass rounded-xl p-4 mb-4 border border-cyan-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">{totalSelected} seat{totalSelected > 1 ? 's' : ''} selected</span>
              <span className="font-orbitron font-bold text-cyan-400">₹{totalPrice.toLocaleString()}</span>
            </div>
            {/* Selected seat chips — horizontal scroll */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {[...selectedIds].map(key => {
                const [secId, seatId] = key.split(':');
                const sec = SECTIONS_CONFIG.find(s => s.id === secId);
                const [, r, s] = seatId.match(/R(\d+)S(\d+)/) || [];
                return (
                  <div key={key} className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                    <span>{sec?.label?.split(' ')[0]} R{r}S{s}</span>
                    <button
                      onClick={() => setSelectedIds(prev => { const n = new Set(prev); n.delete(key); return n; })}
                      className="text-slate-400 hover:text-white ml-0.5"
                    >×</button>
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] text-slate-500 mt-2">Max {maxSeats} seats per booking</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: totalSelected > 0 ? 1.02 : 1 }}
        whileTap={{ scale: totalSelected > 0 ? 0.97 : 1 }}
        onClick={handleConfirm}
        disabled={totalSelected === 0}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
        style={{
          background: totalSelected > 0 ? 'linear-gradient(135deg, #00d4ff, #8b5cf6)' : 'rgba(255,255,255,0.05)',
          color: totalSelected > 0 ? '#fff' : '#475569',
          cursor: totalSelected > 0 ? 'pointer' : 'not-allowed',
          boxShadow: totalSelected > 0 ? '0 8px 30px rgba(0,212,255,0.25)' : 'none',
        }}
      >
        {totalSelected > 0
          ? `Continue with ${totalSelected} seat${totalSelected > 1 ? 's' : ''} — ₹${totalPrice.toLocaleString()} →`
          : 'Click seats above to select'}
      </motion.button>
    </div>
  );
}
