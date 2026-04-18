import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../context/AppContext';
import { TicketCard } from '../components/TicketCard';
import InteractiveSeatMap from '../components/InteractiveSeatMap';
import ComicAgent from '../components/ComicAgent';

// ──── Data ────
const UPCOMING_MATCHES = [
  {
    id: 1,
    team1: { name: 'India', short: 'IND', flag: '🇮🇳' },
    team2: { name: 'Australia', short: 'AUS', flag: '🇦🇺' },
    format: 'T20 World Cup 2026',
    venue: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    date: 'June 15, 2026',
    time: '7:00 PM IST',
    tickets: 1240,
    hotness: 'high',
    bgColor: '#1a3a5c',
  },
  {
    id: 2,
    team1: { name: 'India', short: 'IND', flag: '🇮🇳' },
    team2: { name: 'England', short: 'ENG', flag: '🏴' },
    format: 'Test Series · 2nd Test',
    venue: 'Eden Gardens',
    city: 'Kolkata',
    date: 'July 2, 2026',
    time: '9:30 AM IST',
    tickets: 3850,
    hotness: 'medium',
    bgColor: '#1a2a3a',
  },
  {
    id: 3,
    team1: { name: 'Pakistan', short: 'PAK', flag: '🇵🇰' },
    team2: { name: 'South Africa', short: 'SA', flag: '🇿🇦' },
    format: 'ICC Champions Trophy',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
    date: 'July 10, 2026',
    time: '2:00 PM IST',
    tickets: 587,
    hotness: 'critical',
    bgColor: '#2a1a1a',
  },
  {
    id: 4,
    team1: { name: 'New Zealand', short: 'NZ', flag: '🇳🇿' },
    team2: { name: 'Sri Lanka', short: 'SL', flag: '🇱🇰' },
    format: 'ODI Series · 3rd ODI',
    venue: 'Chinaswamy Stadium',
    city: 'Bengaluru',
    date: 'July 18, 2026',
    time: '1:30 PM IST',
    tickets: 5200,
    hotness: 'low',
    bgColor: '#1a2a1a',
  },
];

const STEP_LABELS = ['Match', 'Seats', 'Details', 'Payment'];

function HotnessTag({ level }) {
  const map = {
    critical: { label: '🔥 Almost Sold Out!', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    high:     { label: '⚡ Selling Fast',      color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    medium:   { label: '✅ Good Availability', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
    low:      { label: '🟢 Available',          color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  };
  const m = map[level] || map.low;
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: m.color, background: m.bg }}>
      {m.label}
    </span>
  );
}

// Step 1: Match Selection
function MatchStep({ onSelect }) {
  return (
    <div>
      <div className="flex items-start gap-6 mb-6">
        <div className="flex-1">
          <h2 className="font-orbitron text-xl font-bold text-white mb-1">Choose a Match</h2>
          <p className="text-sm text-slate-400">Select the match you want to attend</p>
        </div>
        <div className="hidden sm:block flex-shrink-0">
          <ComicAgent section="booking" size="sm" />
        </div>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible">
        {UPCOMING_MATCHES.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.01 }}
            onClick={() => onSelect(m)}
            className="flex-shrink-0 w-72 sm:w-auto glass-strong rounded-2xl p-4 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all group relative overflow-hidden"
            style={{ backgroundImage: `linear-gradient(135deg, ${m.bgColor}40 0%, transparent 100%)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{m.team1.flag}</span>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-white">{m.team1.short}</div>
                    <div className="text-[10px] text-slate-500">{m.team1.name}</div>
                  </div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs text-slate-500 font-bold">VS</div>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <div>
                    <div className="font-orbitron font-bold text-sm text-white">{m.team2.short}</div>
                    <div className="text-[10px] text-slate-500">{m.team2.name}</div>
                  </div>
                  <span className="text-2xl">{m.team2.flag}</span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-400 border-t border-white/5 pt-2">
                <div className="flex items-center gap-1"><span>🏆</span> {m.format}</div>
                <div className="flex items-center gap-1"><span>📍</span> {m.venue}, {m.city}</div>
                <div className="flex items-center gap-1"><span>📅</span> {m.date} · {m.time}</div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <HotnessTag level={m.hotness} />
                <span className="text-[10px] text-slate-500">{m.tickets.toLocaleString()} seats left</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Step 2: Interactive Seat Map
function SeatStep({ match, onSelect }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-orbitron text-xl font-bold text-white mb-1">Select Your Seats</h2>
          <p className="text-sm text-slate-400">
            {match.team1.flag} {match.team1.short} vs {match.team2.short} {match.team2.flag} · {match.venue}
          </p>
        </div>
      </div>

      {/* Stadium bg image header */}
      <div className="relative rounded-2xl overflow-hidden mb-5 h-28 sm:h-36">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/stadium_bg.png')` }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(5,8,17,0.65)' }} />
        <div className="relative flex items-center h-full px-5">
          <div>
            <div className="font-orbitron font-black text-lg text-white mb-1">
              {match.team1.flag} {match.team1.short} <span className="text-slate-400 text-sm">vs</span> {match.team2.short} {match.team2.flag}
            </div>
            <div className="text-sm text-slate-300">{match.venue} · {match.date}</div>
            <div className="text-xs text-cyan-400 mt-0.5">Select multiple seats · Click to toggle</div>
          </div>
        </div>
      </div>

      <InteractiveSeatMap onSeatsConfirmed={onSelect} />
    </div>
  );
}

// Step 3: Passenger Details
function DetailsStep({ onNext, numSeats }) {
  const user = useAppStore((s) => s.user);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  return (
    <div>
      <h2 className="font-orbitron text-xl font-bold text-white mb-2">Your Details</h2>
      <p className="text-sm text-slate-400 mb-6">
        Confirm your contact information · <span className="text-cyan-400">{numSeats} seat{numSeats > 1 ? 's' : ''} selected</span>
      </p>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm text-white glass border border-white/10 focus:border-cyan-500/50 outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }} placeholder="Your full name" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm text-white glass border border-white/10 focus:border-cyan-500/50 outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }} placeholder="email@gmail.com" />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Phone Number</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-sm text-white glass border border-white/10 focus:border-cyan-500/50 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)' }} placeholder="+91 9876543210" />
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => onNext(form)}
        className="mt-6 w-full py-3.5 rounded-xl font-bold text-sm text-white"
        style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)', boxShadow: '0 8px 30px rgba(0,212,255,0.25)' }}>
        Review Order →
      </motion.button>
    </div>
  );
}

// Step 4: Payment
function PaymentStep({ match, seatData, details, onConfirm }) {
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState('upi');

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); onConfirm(); }, 2500);
  };

  return (
    <div>
      <h2 className="font-orbitron text-xl font-bold text-white mb-2">Review & Pay</h2>
      <p className="text-sm text-slate-400 mb-5">Confirm your booking details</p>

      <div className="glass rounded-2xl p-4 mb-5 border border-white/5 space-y-2">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Order Summary</div>
        {[
          { label: 'Match', value: `${match.team1.flag} ${match.team1.short} vs ${match.team2.short} ${match.team2.flag}` },
          { label: 'Venue', value: match.venue },
          { label: 'Date', value: `${match.date} · ${match.time}` },
          { label: 'Seats', value: `${seatData.seats.length} seat${seatData.seats.length > 1 ? 's' : ''}` },
        ].map((r) => (
          <div key={r.label} className="flex justify-between text-sm">
            <span className="text-slate-400">{r.label}</span>
            <span className="text-white font-medium">{r.value}</span>
          </div>
        ))}
        {/* Seats breakdown — horizontal scroll */}
        <div className="pt-2 border-t border-white/5">
          <div className="text-[10px] text-slate-500 mb-1.5">Selected Seats</div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {seatData.seats.map((s, i) => (
              <div key={i} className="flex-shrink-0 px-2 py-1 rounded-full text-[10px] font-medium"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                {s.sectionLabel?.split(' ')[0]} R{s.row}S{s.seat}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-white/10 pt-3 mt-1">
          <span className="text-white">Total</span>
          <span className="gradient-text font-orbitron">₹{seatData.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-xs text-slate-400 mb-2">Payment Method</div>
        <div className="grid grid-cols-3 gap-2">
          {[{ id: 'upi', label: '📱 UPI' }, { id: 'card', label: '💳 Card' }, { id: 'wallet', label: '👜 Wallet' }].map((m) => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className="py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: method === m.id ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${method === m.id ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: method === m.id ? '#00d4ff' : '#94a3b8',
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <motion.button whileHover={{ scale: paying ? 1 : 1.02 }} whileTap={{ scale: paying ? 1 : 0.97 }}
        onClick={handlePay} disabled={paying}
        className="w-full py-4 rounded-xl font-bold text-base text-white relative overflow-hidden animate-gradient-shift"
        style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6, #f472b6)', backgroundSize: '200% 200%', boxShadow: '0 12px 40px rgba(0,212,255,0.3)' }}>
        {paying ? (
          <div className="flex items-center justify-center gap-2">
            <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            Processing Payment...
          </div>
        ) : `Pay ₹${seatData.total.toLocaleString()} →`}
      </motion.button>
      <p className="text-[10px] text-slate-500 text-center mt-3">🔒 Secure payment · No real charges · Demo only</p>
    </div>
  );
}

// ──── Main Booking Page ────
export default function Booking() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const addBooking = useAppStore((s) => s.addBooking);

  const [step, setStep] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [seatData, setSeatData] = useState(null);   // { seats, total, section }
  const [details, setDetails] = useState(null);
  const [finalBooking, setFinalBooking] = useState(null);

  const handleConfirm = () => {
    const firstSeat = seatData.seats[0];
    const newBooking = {
      id: `TKT-${Date.now().toString().slice(-6)}`,
      match: `${selectedMatch.team1.short} vs ${selectedMatch.team2.short}`,
      venue: selectedMatch.venue,
      section: firstSeat.sectionId,
      row: firstSeat.row,
      seat: firstSeat.seat,
      fan: details.name,
      price: seatData.total,
      seats: seatData.seats,
    };
    addBooking(newBooking);
    setFinalBooking(newBooking);
    setStep(4);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen animated-bg grid-pattern pt-20 flex items-center justify-center px-4"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(5,8,17,0.85), rgba(5,8,17,1)), url('/stadium_bg.png')`, backgroundSize: 'cover' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-10 text-center max-w-md w-full border border-white/5">
          <ComicAgent section="booking" size="sm" className="mb-4" />
          <h2 className="font-orbitron text-2xl font-black text-white mb-3">Sign In to Book Tickets</h2>
          <p className="text-slate-400 text-sm mb-6">You need to sign in with Google to access the booking system.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={openAuthModal}
            className="px-8 py-3.5 rounded-2xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)', boxShadow: '0 8px 30px rgba(0,212,255,0.3)' }}>
            Sign in with Google →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg grid-pattern pt-20 pb-12 px-4 sm:px-6"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(5,8,17,0.7), rgba(5,8,17,0.95)), url('/stadium_bg.png')`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-orbitron text-2xl sm:text-3xl font-black text-white">
            Book <span className="gradient-text">Tickets</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Powered by StadiumFlow AI — zero friction booking</p>
        </motion.div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center mb-8 overflow-x-auto scrollbar-hide pb-1">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div className={`step-indicator ${i === step ? 'active' : i < step ? 'completed' : 'pending'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] hidden sm:block whitespace-nowrap ${i === step ? 'text-cyan-400' : i < step ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 w-8 sm:w-16"
                    style={{ background: i < step ? 'linear-gradient(90deg, #22c55e, #22c55e)' : 'rgba(255,255,255,0.06)' }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <MatchStep onSelect={(m) => { setSelectedMatch(m); setStep(1); }} />
            </motion.div>
          )}
          {step === 1 && selectedMatch && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-4">
                <button onClick={() => setStep(0)} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                  ← Back to matches
                </button>
              </div>
              <SeatStep match={selectedMatch} onSelect={(s) => { setSeatData(s); setStep(2); }} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-4">
                <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                  ← Back to seat selection
                </button>
              </div>
              <DetailsStep numSeats={seatData?.seats?.length || 1} onNext={(d) => { setDetails(d); setStep(3); }} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-4">
                <button onClick={() => setStep(2)} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                  ← Back to details
                </button>
              </div>
              <PaymentStep match={selectedMatch} seatData={seatData} details={details} onConfirm={handleConfirm} />
            </motion.div>
          )}
          {step === 4 && finalBooking && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }} className="text-6xl mb-4">🎉</motion.div>
              <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
              <p className="text-slate-400 text-sm mb-8">Your ticket{finalBooking.seats?.length > 1 ? 's have' : ' has'} been generated. Have a great match!</p>
              <div className="max-w-sm mx-auto mb-8">
                <TicketCard booking={finalBooking} />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3.5 rounded-2xl font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)', boxShadow: '0 8px 30px rgba(0,212,255,0.25)' }}>
                  Go to Dashboard →
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setStep(0); setSelectedMatch(null); setFinalBooking(null); }}
                  className="px-8 py-3.5 rounded-2xl font-semibold text-slate-300 glass border border-white/10 text-sm">
                  Book Another Ticket
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
