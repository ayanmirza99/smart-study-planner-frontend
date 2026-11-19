import { useEffect, useMemo, useState } from 'react';
import {
  Download, Play, Pause, SkipBack, SkipForward, StepBack, StepForward, CornerDownRight, ChevronRight,
  LayoutGrid, Table2, Repeat, Library, Ban, ArrowRight,
} from 'lucide-react';
import { api } from '../api.js';
import { downloadPlanCsv } from '../csv.js';
import { buildSteps, boardAt, inDegrees } from '../replay.js';
import GraphView from './GraphView.jsx';
import TCard, { DifficultyKey, formatDate } from './TCard.jsx';

const SORT_OPTIONS = {
  priority: { label: 'Priority', hint: 'highest first' },
  deadline: { label: 'Deadline', hint: 'earliest first' },
  credits: { label: 'Credits', hint: 'most first' },
  difficulty: { label: 'Difficulty', hint: 'hardest first' },
};

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'credits', label: 'Credits' },
  { key: 'priority', label: 'Priority' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'deadline', label: 'Deadline' },
];

export default function PlanTab({ courses, onLoadSample, onGoToCourses }) {
  const [sortBy, setSortBy] = useState('priority');
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('board');

  useEffect(() => {
    api.makePlan(sortBy)
      .then((result) => {
        setPlan(result);
        setError('');
      })
      .catch((err) => {
        setPlan(null);
        setError(err.message);
      });
  }, [sortBy, courses]);

  const hasPlan = plan?.ok && plan.semesters.length > 0;

  return (
    <>
      <section className="controls" aria-label="Plan controls">
        <div className="control-group">
          <span className="control-label" id="rank-label">Rank by</span>
          <div className="segmented" role="radiogroup" aria-labelledby="rank-label">
            {Object.entries(SORT_OPTIONS).map(([key, { label, hint }]) => (
              <button key={key} role="radio" aria-checked={sortBy === key} onClick={() => setSortBy(key)} title={`${label} (${hint})`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <div className="segmented" role="radiogroup" aria-label="View">
            <button role="radio" aria-checked={view === 'board'} onClick={() => setView('board')}><LayoutGrid aria-hidden="true" />Board</button>
            <button role="radio" aria-checked={view === 'table'} onClick={() => setView('table')}><Table2 aria-hidden="true" />Tables</button>
          </div>
          <button className="btn" onClick={() => downloadPlanCsv(plan)} disabled={!hasPlan}>
            <Download aria-hidden="true" />Export CSV
          </button>
        </div>
      </section>

      {error && <p className="fault-inline" role="alert">{error}</p>}
      {plan && !plan.ok && <CycleFault plan={plan} onLoadSample={onLoadSample} onGoToCourses={onGoToCourses} />}
      {plan?.ok && plan.semesters.length === 0 && <EmptyBoard onLoadSample={onLoadSample} onGoToCourses={onGoToCourses} />}

      {hasPlan && view === 'board' && <Board key={`${plan.sortBy}-${plan.order.join()}`} plan={plan} />}
      {hasPlan && view === 'table' && plan.semesters.map((semester) => (
        <SemesterTable key={semester.number} semester={semester} sortBy={plan.sortBy} maxCredits={plan.maxCredits} />
      ))}

      {hasPlan && <PlanSummary plan={plan} />}

      {hasPlan && (
        <section className="sheet">
          <div className="sheet-head">
            <h2>Prerequisite map</h2>
            <p className="note">Arrows run from a prerequisite to the course it unlocks. Hover or focus a card to trace its chain.</p>
          </div>
          <GraphView semesters={plan.semesters} />
        </section>
      )}
    </>
  );
}

function Board({ plan }) {
  const steps = useMemo(() => buildSteps(plan), [plan]);
  const byId = useMemo(() => new Map(plan.semesters.flatMap((s) => s.courses).map((c) => [c.id, c])), [plan]);
  const [step, setStep] = useState(null); // null = finished board, not replaying
  const [playing, setPlaying] = useState(false);

  const last = steps.length - 1;
  const index = step ?? last;
  const current = step === null ? null : steps[step];
  const { columns, fate } = boardAt(plan, steps, index);
  const placed = new Set(columns.flatMap((c) => c.cards));
  const unplaced = [...byId.keys()].filter((id) => !placed.has(id));
  const degree = inDegrees([...byId.values()], placed);
  const unlocked = new Set(current?.kind === 'unlock' ? current.unlocked : []);

  useEffect(() => {
    if (!playing) return undefined;
    if (index >= last) {
      setPlaying(false);
      return undefined;
    }
    const delay = steps[index + 1].kind === 'take' || steps[index + 1].kind === 'defer' ? 750 : 1500;
    const timer = setTimeout(() => setStep(index + 1), delay);
    return () => clearTimeout(timer);
  }, [playing, index, last, steps]);

  function replay() {
    setStep(0);
    setPlaying(true);
  }

  function go(to) {
    setPlaying(false);
    setStep(Math.max(0, Math.min(last, to)));
  }

  return (
    <section className="board-shell" aria-label="Planning board">
      <div className="caption-bar">
        <div className="transport" role="group" aria-label="Replay">
          {step === null ? (
            <button className="btn btn-signal" onClick={replay}><Play aria-hidden="true" />Watch it build</button>
          ) : (
            <>
              <button className="icon-btn" onClick={() => go(0)} aria-label="First step"><SkipBack aria-hidden="true" /></button>
              <button className="icon-btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous step"><StepBack aria-hidden="true" /></button>
              <button className="icon-btn icon-btn-signal" onClick={() => (index >= last ? replay() : setPlaying(!playing))} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <Pause aria-hidden="true" /> : index >= last ? <Repeat aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
              <button className="icon-btn" onClick={() => go(index + 1)} disabled={index >= last} aria-label="Next step"><StepForward aria-hidden="true" /></button>
              <button className="icon-btn" onClick={() => { setPlaying(false); setStep(null); }} aria-label="Skip to finished plan"><SkipForward aria-hidden="true" /></button>
            </>
          )}
        </div>
        <div className="caption" aria-live="polite">
          <Caption plan={plan} step={current} index={index} total={steps.length} byId={byId} fate={fate} />
        </div>
      </div>

      <div className={step === null ? 'board' : 'board replaying'}>
        <aside className="tray">
          <h3 className="placard">{unplaced.length ? `Waiting · ${unplaced.length}` : 'All placed'}</h3>
          {unplaced.length > 0 ? (
            <ul className="tray-list">
              {unplaced.map((id) => (
                <li key={id} className={`chip d${byId.get(id).difficulty}`} data-unlocked={unlocked.has(id) || undefined} title={`${degree.get(id)} unmet prerequisite(s)`}>
                  {id}<sup className="indeg" aria-label={`in-degree ${degree.get(id)}`}>{degree.get(id)}</sup>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tray-done">{byId.size} courses filed into {plan.semesters.length} semesters.</p>
          )}
          {unplaced.length > 0 && <p className="tray-hint">Dark number = unmet prerequisites (in-degree)</p>}
          <h3 className="placard">Card colour = difficulty</h3>
          <DifficultyKey />
        </aside>

        <p className="swipe-cue">{plan.semesters.length} semesters · swipe sideways</p>
        <div className="rail-scroll">
          <ol className="columns">
            {plan.semesters.map((semester, i) => {
              const column = columns[i];
              const active = current?.column === i;
              return (
                <li key={semester.number} className={active ? 'column is-active' : 'column'}>
                  <div className="column-head">
                    <span className="placard">Semester {semester.number}</span>
                    <span className="column-credits"><b>{column.credits}</b>/{plan.maxCredits}</span>
                  </div>
                  <Gauge cards={column.cards.map((id) => byId.get(id))} max={plan.maxCredits} />
                  <div className="slots">
                    {column.cards.map((id) => (
                      <TCard key={id} course={byId.get(id)} sortBy={plan.sortBy} state={current?.courseId === id ? 'active' : 'placed'} />
                    ))}
                  </div>
                  {column.deferred.length > 0 && (
                    <div className="deferred">
                      {column.deferred.map((id) => (
                        <div key={id} className={current?.courseId === id ? 'ghost is-active' : 'ghost'}>
                          <CornerDownRight aria-hidden="true" />
                          <span><b>{id}</b> deferred to semester {semester.number + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Gauge({ cards, max }) {
  const used = cards.reduce((t, c) => t + c.credits, 0);
  return (
    <div className="gauge" style={{ '--max': max }} role="img" aria-label={`${used} of ${max} credits used`}>
      {cards.flatMap((card) => Array.from({ length: card.credits }, (_, k) => (
        <i key={`${card.id}-${k}`} className={`seg d${card.difficulty}`} />
      )))}
      {Array.from({ length: Math.max(0, max - used) }, (_, k) => <i key={`empty-${k}`} className="seg" />)}
    </div>
  );
}

function Caption({ plan, step, index, total, byId, fate }) {
  const key = SORT_OPTIONS[plan.sortBy];
  if (!step) {
    return (
      <p>
        <span className="step-no">Plan</span>
        Source removal filed <b>{plan.order.length}</b> courses into <b>{plan.semesters.length}</b> semesters, each at most {plan.maxCredits} credits, ranked by {key.label.toLowerCase()} ({key.hint}). Planned in {plan.timeMs.toFixed(2)} ms.
      </p>
    );
  }

  const n = step.column + 1;
  const counter = <span className="step-no">{index + 1}<small>/{total}</small></span>;
  if (step.kind === 'queue') {
    return (
      <div>
        <p>{counter}Semester {n}: <b>{step.queue.length}</b> courses have no unmet prerequisites (in-degree 0). Merge sort ranks them by {key.label.toLowerCase()}.</p>
        <Queue ids={step.queue} byId={byId} fate={fate} />
      </div>
    );
  }

  if (step.kind === 'unlock') {
    return (
      <div>
        <p>
          {counter}Semester {n} closes. Source removal deletes its {step.removed.length} courses and their outgoing edges;
          {step.unlocked.length ? <> <b>{step.unlocked.length}</b> courses drop to in-degree 0 and are unlocked</> : ' no new courses are unlocked'}
          {step.carried.length > 0 && <>, joining {step.carried.join(', ')} carried over</>}.
        </p>
        {step.unlocked.length > 0 && <ol className="queue" aria-label="Unlocked courses">{step.unlocked.map((id) => <li key={id} className={`chip d${byId.get(id).difficulty}`} data-fate="unlock">{id}</li>)}</ol>}
      </div>
    );
  }

  const course = byId.get(step.courseId);
  const before = step.kind === 'take' ? step.credits - course.credits : step.credits;
  return (
    <div>
      {step.kind === 'take' ? (
        <p>{counter}<b>{course.id}</b> fits: {before} + {course.credits} = <b>{step.credits}</b> / {plan.maxCredits} credits. Filed in semester {n}.</p>
      ) : (
        <p>{counter}<b>{course.id}</b> does not fit: {before} + {course.credits} &gt; {plan.maxCredits}. Deferred to semester {n + 1}; the scan continues.</p>
      )}
      <Queue ids={step.queue} byId={byId} fate={fate} current={step.courseId} />
    </div>
  );
}

function Queue({ ids, byId, fate, current }) {
  return (
    <ol className="queue" aria-label="Ranked ready queue">
      {ids.map((id) => (
        <li key={id} className={`chip d${byId.get(id).difficulty}`} data-fate={fate.get(id) ?? 'pending'} data-current={id === current || undefined}>
          {id}
        </li>
      ))}
    </ol>
  );
}

function PlanSummary({ plan }) {
  return (
    <section className="sheet summary">
      <div className="order">
        <h2 className="placard">Topological order</h2>
        <ol className="order-strip">
          {plan.order.map((id, i) => (
            <li key={id}>
              {i > 0 && <ChevronRight aria-hidden="true" />}
              <span>{id}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EmptyBoard({ onLoadSample, onGoToCourses }) {
  const [error, setError] = useState('');
  const load = (name) => onLoadSample(name).catch((err) => setError(err.message));
  return (
    <section className="board empty-board">
      <div className="empty-copy">
        <h2>The board is empty</h2>
        <p>Load the 19-course sample curriculum to see the planner file it into semesters, or add your own courses.</p>
        <div className="button-row">
          <button className="btn btn-signal" onClick={() => load('courses')}><Library aria-hidden="true" />Load sample curriculum</button>
          <button className="btn" onClick={onGoToCourses}>Add courses</button>
        </div>
        {error && <p className="fault-inline" role="alert">{error}</p>}
      </div>
      <ol className="columns ghost-columns" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className="column"><div className="column-head"><span className="placard">Semester {n}</span></div><Gauge cards={[]} max={18} /></li>
        ))}
      </ol>
    </section>
  );
}

function CycleFault({ plan, onLoadSample, onGoToCourses }) {
  const [error, setError] = useState('');
  return (
    <section className="fault-tag" role="alert">
      <div className="fault-stripe" aria-hidden="true" />
      <div className="fault-body">
        <h2><Ban aria-hidden="true" />Circular Dependency Error</h2>
        <p>These courses require each other in a loop, so none of them can ever reach in-degree 0 and none can be taken first.</p>
        <ol className="cycle-loop" aria-label="Dependency cycle">
          {plan.cycle.map((id, i) => (
            <li key={`${id}-${i}`}>
              {i > 0 && <ArrowRight className="cycle-arrow" aria-label="is a prerequisite of" />}
              <span className="chip">{id}</span>
            </li>
          ))}
        </ol>
        <p className="fault-foot">Courses that cannot be scheduled: <b>{plan.blocked.join(', ')}</b>. Break the loop by removing one prerequisite.</p>
        <div className="button-row">
          <button className="btn" onClick={onGoToCourses}>Edit courses</button>
          <button className="btn" onClick={() => onLoadSample('courses').catch((err) => setError(err.message))}><Library aria-hidden="true" />Load the valid sample</button>
        </div>
        {error && <p className="fault-inline" role="alert">{error}</p>}
      </div>
    </section>
  );
}

function SemesterTable({ semester, sortBy, maxCredits }) {
  return (
    <section className="sheet">
      <div className="sheet-head row">
        <h2>Semester {semester.number}</h2>
        <span className="column-credits"><b>{semester.credits}</b>/{maxCredits} credits</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              {COLUMNS.map((column) => (
                <th key={column.key} className={column.key === sortBy ? 'sorted' : undefined}>{column.label}</th>
              ))}
              <th>Prerequisites</th>
            </tr>
          </thead>
          <tbody>
            {semester.courses.map((course, index) => (
              <tr key={course.id}>
                <td className="num">{index + 1}</td>
                {COLUMNS.map((column) => (
                  <td key={column.key} className={column.key === sortBy ? 'sorted' : undefined}>
                    {column.key === 'deadline' ? formatDate(course.deadline) : column.key === 'id' ? <span className={`id-chip d${course.difficulty}`}>{course.id}</span> : course[column.key]}
                  </td>
                ))}
                <td>{course.prerequisites.join(', ') || '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {semester.deferred.length > 0 && (
        <p className="note"><CornerDownRight aria-hidden="true" />Deferred to the next semester (credit limit): {semester.deferred.join(', ')}</p>
      )}
    </section>
  );
}
