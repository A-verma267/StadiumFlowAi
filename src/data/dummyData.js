export const stadiumData = {
  gates: [
    { id: "A", name: "Gate Alpha", density: 92, people: 1840, capacity: 2000, status: "critical", location: { x: 15, y: 50 } },
    { id: "B", name: "Gate Beta", density: 45, people: 900, capacity: 2000, status: "moderate", location: { x: 85, y: 50 } },
    { id: "C", name: "Gate Gamma", density: 20, people: 400, capacity: 2000, status: "clear", location: { x: 50, y: 10 } },
    { id: "D", name: "Gate Delta", density: 67, people: 1340, capacity: 2000, status: "busy", location: { x: 50, y: 90 } },
  ],
  foodStalls: [
    { id: 1, name: "Pizza Hub", icon: "🍕", people: 28, avgTime: 3, waitTime: 84, status: "busy", location: { x: 20, y: 30 } },
    { id: 2, name: "Drinks Bar", icon: "🥤", people: 8, avgTime: 1, waitTime: 8, status: "clear", location: { x: 75, y: 30 } },
    { id: 3, name: "Burger Zone", icon: "🍔", people: 15, avgTime: 4, waitTime: 60, status: "moderate", location: { x: 30, y: 70 } },
    { id: 4, name: "Snack Corner", icon: "🍿", people: 5, avgTime: 1, waitTime: 5, status: "clear", location: { x: 70, y: 70 } },
  ],
  sections: [
    { id: "N1", label: "North Upper", density: 88, seats: 5000 },
    { id: "N2", label: "North Lower", density: 72, seats: 3000 },
    { id: "S1", label: "South Upper", density: 35, seats: 5000 },
    { id: "S2", label: "South Lower", density: 45, seats: 3000 },
    { id: "E1", label: "East Stand", density: 60, seats: 4000 },
    { id: "W1", label: "West Stand", density: 55, seats: 4000 },
    { id: "VIP", label: "VIP Lounge", density: 30, seats: 500 },
    { id: "PITCH", label: "Pitch Side", density: 95, seats: 200 },
  ],
  routes: [
    { id: 1, from: "Gate C", to: "Section N1", duration: 4, distance: "320m", congestion: "low", recommended: true },
    { id: 2, from: "Gate A", to: "Section N1", duration: 12, distance: "580m", congestion: "high", recommended: false },
    { id: 3, from: "Gate B", to: "Section S1", duration: 5, distance: "400m", congestion: "medium", recommended: true },
    { id: 4, from: "Gate D", to: "Section E1", duration: 7, distance: "450m", congestion: "medium", recommended: false },
  ],
  alerts: [
    { id: 1, type: "critical", message: "Gate A critically overcrowded → Redirect to Gate C", icon: "🚨", gate: "A" },
    { id: 2, type: "warning", message: "Pizza Hub wait time exceeds 80 min → Try Snack Corner", icon: "⚠️", stall: 1 },
    { id: 3, type: "info", message: "AI suggests: Order food now to skip the rush at halftime", icon: "💡" },
    { id: 4, type: "success", message: "Gate C is 78% less crowded than average — Best entry point", icon: "✅", gate: "C" },
  ],
  userProfile: {
    name: "Alex Chen",
    seat: "N1-Row 12-Seat 34",
    event: "Champions League Final",
    stadium: "Nova Arena",
    ticketId: "TKT-2026-0042",
    arrivalTime: "19:45",
    matchStart: "20:00",
  },
  totalAttendees: 78420,
  maxCapacity: 90000,
  aiConfidence: 94,
};

export const featuresData = [
  {
    id: 1,
    icon: "🧭",
    title: "Smart Navigation",
    subtitle: "AI-Powered Pathfinding",
    description: "Our proprietary Antigravity algorithm analyzes 10,000+ data points per second to suggest the fastest, least crowded path to your seat—updated in real time.",
    metrics: [
      { label: "Faster Arrival", value: "3.2x" },
      { label: "Distance Saved", value: "~40%" },
      { label: "Accuracy", value: "97.4%" },
    ],
    color: "blue",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    icon: "⏱️",
    title: "Queue Prediction",
    subtitle: "Dynamic Wait Estimation",
    description: "Machine learning models trained on 500+ historical events predict queue wait times with 94% accuracy up to 20 minutes into the future.",
    metrics: [
      { label: "Prediction Accuracy", value: "94%" },
      { label: "Avg Time Saved", value: "18 min" },
      { label: "Queues Monitored", value: "200+" },
    ],
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    icon: "🚨",
    title: "Real-time Alerts",
    subtitle: "Instant Crowd Intelligence",
    description: "Dynamic alert system that monitors every gate, stall, and corridor simultaneously—pushing intelligently timed nudges that guide crowds proactively.",
    metrics: [
      { label: "Alert Latency", value: "<2s" },
      { label: "False Positives", value: "<1%" },
      { label: "Incidents Averted", value: "1,200+" },
    ],
    color: "pink",
    gradient: "from-pink-500 to-orange-400",
  },
  {
    id: 4,
    icon: "🪐",
    title: "Antigravity UX",
    subtitle: "Zero-Friction Experience",
    description: "The system makes all decisions for you. From entry routing to food ordering to exit flow—every suggestion minimizes friction so you just enjoy the event.",
    metrics: [
      { label: "User Input Needed", value: "~0%" },
      { label: "Satisfaction Rate", value: "98.7%" },
      { label: "Events Powered", value: "350+" },
    ],
    color: "green",
    gradient: "from-emerald-400 to-cyan-400",
  },
];

export const simulationScenarios = [
  { id: "concert", label: "🎵 Rock Concert", totalPeople: 85000, eventType: "concert" },
  { id: "football", label: "⚽ Football Match", totalPeople: 60000, eventType: "sports" },
  { id: "festival", label: "🎪 Music Festival", totalPeople: 120000, eventType: "festival" },
  { id: "basketball", label: "🏀 NBA Finals", totalPeople: 22000, eventType: "sports" },
];
