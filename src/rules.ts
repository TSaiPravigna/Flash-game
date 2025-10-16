import type { LevelRuleId } from './types';

const GRID_SIZE = 5;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE; // 25

export function indexToRowCol(index: number): { row: number; col: number } {
	return { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE };
}

function isPrime(n: number): boolean {
	if (n < 2) return false;
	for (let i = 2; i * i <= n; i++) {
		if (n % i === 0) return false;
	}
	return true;
}

export function computeFlashingIndices(level: LevelRuleId): Set<number> {
	const on = new Set<number>();
	for (let idx = 0; idx < TOTAL_CELLS; idx++) {
		switch (level) {
			case 1: {
				// Even indices
				if (idx % 2 === 0) on.add(idx);
				break;
			}
			case 2: {
				// Diagonals
				const { row, col } = indexToRowCol(idx);
				if (row === col || row + col === GRID_SIZE - 1) on.add(idx);
				break;
			}
			case 3: {
				// Prime numbers
				if (isPrime(idx)) on.add(idx);
				break;
			}
			case 4: {
				// Center cluster (12) and 4 neighbors
				if (idx === 12 || idx === 7 || idx === 11 || idx === 13 || idx === 17) on.add(idx);
				break;
			}
			case 5: {
				// (row + col) % 3 === 0
				const { row, col } = indexToRowCol(idx);
				if ((row + col) % 3 === 0) on.add(idx);
				break;
			}
			default:
				break;
		}
	}
	return on;
}

export const levels = [
	{ level: 1, title: 'Even indices', description: 'Flash squares where index % 2 === 0', hint: 'Think parity (even/odd).' },
	{ level: 2, title: 'Diagonals', description: 'Flash squares where row===col or row+col===4', hint: 'X shape across the grid.' },
	{ level: 3, title: 'Prime numbers', description: 'Flash squares whose index is a prime number', hint: '2,3,5,7,11…' },
	{ level: 4, title: 'Center cluster', description: 'Flash center (12) and its 4 neighbors', hint: 'Plus shape around center.' },
	{ level: 5, title: '(row + col) % 3 === 0', description: 'Use the formula to pick squares', hint: 'Sum the coordinates first.' },
];

export { GRID_SIZE };


