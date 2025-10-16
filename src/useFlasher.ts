import { useEffect, useRef, useState } from 'react';
import { computeFlashingIndices, TOTAL_CELLS } from './rules';
import type { GamePhase, LevelRuleId } from './types';

interface UseFlasherOptions {
	level: LevelRuleId;
	flashMs?: number; // interval between on/off toggles
	durationMs?: number; // total flashing duration before switching to selection
}

export function useFlasher({ level, flashMs = 500, durationMs = 10000 }: UseFlasherOptions) {
	const [phase, setPhase] = useState<GamePhase>('flashing');
	const [isOn, setIsOn] = useState<boolean[]>(Array(TOTAL_CELLS).fill(false));
	const [timeLeftMs, setTimeLeftMs] = useState<number>(durationMs);
	const target = useRef<Set<number>>(computeFlashingIndices(level));
	const timerRef = useRef<number | null>(null);
	const tickRef = useRef<number | null>(null);

	// recompute target on level change
	useEffect(() => {
		target.current = computeFlashingIndices(level);
	}, [level]);

	// flashing engine
	useEffect(() => {
		if (phase !== 'flashing') return;
		// tick toggles the display based on target set
		const toggle = () => {
			setIsOn(prev => {
				const next = prev.slice();
				for (let i = 0; i < next.length; i++) {
					next[i] = target.current.has(i) ? !next[i] : false;
				}
				return next;
			});
		};
		// interval for visual flashing
		tickRef.current = window.setInterval(toggle, flashMs);
		// countdown timer
		const startedAt = performance.now();
		const raf = () => {
			const elapsed = performance.now() - startedAt;
			const remaining = Math.max(0, durationMs - elapsed);
			setTimeLeftMs(remaining);
			if (remaining > 0) {
				timerRef.current = window.setTimeout(() => requestAnimationFrame(raf), 100);
			} else {
				setPhase('selecting');
				setIsOn(Array(TOTAL_CELLS).fill(false));
			}
		};
		raf();
		return () => {
			if (tickRef.current) window.clearInterval(tickRef.current);
			if (timerRef.current) window.clearTimeout(timerRef.current);
		};
	}, [phase, flashMs, durationMs]);

	const resetAndStart = (nextLevel?: LevelRuleId) => {
		if (typeof nextLevel !== 'undefined') {
			// update target for the next level
			target.current = computeFlashingIndices(nextLevel);
		}
		setTimeLeftMs(durationMs);
		setPhase('flashing');
	};

	return { phase, isOn, timeLeftMs, target: target.current, resetAndStart } as const;
}


