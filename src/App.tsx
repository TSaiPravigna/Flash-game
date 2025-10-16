import { useMemo, useState } from 'react';
import './App.css';
import { Grid } from './components/Grid';
import { levels } from './rules';
import type { CheckResult } from './types';
import { useFlasher } from './useFlasher';

function App() {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = levels[levelIdx];
  const { phase, isOn, timeLeftMs, target, resetAndStart } = useFlasher({ level: level.level, flashMs: 500, durationMs: 10000 });

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const toggleSelect = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const result: CheckResult | null = useMemo(() => {
    if (phase !== 'result') return null;
    const correct = new Set<number>();
    const missed = new Set<number>();
    const incorrect = new Set<number>();
    for (const i of selected) {
      if (target.has(i)) correct.add(i); else incorrect.add(i);
    }
    for (const i of target) {
      if (!selected.has(i)) missed.add(i);
    }
    return { correct, missed, incorrect };
  }, [phase, selected, target]);

  const [score, setScore] = useState(0);

  const startSelecting = phase === 'selecting';
  const submitDisabled = phase !== 'selecting' || selected.size === 0;

  const onSubmit = () => {
    if (phase !== 'selecting') return;
    // Simple scoring: +2 for correct, -1 for incorrect, 0 for missed
    let delta = 0;
    for (const i of selected) delta += target.has(i) ? 2 : -1;
    setScore(s => Math.max(0, s + delta));
    // transition to result
    // we change phase by restarting hook in 'result' via local gate
    // easiest is toggling local state by forcing result calculation path
    // We'll emulate by storing a trivial toggle
    setInternalPhase('result');
  };

  const [internalPhase, setInternalPhase] = useState<'flashing' | 'selecting' | 'result'>('flashing');
  if (internalPhase !== phase) {
    // mirror the hook's phase into local state
    // this allows us to set 'result' after submit
    if (internalPhase !== 'result') setInternalPhase(phase);
  }

  const nextLevel = () => {
    const nextIdx = (levelIdx + 1) % levels.length;
    setLevelIdx(nextIdx);
    setSelected(new Set());
    setInternalPhase('flashing');
    resetAndStart(levels[nextIdx].level);
  };

  const retryLevel = () => {
    setSelected(new Set());
    setInternalPhase('flashing');
    resetAndStart(level.level);
  };

  return (
    <div className="app">
      <div className="topbar">
        <div>
          <h2>Signal Decoder</h2>
          <div className="meta"> 
            <span>Level {level.level}: {level.title}</span>
            <span>Time: {(timeLeftMs/1000).toFixed(1)}s</span>
            <span>Score: {score}</span>
          </div>
        </div>
        <div className="controls">
          <button className="primary" onClick={retryLevel}>Restart</button>
          <button className="primary" onClick={nextLevel}>Skip</button>
        </div>
      </div>

      <div className="panel" style={{marginBottom: 16}}>
        <p>{level.description}</p>
        <p style={{color: '#91a4bf'}}>Note: grid indices start at 0.</p>
        {internalPhase === 'result' && result && (
          <div className="legend">
            <span className="badge good">✅ Correct: {result.correct.size}</span>
            <span className="badge bad">❌ Incorrect: {result.incorrect.size}</span>
            <span className="badge miss">⚠️ Missed: {result.missed.size}</span>
          </div>
        )}
        {internalPhase !== 'result' && (
          <p style={{color: '#91a4bf'}}>Watch the pattern, then select squares when the flashing stops.</p>
        )}
      </div>

      <div className="panel">
        <Grid
          flashing={isOn}
          selected={selected}
          phase={internalPhase}
          onToggle={toggleSelect}
          showResultFor={result}
        />
      </div>

      <div style={{marginTop: 16}} className="controls">
        {startSelecting && (
          <button className="primary" disabled={submitDisabled} onClick={onSubmit}>Submit</button>
        )}
        {internalPhase === 'result' && (
          <>
            <button className="primary" onClick={retryLevel}>Try Again</button>
            <button className="primary" onClick={nextLevel}>Next Level</button>
            <span style={{color:'#91a4bf'}}>Hint: {level.hint}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
