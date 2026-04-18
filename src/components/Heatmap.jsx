import { motion } from 'framer-motion';
import useAppStore from '../context/AppContext';

function getDensityColor(density) {
  if (density >= 85) return '#ef4444';
  if (density >= 65) return '#f97316';
  if (density >= 40) return '#eab308';
  return '#22c55e';
}

function GateMarker({ gate }) {
  const color = getDensityColor(gate.density);
  return (
    <motion.div
      style={{ left: `${gate.location.x}%`, top: `${gate.location.y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: gate.id.charCodeAt(0) * 0.3 }}
    >
      <div
        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white border-2 shadow-lg cursor-pointer"
        style={{ backgroundColor: color + '44', borderColor: color }}
        title={`${gate.name}: ${Math.round(gate.density)}% full`}
      >
        {gate.id}
      </div>
    </motion.div>
  );
}

export default function Heatmap() {
  const gates = useAppStore((s) => s.gates);

  const sections = [
    { id: 'N', label: 'North', density: gates[0]?.density || 70, location: { x: 50, y: 15 } },
    { id: 'S', label: 'South', density: gates[1]?.density || 45, location: { x: 50, y: 82 } },
    { id: 'E', label: 'East',  density: gates[2]?.density || 60, location: { x: 82, y: 50 } },
    { id: 'W', label: 'West',  density: gates[3]?.density || 55, location: { x: 18, y: 50 } },
  ];

  return (
    <div className="w-full">
      {/* Legend header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-300">Live Stadium Heatmap</h3>
        <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 inline-block" /> Clear</span>
          <span className="flex items-center gap-1"><span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-yellow-500 inline-block" /> Mod</span>
          <span className="flex items-center gap-1"><span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-orange-500 inline-block" /> Busy</span>
          <span className="flex items-center gap-1"><span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 inline-block" /> Critical</span>
        </div>
      </div>

      {/* Stadium map */}
      <div className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden glass border border-white/5">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 225" preserveAspectRatio="none">
          {/* Pitch */}
          <rect x="80" y="45" width="240" height="135" rx="8" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
          {/* Center circle */}
          <circle cx="200" cy="112" r="30" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="1" />
          {/* Center line */}
          <line x1="200" y1="45" x2="200" y2="180" stroke="rgba(34,197,94,0.15)" strokeWidth="1" />
          {/* Penalty areas */}
          <rect x="80" y="75" width="40" height="75" fill="none" stroke="rgba(34,197,94,0.12)" strokeWidth="1" />
          <rect x="280" y="75" width="40" height="75" fill="none" stroke="rgba(34,197,94,0.12)" strokeWidth="1" />
          {/* Stand heat overlays */}
          {sections.map((s) => (
            <ellipse
              key={s.id}
              cx={s.location.x * 4}
              cy={s.location.y * 2.25}
              rx={s.id === 'N' || s.id === 'S' ? 80 : 30}
              ry={s.id === 'N' || s.id === 'S' ? 20  : 60}
              fill={getDensityColor(s.density) + '22'}
            />
          ))}
        </svg>

        {/* Gate markers */}
        {gates.map((gate) => (
          <GateMarker key={gate.id} gate={gate} />
        ))}

        {/* Stand labels */}
        {sections.map((s) => (
          <div
            key={s.id}
            className="absolute -translate-x-1/2 text-center pointer-events-none"
            style={{ left: `${s.location.x}%`, top: `${s.location.y}%` }}
          >
            <div className="text-[8px] sm:text-[10px] font-semibold" style={{ color: getDensityColor(s.density) }}>
              {s.label} {Math.round(s.density)}%
            </div>
          </div>
        ))}

        {/* AI scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
        />
      </div>
    </div>
  );
}
