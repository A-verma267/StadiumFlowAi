import { motion } from 'framer-motion';

/**
 * FloatingCard – a glassmorphism card with optional floating animation.
 * Props: delay, floatAnim, className, glow (blue|purple|pink|green)
 */
export default function FloatingCard({
  children,
  delay = 0,
  floatAnim = false,
  glow = null,
  className = '',
}) {
  const glowClasses = {
    blue: 'shadow-[0_0_30px_rgba(0,212,255,0.12)] border-cyan-500/20',
    purple: 'shadow-[0_0_30px_rgba(139,92,246,0.12)] border-purple-500/20',
    pink: 'shadow-[0_0_30px_rgba(244,114,182,0.12)] border-pink-500/20',
    green: 'shadow-[0_0_30px_rgba(34,197,94,0.12)] border-emerald-500/20',
  };

  const floatVariants = {
    initial: { y: 0 },
    float: {
      y: [-8, 0, -8],
      transition: {
        duration: 4,
        ease: 'easeInOut',
        repeat: Infinity,
        delay,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, ...(floatAnim ? floatVariants.float : {}) }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className={`glass rounded-2xl ${glow ? glowClasses[glow] : 'border-white/8'} ${className}`}
    >
      {children}
    </motion.div>
  );
}
