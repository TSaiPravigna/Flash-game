import React from 'react';
import { GRID_SIZE, TOTAL_CELLS } from '../rules';

interface GridProps {
	flashing: boolean[]; // cells visually flashing (during phase 'flashing')
	selected: Set<number>; // user selection (during 'selecting')
	phase: 'flashing' | 'selecting' | 'result';
	onToggle(index: number): void;
	showResultFor?: {
		correct: Set<number>;
		missed: Set<number>;
		incorrect: Set<number>;
	} | null;
}

export const Grid: React.FC<GridProps> = ({ flashing, selected, phase, onToggle, showResultFor }) => {
	const cells = Array.from({ length: TOTAL_CELLS }, (_, i) => i);
	return (
		<div className="grid">
			{cells.map((i) => {
				const isFlashing = flashing[i];
				const isSelected = selected.has(i);
				const inResult = phase === 'result' && showResultFor;
				const isCorrect = inResult ? showResultFor!.correct.has(i) : false;
				const isMissed = inResult ? showResultFor!.missed.has(i) : false;
				const isIncorrect = inResult ? showResultFor!.incorrect.has(i) : false;
				let className = 'cell';
				if (phase === 'flashing' && isFlashing) className += ' on';
				if (phase !== 'flashing' && isSelected) className += ' selected';
				if (isCorrect) className += ' correct';
				if (isMissed) className += ' missed';
				if (isIncorrect) className += ' incorrect';
				return (
					<button
						key={i}
						className={className}
						disabled={phase === 'flashing'}
						onClick={() => onToggle(i)}
						style={{ width: `calc(100% / ${GRID_SIZE})`, aspectRatio: '1 / 1' }}
					/>
				);
			})}
		</div>
	);
};


