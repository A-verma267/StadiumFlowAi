import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#050811] flex flex-col items-center justify-center"
    >
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[100px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Spinner ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.8, ease: 'linear', repeat: Infinity }}
          />
          <div className="font-orbitron font-bold text-xl gradient-text">SF</div>
        </div>

        {/* Text */}
        <div className="text-center">
          <motion.h2
            className="font-orbitron text-xl gradient-text mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            StadiumFlow AI
          </motion.h2>
          <motion.p
            className="text-slate-400 text-sm"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Initializing Crowd Intelligence System...
          </motion.p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
