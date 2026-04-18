import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen animated-bg grid-pattern flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.3 }}
          className="font-orbitron text-[150px] font-black leading-none gradient-text opacity-20 select-none"
        >
          404
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="-mt-8"
        >
          <h1 className="font-orbitron text-2xl font-bold text-white mb-3">Gate Not Found</h1>
          <p className="text-slate-400 mb-8">Looks like you took a wrong turn in the stadium. Let the AI guide you back.</p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold text-white"
            >
              🏟️ Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
