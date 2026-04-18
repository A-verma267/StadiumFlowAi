import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../context/AppContext';
import { suggestBestStall } from '../utils/predictionEngine';

function WaitBar({ waitTime, maxTime = 120 }) {
  const pct   = Math.min(100, (waitTime / maxTime) * 100);
  const color = waitTime > 60 ? '#ef4444' : waitTime > 30 ? '#f97316' : '#22c55e';
  return (
    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-1.5">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}

export default function QueuePanel() {
  const foodStalls = useAppStore((s) => s.foodStalls);
  const best       = suggestBestStall(foodStalls);

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base sm:text-lg">⏱️</span>
        <h3 className="text-xs sm:text-sm font-semibold text-white">Queue Intelligence</h3>
        <span className="ml-auto px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] sm:text-[10px] text-purple-400 font-medium">
          Live
        </span>
      </div>

      {/* Best stall highlight */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
        <div className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">AI Recommends Now</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-xl">{best.icon}</span>
            <div className="text-xs sm:text-sm font-bold text-white">{best.name}</div>
          </div>
          <div className="text-right">
            <div className="text-base sm:text-lg font-bold font-orbitron text-emerald-400">{best.waitTime}m</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400">wait</div>
          </div>
        </div>
      </div>

      {/* All stalls */}
      <AnimatePresence>
        {foodStalls.map((stall, i) => {
          const isBest  = stall.id === best.id;
          const color   = stall.waitTime > 60 ? 'text-red-400' : stall.waitTime > 30 ? 'text-orange-400' : 'text-emerald-400';
          return (
            <motion.div
              key={stall.id}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all ${isBest ? 'bg-emerald-500/5 border-emerald-500/20' : 'glass border-white/5'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <span className="text-sm sm:text-base flex-shrink-0">{stall.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-white flex items-center gap-1 sm:gap-1.5 flex-wrap">
                      <span className="truncate">{stall.name}</span>
                      {isBest && <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0">Best</span>}
                    </div>
                    <div className="text-[9px] sm:text-[11px] text-slate-400">{stall.people} in queue</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <motion.div
                    className={`text-sm sm:text-base font-bold font-orbitron ${color}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {stall.waitTime}m
                  </motion.div>
                  <div className="text-[8px] sm:text-[10px] text-slate-500">wait</div>
                </div>
              </div>
              <WaitBar waitTime={stall.waitTime} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
