import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../context/AppContext';
import { generateRouteAdvice } from '../utils/predictionEngine';

// seatKnown: pass true only when a real seat number is set (booked or manual input)
export default function RouteSuggestion({ seatKnown = true, onEnterSeat }) {
  const gates       = useAppStore((s) => s.gates);
  const userProfile = useAppStore((s) => s.userProfile);

  const advice   = generateRouteAdvice(gates, userProfile.seat);
  const altGates = gates
    .filter((g) => g.id !== advice.gate && g.density < 70)
    .sort((a, b) => a.density - b.density)
    .slice(0, 2);

  const statusColors = {
    clear:    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    moderate: { bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30',  text: 'text-yellow-400',  dot: 'bg-yellow-400' },
    busy:     { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-400',  dot: 'bg-orange-400' },
    critical: { bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-400',     dot: 'bg-red-400'    },
  };

  // ─── No seat set — show locked placeholder ───────────────
  if (!seatKnown) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🧭</span>
          <h3 className="text-xs sm:text-sm font-semibold text-white">AI Route Suggestion</h3>
        </div>
        <div className="p-4 rounded-xl border border-dashed border-white/10 text-center">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-xs font-semibold text-slate-300 mb-1">Seat Required</div>
          <div className="text-[10px] text-slate-500 mb-3 leading-relaxed">
            Enter your seat number to get AI-powered route guidance to your exact seat
          </div>
          {onEnterSeat && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onEnterSeat}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white w-full"
              style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)' }}
            >
              Enter Seat No. →
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  // ─── Seat is known — show live AI route ──────────────────
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base sm:text-lg">🧭</span>
        <h3 className="text-xs sm:text-sm font-semibold text-white">AI Route Suggestion</h3>
        <span className="ml-auto px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-400 font-medium">
          Auto-Updated
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={advice.gate}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-[9px] sm:text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">
                  Best Route — {userProfile.seat}
                </div>
                <div className="text-white font-bold text-sm sm:text-base">Via {advice.gateName}</div>
                <div className="text-slate-300 text-[10px] sm:text-sm mt-1 leading-relaxed">{advice.message}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xl sm:text-2xl font-bold font-orbitron text-cyan-400">{advice.walkTime}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-400">min walk</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-3">
              <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - advice.density}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 flex-shrink-0">{Math.round(advice.density)}% full</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {altGates.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">Alternate Routes</div>
          {altGates.map((gate, i) => {
            const s = statusColors[gate.status] || statusColors.clear;
            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-xl ${s.bg} border ${s.border}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                  <div>
                    <div className="text-xs font-medium text-white">{gate.name}</div>
                    <div className={`text-[9px] ${s.text}`}>{gate.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{Math.round(gate.density)}%</div>
                  <div className="text-[9px] text-slate-400">density</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
