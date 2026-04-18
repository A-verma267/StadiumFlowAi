import { create } from 'zustand';
import { stadiumData } from '../data/dummyData';
import {
  predictDensity,
  calcWaitTime,
  generateAlerts,
  calcAIConfidence,
} from '../utils/predictionEngine';

// Demo users for simulated Google auth
const DEMO_USERS = [
  { name: 'Alex Chen', email: 'alex.chen@gmail.com', avatar: 'AC', googleId: 'google_001' },
  { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', avatar: 'PS', googleId: 'google_002' },
  { name: 'Rahul Gupta', email: 'rahul.gupta@gmail.com', avatar: 'RG', googleId: 'google_003' },
];

const useAppStore = create((set, get) => ({
  // ─── Auth State ───────────────────────────────────────
  user: null,
  isLoggedIn: false,
  showAuthModal: false,
  authLoading: false,

  // ─── Seat Preference ─────────────────────────────────
  seatPreference: null, // { section, row, seat }
  bookingHistory: [],

  // ─── Stadium State ────────────────────────────────────
  tickCount: 0,
  gates: stadiumData.gates.map((g) => ({ ...g })),
  foodStalls: stadiumData.foodStalls.map((s) => ({ ...s, waitTime: calcWaitTime(s.people, s.avgTime) })),
  alerts: stadiumData.alerts,
  userProfile: stadiumData.userProfile,
  aiConfidence: stadiumData.aiConfidence,
  isAIThinking: false,
  isLoading: true,
  totalAttendees: stadiumData.totalAttendees,

  // ─── Auth Actions ─────────────────────────────────────
  openAuthModal: () => set({ showAuthModal: true }),
  closeAuthModal: () => set({ showAuthModal: false }),

  simulateGoogleLogin: (email) =>
    new Promise((resolve) => {
      set({ authLoading: true });
      setTimeout(() => {
        const matched = DEMO_USERS.find((u) => u.email === email) || DEMO_USERS[0];
        const user = email
          ? { ...matched, email, name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) }
          : matched;
        set({
          user,
          isLoggedIn: true,
          authLoading: false,
          showAuthModal: false,
          userProfile: { ...get().userProfile, name: user.name },
        });
        resolve(user);
      }, 1800);
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      seatPreference: null,
    }),

  // ─── Seat Preference Actions ──────────────────────────
  setSeatPreference: (pref) => set({ seatPreference: pref }),

  addBooking: (booking) =>
    set((state) => ({
      bookingHistory: [booking, ...state.bookingHistory],
    })),

  // ─── App Actions ─────────────────────────────────────
  setLoading: (v) => set({ isLoading: v }),

  triggerAIThink: () => {
    set({ isAIThinking: true });
    setTimeout(() => set({ isAIThinking: false }), 1800);
  },

  /** Called every 3 seconds by useSimulation hook */
  advanceTick: () =>
    set((state) => {
      const newTick = state.tickCount + 1;

      const newGates = state.gates.map((g) => {
        const newDensity = predictDensity(g.density, newTick);
        const status =
          newDensity >= 85 ? 'critical'
          : newDensity >= 65 ? 'busy'
          : newDensity >= 40 ? 'moderate'
          : 'clear';
        return { ...g, density: newDensity, people: Math.round((newDensity / 100) * g.capacity), status };
      });

      const newStalls = state.foodStalls.map((s) => {
        const drift = Math.round(Math.sin(newTick * 0.4 + s.id) * 3);
        const people = Math.max(1, s.people + drift);
        const waitTime = calcWaitTime(people, s.avgTime);
        const status = waitTime > 60 ? 'busy' : waitTime > 20 ? 'moderate' : 'clear';
        return { ...s, people, waitTime, status };
      });

      const newAlerts = generateAlerts(newGates, newStalls);
      const aiConf = calcAIConfidence(newTick);

      return {
        tickCount: newTick,
        gates: newGates,
        foodStalls: newStalls,
        alerts: newAlerts,
        aiConfidence: Math.round(aiConf),
        totalAttendees: state.totalAttendees + Math.round(Math.sin(newTick) * 50),
      };
    }),
}));

export default useAppStore;
