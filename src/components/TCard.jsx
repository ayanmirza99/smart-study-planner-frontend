const SHORT_DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: '2-digit', timeZone: 'UTC' });

export function formatDate(iso) {
  return iso ? SHORT_DATE.format(new Date(iso)) : '';
}

const META = [
  { key: 'priority', label: (c) => `P${c.priority}`, title: 'Priority' },
  { key: 'difficulty', label: (c) => `D${c.difficulty}`, title: 'Difficulty' },
  { key: 'deadline', label: (c) => formatDate(c.deadline), title: 'Deadline' },
];

// A course as a T-card: the colored tab (keyed to difficulty) sits proud of the slot, the body below it
export default function TCard({ course, sortBy, state }) {
  return (
    <div className={`tcard d${course.difficulty}`} data-state={state} title={`${course.id}: ${course.name}`}>
      <div className="tcard-tab">
        <span className="tcard-id">{course.id}</span>
        <span className={sortBy === 'credits' ? 'tcard-cr is-key' : 'tcard-cr'}>{course.credits} cr</span>
      </div>
      <div className="tcard-body">
        <span className="tcard-name">{course.name}</span>
        <span className="tcard-meta">
          {META.map((m) => (
            <span key={m.key} title={m.title} className={sortBy === m.key ? 'is-key' : undefined}>{m.label(course)}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

export function DifficultyKey() {
  return (
    <ul className="key" aria-label="Card colour key: difficulty">
      {[1, 2, 3, 4, 5].map((d) => (
        <li key={d}><i className={`swatch d${d}`} />D{d} {['Easy', 'Moderate', 'Medium', 'Hard', 'Very hard'][d - 1]}</li>
      ))}
    </ul>
  );
}
