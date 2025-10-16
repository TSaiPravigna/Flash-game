export type LevelRuleId = 1 | 2 | 3 | 4 | 5;

export type GamePhase = 'flashing' | 'selecting' | 'result';

export interface LevelSpec {
	level: LevelRuleId;
	title: string;
	description: string;
	hint: string;
}

export interface CheckResult {
	correct: Set<number>;
	missed: Set<number>;
	incorrect: Set<number>;
}

export interface ScoreState {
	level: number;
	totalCorrect: number;
	totalIncorrect: number;
	score: number;
}


