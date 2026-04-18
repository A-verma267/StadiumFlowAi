import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../context/AppContext';

const alertStyles = {
  critical: { bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-300',     indicator: 'bg-red-500',     glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]' },
  warning:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-300',  indicator: 'bg-orange-500',  glow: 'shadow-[0_0_20px_rgba(249,115,22,0.1)]' },
  info:     { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-300',    indicator: 'bg-blue-500',    glow: '' },
  success:  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', indicator: 'bg-emerald-500', glow: '' },
};

export default function AlertBanner({ compact = false }) {
  const alerts        = useAppStore((s) => s.alerts);
  const displayAlerts = alerts.slice(0, compact ? 2 : alerts.length);

  if (displayAlerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base sm:text-lg">🚨</span>
          <h3 className="text-xs sm:text-sm font-semibold text-white">Live Alerts</h3>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-auto px-1.5 sm:px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] sm:text-[10px] text-red-400 font-medium"
          >
            {alerts.length} Active
          </motion.span>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {displayAlerts.map((alert) => {
          const s = alertStyles[alert.type] || alertStyles.info;
          return (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border ${s.bg} ${s.border} ${s.glow}`}
            >
              <motion.span
                animate={alert.type === 'critical' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-sm sm:text-base mt-0.5 flex-shrink-0"
              >
                {alert.icon}
              </motion.span>
              <p className={`text-[10px] sm:text-xs font-medium leading-5 flex-1 ${s.text}`}>{alert.message}</p>
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${s.indicator} ${alert.type === 'critical' ? 'animate-ping' : ''}`} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
