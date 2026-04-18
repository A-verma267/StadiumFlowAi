import { useEffect } from 'react';
import useAppStore from '../context/AppContext';

/**
 * Custom hook that starts the simulation loop.
 * Ticks every 3 seconds, triggering state updates across the app.
 */
export function useSimulation(enabled = true) {
  const advanceTick = useAppStore((s) => s.advanceTick);
  const triggerAIThink = useAppStore((s) => s.triggerAIThink);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      triggerAIThink();
      setTimeout(advanceTick, 900); // slight delay for "AI thinking" feel
    }, 3000);
    return () => clearInterval(interval);
  }, [enabled, advanceTick, triggerAIThink]);
}
