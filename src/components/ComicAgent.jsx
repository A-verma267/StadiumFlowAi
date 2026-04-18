import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Comic speech bubble messages per section
export const SECTION_MESSAGES = {
  hero: [
    "Hi! I'm your AI stadium guide 👋",
    "I'll get you to your seat in no time!",
    "Book tickets, track live scores — all here! 🎫",
    "Zero queues. Maximum enjoyment. Let's go! 🚀",
  ],
  booking: [
    "Click any seat to select it!",
    "You can pick multiple seats at once 💺",
    "Green = available  ·  Orange = reserved",
    "VIP seats are closest to the pitch ⭐",
  ],
  features: [
    "Here's what I can do for you! 👆",
    "Find your seat faster than ever 🧭",
    "No more standing in queue for 30 mins!",
    "Live scores right in your dashboard 🏏",
  ],
  navigation: [
    "I'll tell you which gate to use 🚪",
    "Gate C has 78% less crowd right now!",
    "Only 4 min walk to your section →",
    "Real-time updates every 3 seconds ⚡",
  ],
};

function useTypewriter(messages, speed = 45, pause = 2800) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout;
    const msg = messages[msgIdx];
    if (typing) {
      if (displayed.length < msg.length) {
        timeout = setTimeout(() => setDisplayed(msg.slice(0, displayed.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setTyping(false), pause);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2.5);
      } else {
        setMsgIdx((i) => (i + 1) % messages.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, msgIdx, messages, speed, pause]);

  return displayed;
}

// Comic speech bubble panels — like a comic strip
function ComicPanel({ text, color = 'cyan' }) {
  const borderCol = color === 'cyan' ? 'rgba(0,212,255,0.4)' : color === 'purple' ? 'rgba(139,92,246,0.4)' : 'rgba(34,197,94,0.4)';
  const bgCol = color === 'cyan' ? 'rgba(0,212,255,0.08)' : color === 'purple' ? 'rgba(139,92,246,0.08)' : 'rgba(34,197,94,0.08)';
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -4 }}
      className="relative px-4 py-3 rounded-2xl rounded-bl-sm text-sm font-medium text-white min-h-[52px] flex items-center max-w-[280px] sm:max-w-xs"
      style={{ background: bgCol, border: `2px solid ${borderCol}`, backdropFilter: 'blur(16px)' }}
    >
      {/* Comic style dot pattern border */}
      <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full" style={{ background: borderCol }} />
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: borderCol, opacity: 0.5 }} />
      <span className="leading-snug">{text}</span>
      <span className="inline-block w-0.5 h-[1em] ml-0.5 align-middle animate-blink" style={{ background: `rgba(0,212,255,0.8)` }} />
      {/* Tail pointing down-left */}
      <div
        className="absolute -bottom-2.5 left-5"
        style={{
          width: 0, height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `12px solid ${borderCol}`,
        }}
      />
    </motion.div>
  );
}

export default function ComicAgent({ section = 'hero', size = 'lg', className = '' }) {
  const messages = SECTION_MESSAGES[section] || SECTION_MESSAGES.hero;
  const text = useTypewriter(messages);

  const imgSize = size === 'lg' ? 'h-64 sm:h-80' : size === 'md' ? 'h-48 sm:h-60' : 'h-36 sm:h-44';

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <ComicPanel key={text.length < 3 ? 'transition' : text} text={text} />
      </AnimatePresence>

      {/* Human character image */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Glow under feet */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full blur-xl"
          style={{ background: 'rgba(0,212,255,0.25)' }}
        />
        <img
          src="/ai_guide.png"
          alt="AI Stadium Guide"
          className={`${imgSize} w-auto object-contain relative z-10 drop-shadow-2xl`}
          style={{ filter: 'drop-shadow(0 0 24px rgba(0,212,255,0.35))' }}
        />
        {/* Comic-book action dots */}
        {[
          { x: '10%', y: '30%', delay: 0 },
          { x: '85%', y: '20%', delay: 0.4 },
          { x: '75%', y: '60%', delay: 0.8 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ left: dot.x, top: dot.y, background: i % 2 === 0 ? '#00d4ff' : '#8b5cf6' }}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: dot.delay }}
          />
        ))}
      </motion.div>
    </div>
  );
}
