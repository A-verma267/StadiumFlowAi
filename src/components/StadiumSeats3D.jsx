import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../context/AppContext';

// ─── Stadium Seat Data ────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'N-UP', label: 'North Upper', short: 'N-UP', color: '#3b82f6', rows: 8, cols: 18, basePrice: 45 },
  { id: 'N-LO', label: 'North Lower', short: 'N-LO', color: '#06b6d4', rows: 6, cols: 20, basePrice: 85 },
  { id: 'S-UP', label: 'South Upper', short: 'S-UP', color: '#8b5cf6', rows: 8, cols: 18, basePrice: 45 },
  { id: 'S-LO', label: 'South Lower', short: 'S-LO', color: '#a855f7', rows: 6, cols: 20, basePrice: 85 },
  { id: 'E',    label: 'East Stand',  short: 'E',    color: '#f59e0b', rows: 10, cols: 14, basePrice: 65 },
  { id: 'W',    label: 'West Stand',  short: 'W',    color: '#10b981', rows: 10, cols: 14, basePrice: 65 },
  { id: 'VIP',  label: 'VIP Lounge',  short: 'VIP',  color: '#f43f5e', rows: 3, cols: 12, basePrice: 250 },
];

function getSeatStatus(sectionId, row, col, density, selectedSeat) {
  const key = `${sectionId}-${row}-${col}`;
  if (selectedSeat === key) return 'selected';
  // Deterministic pseudo-random using key hash
  const hash = (sectionId.charCodeAt(0) * 31 + row * 17 + col * 7) % 100;
  if (hash < density * 0.72) return 'taken';
  if (hash < density * 0.82) return 'reserved';
  return 'available';
}

const STATUS_STYLE = {
  available: { bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/60', label: 'Available' },
  taken:     { bg: 'bg-slate-700',   shadow: 'shadow-slate-700/40',   label: 'Taken'     },
  reserved:  { bg: 'bg-amber-500',   shadow: 'shadow-amber-500/60',   label: 'Reserved'  },
  selected:  { bg: 'bg-cyan-400',    shadow: 'shadow-cyan-400/80',    label: 'Your Seat' },
};

function Seat3D({ status, onClick, isHighlight }) {
  const s = STATUS_STYLE[status];
  const canClick = status === 'available';
  return (
    <div
      onClick={canClick ? onClick : undefined}
      className={`relative group ${canClick ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      style={{ perspective: '120px' }}
    >
      {/* Seat back */}
      <div
        className={`
          w-4 h-3.5 sm:w-5 sm:h-4 rounded-t-md ${s.bg} transition-all duration-200
          ${canClick ? 'group-hover:-translate-y-0.5 group-hover:brightness-125' : ''}
          ${isHighlight ? 'ring-1 ring-cyan-300 ring-offset-1 ring-offset-transparent' : ''}
        `}
        style={{
          transform: 'rotateX(-15deg)',
          boxShadow: canClick ? `0 3px 12px var(--tw-shadow-color, rgba(0,0,0,0.4))` : 'none',
        }}
      />
      {/* Seat base */}
      <div
        className={`w-4 sm:w-5 h-0.5 ${s.bg} opacity-60 rounded-b-sm`}
        style={{ transform: 'rotateX(40deg)', marginTop: '-1px' }}
      />
    </div>
  );
}

function SectionView({ section, density, userSeatId, onSeatPick }) {
  const [selectedSeat, setSelectedSeat] = useState(userSeatId || null);

  const handleClick = (key) => {
    setSelectedSeat(key);
    onSeatPick(key, section);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col items-center gap-1 min-w-max mx-auto py-2">
        {Array.from({ length: section.rows }, (_, r) => (
          <div key={r} className="flex items-center gap-1">
            <span className="text-[9px] sm:text-[10px] text-slate-600 w-4 text-right mr-1 font-mono">{r + 1}</span>
            {Array.from({ length: section.cols }, (_, c) => {
              const key = `${section.id}-${r}-${c}`;
              const status = getSeatStatus(section.id, r, c, density, selectedSeat);
              return (
                <Seat3D
                  key={key}
                  status={status}
                  isHighlight={status === 'selected'}
                  onClick={() => handleClick(key)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StadiumSeats3D() {
  const gates = useAppStore((s) => s.gates);
  const userProfile = useAppStore((s) => s.userProfile);

  const [activeSection, setActiveSection] = useState('N-LO');
  const [pickedSeat, setPickedSeat] = useState(null);
  const [pickedSection, setPickedSection] = useState(null);

  const densityMap = useMemo(() => {
    const gateAvg = gates.reduce((s, g) => s + g.density, 0) / gates.length;
    return {
      'N-UP': Math.min(99, gateAvg * 1.05),
      'N-LO': Math.min(99, gateAvg * 0.95),
      'S-UP': Math.min(99, gateAvg * 0.6),
      'S-LO': Math.min(99, gateAvg * 0.55),
      'E':    Math.min(99, gateAvg * 0.75),
      'W':    Math.min(99, gateAvg * 0.7),
      'VIP':  Math.min(99, gateAvg * 0.35),
    };
  }, [gates]);

  const currentSection = SECTIONS.find((s) => s.id === activeSection);
  const currentDensity = densityMap[activeSection] || 50;
  const availablePct = Math.round(100 - currentDensity * 0.8);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏟️</span>
          <div>
            <h3 className="text-sm font-bold text-white">3D Stadium Seats</h3>
            <p className="text-[10px] text-slate-500">Click available seats to explore</p>
          </div>
        </div>
        {pickedSeat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass px-3 py-1.5 rounded-xl border border-cyan-500/30 text-[10px] text-cyan-400 font-medium"
          >
            ✓ Seat {pickedSeat.replace(`${pickedSection?.id}-`, 'R').replace('-', '-S')} picked
          </motion.div>
        )}
      </div>

      {/* Mini stadium map — section picker */}
      <div className="relative w-full mb-4" style={{ perspective: '600px' }}>
        <div
          className="relative mx-auto w-full max-w-sm sm:max-w-md"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(28deg)', transformOrigin: 'center bottom' }}
        >
          {/* Pitch */}
          <div className="relative mx-auto w-3/4 rounded-xl border border-emerald-500/20 bg-emerald-900/20 aspect-[2/1] flex items-center justify-center">
            <div className="absolute inset-4 border border-emerald-600/20 rounded-md" />
            <div className="w-1/2 h-full absolute left-1/2 -translate-x-px border-l border-emerald-600/20" />
            <div className="w-[30%] h-[30%] rounded-full border border-emerald-600/20 absolute" />
            <span className="text-[8px] text-emerald-700 font-bold tracking-widest uppercase">Pitch</span>
          </div>

          {/* Section buttons overlay */}
          {/* North */}
          <SectionBtn id="N-UP" label="N Upper" pos="top-0 left-1/2 -translate-x-1/2 -translate-y-full" activeSection={activeSection} setActive={setActiveSection} density={densityMap['N-UP']} color={SECTIONS[0].color} />
          <SectionBtn id="N-LO" label="N Lower" pos="top-0 left-1/2 -translate-x-1/2 mt-1" activeSection={activeSection} setActive={setActiveSection} density={densityMap['N-LO']} color={SECTIONS[1].color} />
          {/* South */}
          <SectionBtn id="S-LO" label="S Lower" pos="bottom-0 left-1/2 -translate-x-1/2 -mb-1" activeSection={activeSection} setActive={setActiveSection} density={densityMap['S-LO']} color={SECTIONS[3].color} />
          <SectionBtn id="S-UP" label="S Upper" pos="bottom-0 left-1/2 -translate-x-1/2 translate-y-full" activeSection={activeSection} setActive={setActiveSection} density={densityMap['S-UP']} color={SECTIONS[2].color} />
          {/* East */}
          <SectionBtn id="E" label="East" pos="top-1/2 right-0 translate-x-full -translate-y-1/2" activeSection={activeSection} setActive={setActiveSection} density={densityMap['E']} color={SECTIONS[4].color} />
          {/* West */}
          <SectionBtn id="W" label="West" pos="top-1/2 left-0 -translate-x-full -translate-y-1/2" activeSection={activeSection} setActive={setActiveSection} density={densityMap['W']} color={SECTIONS[5].color} />
          {/* VIP */}
          <SectionBtn id="VIP" label="VIP" pos="top-1/2 right-0 translate-x-full -translate-y-1/2 mt-8" activeSection={activeSection} setActive={setActiveSection} density={densityMap['VIP']} color={SECTIONS[6].color} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center text-[10px] mb-4">
        {Object.entries(STATUS_STYLE).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5 text-slate-400">
            <span className={`w-3 h-3 rounded-sm ${v.bg}`} />
            {v.label}
          </span>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex overflow-x-auto gap-1.5 pb-2 mb-3 scrollbar-hide">
        {SECTIONS.map((sec) => {
          const d = densityMap[sec.id] || 50;
          const isActive = sec.id === activeSection;
          return (
            <motion.button
              key={sec.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(sec.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium border transition-all ${
                isActive
                  ? 'text-white border-white/20'
                  : 'glass border-white/5 text-slate-400 hover:text-white'
              }`}
              style={isActive ? { backgroundColor: sec.color + '33', borderColor: sec.color + '60' } : {}}
            >
              <span>{sec.short}</span>
              <span className={`ml-1.5 text-[9px] ${d > 75 ? 'text-red-400' : d > 50 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {Math.round(d)}%
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 3D Seat grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, rotateX: -10, y: 10 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-2xl border border-white/5 p-3 sm:p-4 overflow-hidden"
          style={{ perspective: '800px' }}
        >
          {/* Section info bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentSection?.color }}
              />
              <span className="text-xs font-bold text-white">{currentSection?.label}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span>💰 from ${currentSection?.basePrice}</span>
              <span className="text-emerald-400">~{availablePct}% free</span>
            </div>
          </div>

          {/* Screen/Pitch indicator */}
          <div className="text-center mb-3">
            <div
              className="inline-block px-8 py-1 rounded-full text-[9px] font-bold text-white tracking-widest uppercase"
              style={{ background: `linear-gradient(90deg, transparent, ${currentSection?.color}55, transparent)`, border: `1px solid ${currentSection?.color}44` }}
            >
              ⚽ PITCH SIDE
            </div>
          </div>

          {/* The 3D seat grid */}
          <div
            style={{
              perspective: '500px',
              transform: 'rotateX(8deg)',
              transformOrigin: 'center top',
            }}
          >
            <SectionView
              section={currentSection}
              density={currentDensity}
              userSeatId={null}
              onSeatPick={(key, sec) => { setPickedSeat(key); setPickedSection(sec); }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Picked seat info */}
      <AnimatePresence>
        {pickedSeat && pickedSection && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-3 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2"
          >
            <div>
              <div className="text-[10px] text-cyan-400 uppercase font-semibold mb-0.5">Seat Selected</div>
              <div className="text-sm font-bold text-white">
                {pickedSection.label} — Row {pickedSeat.split('-')[2] ? (Number(pickedSeat.split('-').at(-2)) + 1) : '?'}, Seat {pickedSeat.split('-').at(-1) ? (Number(pickedSeat.split('-').at(-1)) + 1) : '?'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-white font-orbitron">${pickedSection.basePrice}</div>
              <div className="text-[10px] text-slate-400">per ticket</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper button for mini map
function SectionBtn({ id, label, pos, activeSection, setActive, density, color }) {
  const isActive = id === activeSection;
  const d = density || 50;
  return (
    <button
      onClick={() => setActive(id)}
      className={`absolute ${pos} px-2 py-0.5 rounded-md text-[8px] font-bold border transition-all whitespace-nowrap z-10`}
      style={{
        backgroundColor: isActive ? color + '55' : 'rgba(0,0,0,0.5)',
        borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
        color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
      }}
    >
      {label}
    </button>
  );
}
