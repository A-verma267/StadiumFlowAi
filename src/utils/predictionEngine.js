/**
 * StadiumFlow AI - Prediction Engine
 * Simulates real-time crowd intelligence without a backend.
 */

/** Returns density status label */
export function getDensityStatus(density) {
  if (density >= 85) return { label: "Critical", color: "red", hex: "#ef4444" };
  if (density >= 65) return { label: "Busy", color: "orange", hex: "#f97316" };
  if (density >= 40) return { label: "Moderate", color: "yellow", hex: "#eab308" };
  return { label: "Clear", color: "green", hex: "#22c55e" };
}

/** Calculates wait time for a food stall */
export function calcWaitTime(people, avgServiceTime) {
  return Math.round(people * avgServiceTime);
}

/** Predict crowd density with drift over time */
export function predictDensity(base, tick) {
  const drift = Math.sin(tick * 0.3) * 8 + Math.cos(tick * 0.17) * 4;
  return Math.min(100, Math.max(0, base + drift));
}

/** Suggest the best gate given gate data */
export function suggestBestGate(gates) {
  return gates.reduce((best, g) => (g.density < best.density ? g : best), gates[0]);
}

/** Suggest the best food stall */
export function suggestBestStall(stalls) {
  return stalls.reduce((best, s) => (s.waitTime < best.waitTime ? s : best), stalls[0]);
}

/** Generate a route suggestion based on density and user seat */
export function generateRouteAdvice(gates, userSeat) {
  const best = suggestBestGate(gates);
  const status = getDensityStatus(best.density);
  return {
    gate: best.id,
    gateName: best.name,
    density: Math.round(best.density),
    status,
    walkTime: Math.round(best.density * 0.06 + 2), // minutes
    message: `Take ${best.name} — only ${Math.round(best.density)}% full. ~${Math.round(best.density * 0.06 + 2)} min walk to your seat.`,
  };
}

/** Generate alert list based on current state */
export function generateAlerts(gates, stalls) {
  const alerts = [];
  gates.forEach((g) => {
    if (g.density >= 85) {
      alerts.push({
        id: `gate-${g.id}`,
        type: "critical",
        icon: "🚨",
        message: `${g.name} is critically overcrowded (${Math.round(g.density)}%) — reroute immediately`,
      });
    } else if (g.density >= 65) {
      alerts.push({
        id: `gate-warn-${g.id}`,
        type: "warning",
        icon: "⚠️",
        message: `${g.name} is getting busy (${Math.round(g.density)}%) — consider alternate entry`,
      });
    }
  });
  stalls.forEach((s) => {
    if (s.waitTime > 60) {
      alerts.push({
        id: `stall-${s.id}`,
        type: "warning",
        icon: "⏱️",
        message: `${s.name} wait time: ${s.waitTime} min — try nearby alternatives`,
      });
    }
  });
  return alerts;
}

/** Compute overall overcrowding risk percentage */
export function calcOverallRisk(gates) {
  const avg = gates.reduce((sum, g) => sum + g.density, 0) / gates.length;
  return Math.round(avg);
}

/** AI confidence score (simulated) */
export function calcAIConfidence(tick) {
  return Math.min(99, Math.max(85, 94 + Math.sin(tick * 0.2) * 4));
}

/** Estimate crowd flow rate (people/min through all clear gates) */
export function calcFlowRate(gates) {
  const clearGates = gates.filter((g) => g.density < 65);
  return clearGates.length * 120;
}
