import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Live cricket simulation engine
const MATCHES = [
  {
    id: 1,
    team1: { name: 'India', short: 'IND', flag: '🇮🇳', color: '#1a6bff' },
    team2: { name: 'Australia', short: 'AUS', flag: '🇦🇺', color: '#ffd700' },
    format: 'T20 World Cup',
    venue: 'Narendra Modi Stadium',
  },
  {
    id: 2,
    team1: { name: 'England', short: 'ENG', flag: '🏴', color: '#00247d' },
    team2: { name: 'Pakistan', short: 'PAK', flag: '🇵🇰', color: '#01411c' },
    format: 'ICC Champions Trophy',
    venue: 'Lords, London',
  },
];

const BATSMEN_POOL = {
  IND: ['V. Kohli', 'R. Sharma', 'S. Gill', 'H. Pandya', 'S. Iyer'],
  AUS: ['D. Warner', 'S. Smith', 'G. Maxwell', 'M. Stoinis', 'T. Head'],
  ENG: ['J. Root', 'B. Stokes', 'J. Buttler', 'D. Malan', 'M. Ali'],
  PAK: ['B. Azam', 'M. Rizwan', 'F. Zaman', 'I. Wasim', 'S. Masood'],
};

const BOWLERS_POOL = {
  AUS: ['P. Cummins', 'M. Starc', 'N. Lyon', 'A. Hazlewood'],
  IND: ['J. Bumrah', 'R. Jadeja', 'M. Shami', 'K. Yadav'],
  PAK: ['S. Afridi', 'H. Naseem', 'I. Wasim Jr', 'Z. Khan'],
  ENG: ['J. Anderson', 'S. Broad', 'M. Wood', 'A. Rashid'],
};

function generateBallResult() {
  const r = Math.random();
  if (r < 0.08) return 'W';
  if (r < 0.18) return '6';
  if (r < 0.32) return '4';
  if (r < 0.45) return '3';
  if (r < 0.62) return '2';
  if (r < 0.80) return '1';
  return '0';
}

function initMatch(match) {
  const batting = match.team1;
  const bowling = match.team2;
  const batPool = BATSMEN_POOL[batting.short] || BATSMEN_POOL.IND;
  const bowlPool = BOWLERS_POOL[bowling.short] || BOWLERS_POOL.AUS;
  return {
    match,
    batting,
    bowling,
    tossWinner: batting.name,
    tossChoice: 'Bat',
    score: Math.floor(Math.random() * 50) + 40,
    wickets: Math.floor(Math.random() * 3),
    balls: Math.floor(Math.random() * 18) + 10,
    batter1: { name: batPool[0], runs: Math.floor(Math.random() * 40) + 15, balls: Math.floor(Math.random() * 40) + 20, onStrike: true },
    batter2: { name: batPool[1], runs: Math.floor(Math.random() * 25) + 5, balls: Math.floor(Math.random() * 25) + 8, onStrike: false },
    bowler: { name: bowlPool[0], wickets: Math.floor(Math.random() * 2), runs: Math.floor(Math.random() * 25) + 10, overs: Math.floor(Math.random() * 3) + 1 },
    lastOver: ['1', '4', '2', '0', '6', '1'],
    lastBall: null,
    scoreFlash: false,
  };
}

function BallBubble({ val }) {
  const color =
    val === 'W' ? { bg: '#ef444422', border: '#ef4444', text: '#ef4444' } :
    val === '6' ? { bg: '#8b5cf622', border: '#8b5cf6', text: '#a78bfa' } :
    val === '4' ? { bg: '#00d4ff22', border: '#00d4ff', text: '#00d4ff' } :
    val === '0' ? { bg: '#ffffff11', border: '#ffffff22', text: '#64748b' } :
    { bg: '#22c55e22', border: '#22c55e55', text: '#4ade80' };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="ball-indicator text-xs font-bold"
      style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}
    >
      {val}
    </motion.div>
  );
}

export default function LiveCricket() {
  const [matchIdx] = useState(0);
  const [state, setState] = useState(() => initMatch(MATCHES[matchIdx]));
  const [flashing, setFlashing] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const ball = generateBallResult();
        const runs = ball === 'W' ? 0 : parseInt(ball) || 0;
        const isWicket = ball === 'W';
        const newScore = prev.score + runs;
        const newWickets = Math.min(10, prev.wickets + (isWicket ? 1 : 0));
        const newBalls = prev.balls + 1;

        const updBatter1 = prev.batter1.onStrike
          ? { ...prev.batter1, runs: prev.batter1.runs + runs, balls: prev.batter1.balls + 1 }
          : prev.batter1;
        const updBatter2 = !prev.batter1.onStrike
          ? { ...prev.batter2, runs: prev.batter2.runs + runs, balls: prev.batter2.balls + 1 }
          : prev.batter2;

        // Rotate strike on odd runs
        const shouldRotate = runs % 2 === 1;
        const b1 = { ...updBatter1, onStrike: shouldRotate ? !updBatter1.onStrike : updBatter1.onStrike };
        const b2 = { ...updBatter2, onStrike: shouldRotate ? !updBatter2.onStrike : updBatter2.onStrike };

        const lastOver = [...prev.lastOver.slice(-5), ball];

        return {
          ...prev,
          score: newScore,
          wickets: newWickets,
          balls: newBalls,
          batter1: b1,
          batter2: b2,
          lastOver,
          lastBall: ball,
        };
      });

      if (Math.random() > 0.3) {
        setFlashing(true);
        setTimeout(() => setFlashing(false), 500);
      }
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const { match, batting, bowling, tossWinner, tossChoice, score, wickets, balls, batter1, batter2, bowler, lastOver } = state;
  const overs = `${Math.floor(balls / 6)}.${balls % 6}`;
  const rrr = balls > 0 ? ((score / balls) * 6).toFixed(1) : '0.0';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏏</span>
          <span className="text-sm font-bold text-white">{match.format}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <div className="cricket-live-dot" />
          <span className="text-[10px] font-bold text-red-400 uppercase">Live</span>
        </div>
      </div>

      {/* Teams & Score */}
      <div className="glass rounded-xl p-3 mb-3" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between">
          {/* Batting team */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{batting.flag}</span>
            <div>
              <div className="text-xs text-slate-400">{batting.name}</div>
              <motion.div
                className="font-orbitron font-black text-lg leading-none"
                animate={flashing ? { scale: [1, 1.12, 1], color: ['#e2e8f0', '#22c55e', '#e2e8f0'] } : {}}
                transition={{ duration: 0.4 }}
                style={{ color: '#e2e8f0' }}
              >
                {score}/{wickets}
              </motion.div>
              <div className="text-[10px] text-slate-500 font-orbitron">{overs} ov</div>
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">vs</div>
            <div className="text-[10px] px-2 py-0.5 rounded glass text-slate-400">CRR {rrr}</div>
          </div>

          {/* Bowling team */}
          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-xs text-slate-400">{bowling.name}</div>
              <div className="font-orbitron font-black text-lg text-slate-400">Yet to bat</div>
            </div>
            <span className="text-xl">{bowling.flag}</span>
          </div>
        </div>
      </div>

      {/* Toss info */}
      <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
        <span>🪙</span>
        <span><span className="text-cyan-400">{tossWinner}</span> won the toss — chose to <span className="text-white font-medium">{tossChoice}</span></span>
      </div>

      {/* Batting Scorecard */}
      <div className="mb-3 space-y-1.5">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Batting</div>
        {[batter1, batter2].map((b, i) => (
          <div key={i} className="flex items-center justify-between py-1 px-2 rounded-lg" style={{ background: b.onStrike ? 'rgba(0,212,255,0.06)' : 'transparent' }}>
            <div className="flex items-center gap-1.5">
              {b.onStrike && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />}
              <span className={`text-xs ${b.onStrike ? 'text-white font-semibold' : 'text-slate-400'}`}>{b.name}</span>
              {b.onStrike && <span className="text-[9px] text-cyan-400 ml-1">*</span>}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-orbitron font-bold text-white">{b.runs}</span>
              <span className="text-slate-500">({b.balls})</span>
              {b.balls > 0 && <span className="text-[10px] text-emerald-400">{((b.runs / b.balls) * 100).toFixed(0)} SR</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Current Bowler */}
      <div className="flex items-center justify-between py-1.5 px-2 rounded-lg glass mb-3" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🎳</span>
          <span className="text-xs text-slate-300">{bowler.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white font-bold">{bowler.wickets}-{bowler.runs}</span>
          <span className="text-slate-500">({bowler.overs} ov)</span>
        </div>
      </div>

      {/* Last Over */}
      <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">This Over</div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <AnimatePresence>
            {lastOver.map((v, i) => (
              <BallBubble key={`${i}-${v}`} val={v} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Venue */}
      <div className="mt-3 text-[10px] text-slate-600 flex items-center gap-1">
        <span>📍</span>
        <span>{match.venue}</span>
      </div>
    </div>
  );
}
