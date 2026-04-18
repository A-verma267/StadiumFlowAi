import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingCard from '../components/FloatingCard';
import { simulationScenarios } from '../data/dummyData';
import useAppStore from '../context/AppContext';
import { useSimulation } from '../hooks/useSimulation';
import {
  getDensityStatus,
  calcWaitTime,
  generateRouteAdvice,
  generateAlerts,
} from '../utils/predictionEngine';

// Read-only AI metric bar (replaces slider)
function AIMetricBar({ label, value, min = 0, max = 100, unit = '', color = 'cyan', sublabels }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const colorMap = {
    cyan:   { bar: 'from-cyan-400 to-blue-500', text: '#00d4ff' },
    purple: { bar: 'from-purple-400 to-pink-500', text: '#a78bfa' },
    green:  { bar: 'from-emerald-400 to-cyan-500', text: '#22c55e' },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-slate-300">{label}</span>
          {/* AI badge */}
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
            AI
          </span>
        </div>
        <motion.span
          key={Math.round(value)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-orbitron text-base sm:text-lg font-bold"
          style={{ color: c.text }}
        >
          {value.toLocaleString()}{unit}
        </motion.span>
      </div>
      {/* Read-only progress bar */}
      <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${c.bar}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Animated AI pulse dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg pointer-events-none"
          style={{ boxShadow: `0 0 8px ${c.text}` }}
          animate={{ left: `calc(${pct}% - 6px)` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {sublabels && (
        <div className="flex justify-between text-[9px] text-slate-600 mt-1">
          {sublabels.map((l) => <span key={l}>{l}</span>)}
        </div>
      )}
    </div>
  );
}

export default function Simulation() {
  // Pull real-time state from the live simulation engine
  useSimulation(true);
  const gates          = useAppStore((s) => s.gates);
  const foodStalls     = useAppStore((s) => s.foodStalls);
  const totalAttendees = useAppStore((s) => s.totalAttendees);
  const aiConfidence   = useAppStore((s) => s.aiConfidence);
  const isAIThinking   = useAppStore((s) => s.isAIThinking);
  const alerts         = useAppStore((s) => s.alerts);

  // Derive live crowd density from gate average
  const liveCrowdDensity = Math.round(gates.reduce((sum, g) => sum + g.density, 0) / gates.length);
  const avgServiceTime   = Math.round(foodStalls.reduce((sum, s) => sum + s.avgTime, 0) / foodStalls.length);

  const routeAdvice   = useMemo(() => generateRouteAdvice(gates), [gates]);
  const densityStatus = getDensityStatus(liveCrowdDensity);

  return (
    <div className="min-h-screen animated-bg pt-16 sm:pt-20 pb-12 sm:pb-16 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 sm:mb-10 pt-4 sm:pt-0">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass border border-purple-500/20 mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs text-purple-400 font-medium uppercase tracking-wider">Real-Time AI Simulation</span>
          </div>
          <h1 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">
            See How the <span className="gradient-text">AI Engine</span> Works
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            All values are driven exclusively by the AI simulation engine — updating every 3 seconds in real time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* ─── Left: AI Metrics (read-only) ─── */}
          <div className="space-y-4 sm:space-y-5">

            {/* AI Status header */}
            <FloatingCard glow="purple" className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">AI Engine Status</h3>
                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-semibold ${isAIThinking ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                  <motion.div className={`w-1.5 h-1.5 rounded-full ${isAIThinking ? 'bg-yellow-400' : 'bg-emerald-400'}`}
                    animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                  {isAIThinking ? 'AI thinking…' : 'AI Active'}
                </div>
              </div>
              {/* Event scenario display */}
              <div className="grid grid-cols-2 gap-2">
                {simulationScenarios.map((s) => {
                  const isActive = totalAttendees >= s.totalPeople * 0.5 && totalAttendees <= s.totalPeople * 1.5;
                  return (
                    <div
                      key={s.id}
                      className={`p-2 sm:p-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                          : 'glass border-white/5 text-slate-500'
                      }`}
                    >
                      <div className="text-xs sm:text-sm">{s.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.totalPeople.toLocaleString()} fans</div>
                      {isActive && (
                        <div className="text-[9px] text-purple-400 mt-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-purple-400" />Active
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </FloatingCard>

            {/* AI-driven metrics — READ ONLY */}
            <FloatingCard glow="blue" className="p-4 sm:p-6 space-y-5 sm:space-y-7">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Live AI Metrics</h3>
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Updated by AI every 3s
                </div>
              </div>
              <div>
                <AIMetricBar
                  label="Overall Crowd Density"
                  value={liveCrowdDensity}
                  min={0} max={100} unit="%"
                  color="cyan"
                  sublabels={['Empty', 'Half Full', 'Critical']}
                />
              </div>
              <div>
                <AIMetricBar
                  label="People Attending"
                  value={Math.min(90000, totalAttendees)}
                  min={500} max={90000}
                  color="purple"
                  sublabels={['500', '45,000', '90,000']}
                />
              </div>
              <div>
                <AIMetricBar
                  label="Avg Service Time (min)"
                  value={avgServiceTime}
                  min={1} max={10} unit=" min"
                  color="green"
                  sublabels={['Fast', 'Normal', 'Slow']}
                />
              </div>

              {/* AI confidence bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-300">AI Confidence Score</span>
                  <span className="font-orbitron font-bold text-base" style={{ color: '#22c55e' }}>{aiConfidence}%</span>
                </div>
                <div className="relative h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                    animate={{ width: `${aiConfidence}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </FloatingCard>

            {/* AI Decision Logic */}
            <FloatingCard className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-base sm:text-lg">🧠</span>
                <h3 className="text-sm font-semibold text-white">AI Decision Engine</h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs font-mono">
                {[
                  { label: 'density_threshold', value: '> 80 → critical',         color: 'text-red-400' },
                  { label: 'route_algorithm',   value: 'min(density) gate',        color: 'text-cyan-400' },
                  { label: 'queue_formula',     value: 'people × avg_time',        color: 'text-purple-400' },
                  { label: 'alert_trigger',     value: 'density > 85 || wait > 60', color: 'text-yellow-400' },
                  { label: 'confidence',        value: `${aiConfidence}%`,          color: 'text-emerald-400' },
                  { label: 'tick_interval',     value: '3 000 ms',                  color: 'text-slate-400' },
                ].map((row) => (
                  <motion.div
                    key={row.label}
                    layout
                    className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg bg-white/2"
                  >
                    <span className="text-slate-500 flex-1 truncate">{row.label}:</span>
                    <motion.span
                      key={row.value}
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                      className={`font-bold ${row.color} flex-shrink-0`}
                    >
                      {row.value}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </FloatingCard>
          </div>

          {/* ─── Right: AI Output Panel ─── */}
          <div className="space-y-4 sm:space-y-5">

            {/* Risk gauge */}
            <FloatingCard
              glow={liveCrowdDensity >= 85 ? 'pink' : liveCrowdDensity >= 65 ? 'purple' : 'green'}
              className="p-4 sm:p-6"
            >
              <div className="text-xs sm:text-sm text-slate-400 mb-2">AI Crowd Status Assessment</div>
              <div className="flex items-end gap-3 sm:gap-4 mb-3 sm:mb-4">
                <motion.div
                  className="font-orbitron text-5xl sm:text-6xl font-black"
                  style={{ color: densityStatus.hex }}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {liveCrowdDensity}%
                </motion.div>
                <div>
                  <div className="text-lg sm:text-xl font-bold font-orbitron mb-0.5" style={{ color: densityStatus.hex }}>
                    {densityStatus.label}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400">AI-computed crowd level</div>
                </div>
              </div>
              <div className="density-bar h-2.5 sm:h-3 rounded-full relative mb-2">
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg pointer-events-none"
                  style={{ boxShadow: `0 0 10px ${densityStatus.hex}` }}
                  animate={{ left: `${liveCrowdDensity}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-500">
                <span>Clear</span><span>Moderate</span><span>Busy</span><span>Critical</span>
              </div>
            </FloatingCard>

            {/* Gate analysis — AI output */}
            <FloatingCard className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span>🚪</span>
                <h3 className="text-sm font-semibold text-white">Gate Analysis</h3>
                <span className="ml-auto text-[9px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />Live
                </span>
              </div>
              <div className="space-y-2">
                {gates.map((g) => {
                  const st = getDensityStatus(g.density);
                  return (
                    <div key={g.id} className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs font-bold w-5 text-slate-400">{g.id}</span>
                      <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: st.hex }}
                          animate={{ width: `${g.density}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs font-bold w-8 text-right" style={{ color: st.hex }}>
                        {Math.round(g.density)}%
                      </span>
                      <span className="text-[10px] text-slate-500 w-14 hidden sm:inline">{st.label}</span>
                    </div>
                  );
                })}
              </div>
            </FloatingCard>

            {/* Queue times — AI computed */}
            <FloatingCard className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span>⏱️</span>
                <h3 className="text-sm font-semibold text-white">AI-Computed Queue Times</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {foodStalls.map((s) => {
                  const color = s.waitTime > 60 ? '#ef4444' : s.waitTime > 30 ? '#f97316' : '#22c55e';
                  return (
                    <div key={s.id} className="p-2 sm:p-3 rounded-xl glass border border-white/5">
                      <div className="text-base sm:text-lg mb-1">{s.icon}</div>
                      <div className="text-[10px] sm:text-xs text-slate-400 mb-1 truncate">{s.name}</div>
                      <motion.div
                        className="font-orbitron font-bold text-lg sm:text-xl"
                        style={{ color }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {s.waitTime}m
                      </motion.div>
                      <div className="text-[10px] text-slate-500">{s.people} ppl</div>
                    </div>
                  );
                })}
              </div>
            </FloatingCard>

            {/* AI Route Decision — output only */}
            <FloatingCard glow="blue" className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span>🧭</span>
                <h3 className="text-sm font-semibold text-white">AI Route Decision</h3>
                <span className="ml-auto text-[9px] text-cyan-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />Auto
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={routeAdvice.gate}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20"
                >
                  <div className="text-[10px] sm:text-xs text-cyan-400 font-semibold uppercase mb-1 sm:mb-2">AI Recommends</div>
                  <div className="text-xs sm:text-sm text-white leading-relaxed">{routeAdvice.message}</div>
                  <div className="flex flex-wrap gap-3 mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-400">
                    <span>🕐 {routeAdvice.walkTime} min walk</span>
                    <span>📊 {Math.round(routeAdvice.density)}% density</span>
                    <span>🤖 {aiConfidence}% confidence</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </FloatingCard>

            {/* Alerts — AI generated */}
            {alerts.length > 0 && (
              <FloatingCard className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span>⚠️</span>
                  <h3 className="text-sm font-semibold text-white">AI Generated Alerts</h3>
                  <span className="ml-auto text-xs text-orange-400 font-bold">{alerts.length}</span>
                </div>
                <div className="space-y-2">
                  {alerts.slice(0, 3).map((a) => (
                    <div
                      key={a.id}
                      className={`flex items-start gap-2 p-2 sm:p-3 rounded-xl text-[10px] sm:text-xs ${a.type === 'critical' ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'bg-orange-500/10 border border-orange-500/20 text-orange-300'}`}
                    >
                      <span>{a.icon}</span>
                      <span>{a.message}</span>
                    </div>
                  ))}
                </div>
              </FloatingCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
