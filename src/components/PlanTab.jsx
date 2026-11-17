import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { downloadPlanCsv } from '../csv.js';
import GraphView from './GraphView.jsx';

const SORT_OPTIONS = {
  priority: 'Priority (highest first)',
  deadline: 'Deadline (earliest first)',
  credits: 'Credits (most first)',
  difficulty: 'Difficulty (hardest first)',
};

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'credits', label: 'Credits' },
  { key: 'priority', label: 'Priority' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'deadline', label: 'Deadline' },
];

export default function PlanTab({ courses }) {
  const [sortBy, setSortBy] = useState('priority');
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');

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
      <section className="card">
        <div className="card-header">
          <h2>Study plan</h2>
          <div className="actions">
            <label>
              Rank courses by
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>
            <button onClick={() => downloadPlanCsv(plan)} disabled={!hasPlan}>Export CSV</button>
          </div>
        </div>

        {error && <p className="message error">{error}</p>}
        {plan && !plan.ok && <CycleError plan={plan} />}
        {plan?.ok && <PlanSummary plan={plan} />}
      </section>

      {hasPlan && plan.semesters.map((semester) => (
        <SemesterCard key={semester.number} semester={semester} sortBy={plan.sortBy} maxCredits={plan.maxCredits} />
      ))}

      {hasPlan && (
        <section className="card">
          <h2>Graph view</h2>
          <GraphView semesters={plan.semesters} />
        </section>
      )}
    </>
  );
}

function PlanSummary({ plan }) {
  if (plan.semesters.length === 0) {
    return <p className="muted">No courses yet. Add courses in the Courses tab first.</p>;
  }

  return (
    <>
      <p>
        <strong>{plan.order.length}</strong> courses fit into <strong>{plan.semesters.length}</strong> semesters
        (at most {plan.maxCredits} credits each). Planned in {plan.timeMs.toFixed(2)} ms.
      </p>
      <p className="muted">Topological order: {plan.order.join(' → ')}</p>
    </>
  );
}

function CycleError({ plan }) {
  return (
    <div className="message error">
      <strong>Circular Dependency Error</strong>
      {'\n'}These courses depend on each other in a loop, so none of them can be taken first:
      <div className="cycle">{plan.cycle.join(' → ')}</div>
      Courses that cannot be scheduled: {plan.blocked.join(', ')}
    </div>
  );
}

function SemesterCard({ semester, sortBy, maxCredits }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>Semester {semester.number}</h2>
        <span className="muted">{semester.credits} / {maxCredits} credits</span>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              {COLUMNS.map((column) => (
                <th key={column.key} className={column.key === sortBy ? 'sorted' : ''}>{column.label}</th>
              ))}
              <th>Prerequisites</th>
            </tr>
          </thead>
          <tbody>
            {semester.courses.map((course, index) => (
              <tr key={course.id}>
                <td>{index + 1}</td>
                {COLUMNS.map((column) => (
                  <td key={column.key} className={column.key === sortBy ? 'sorted' : ''}>{course[column.key]}</td>
                ))}
                <td>{course.prerequisites.join(', ') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {semester.deferred.length > 0 && (
        <p className="muted">Deferred to the next semester (credit limit): {semester.deferred.join(', ')}</p>
      )}
    </section>
  );
}
