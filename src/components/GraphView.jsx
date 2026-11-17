const NODE_WIDTH = 110;
const NODE_HEIGHT = 40;
const COLUMN_GAP = 70;
const ROW_GAP = 16;
const PADDING = 16;
const LABEL_HEIGHT = 28;
const MAX_COURSES_SHOWN = 150;

function columnX(column) {
  return PADDING + column * (NODE_WIDTH + COLUMN_GAP);
}

export default function GraphView({ semesters }) {
  const courseCount = semesters.reduce((total, semester) => total + semester.courses.length, 0);
  if (courseCount > MAX_COURSES_SHOWN) {
    return <p className="muted">The graph view is only drawn for up to {MAX_COURSES_SHOWN} courses.</p>;
  }

  const positions = new Map();
  semesters.forEach((semester, column) => {
    semester.courses.forEach((course, row) => {
      positions.set(course.id, {
        x: columnX(column),
        y: PADDING + LABEL_HEIGHT + row * (NODE_HEIGHT + ROW_GAP),
        course,
      });
    });
  });

  const tallestColumn = Math.max(...semesters.map((semester) => semester.courses.length));
  const width = columnX(semesters.length) - COLUMN_GAP + PADDING;
  const height = PADDING * 2 + LABEL_HEIGHT + tallestColumn * (NODE_HEIGHT + ROW_GAP) - ROW_GAP;

  const edges = [];
  for (const { course } of positions.values()) {
    for (const prereqId of course.prerequisites) {
      edges.push({ id: `${prereqId}-${course.id}`, from: positions.get(prereqId), to: positions.get(course.id) });
    }
  }

  return (
    <div className="graph-scroll">
      <svg width={width} height={height}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" className="graph-arrow" />
          </marker>
        </defs>

        {semesters.map((semester, column) => (
          <text key={semester.number} x={columnX(column) + NODE_WIDTH / 2} y={PADDING + 12} className="graph-label">
            Semester {semester.number}
          </text>
        ))}

        {edges.map(({ id, from, to }) => {
          const x1 = from.x + NODE_WIDTH;
          const y1 = from.y + NODE_HEIGHT / 2;
          const x2 = to.x;
          const y2 = to.y + NODE_HEIGHT / 2;
          const middleX = (x1 + x2) / 2;
          return (
            <path
              key={id}
              d={`M${x1},${y1} C${middleX},${y1} ${middleX},${y2} ${x2},${y2}`}
              className="graph-edge"
              markerEnd="url(#arrow)"
            />
          );
        })}

        {[...positions.values()].map(({ x, y, course }) => (
          <g key={course.id} className="graph-node">
            <title>{`${course.name} (${course.credits} credits)`}</title>
            <rect x={x} y={y} width={NODE_WIDTH} height={NODE_HEIGHT} rx="6" />
            <text x={x + NODE_WIDTH / 2} y={y + NODE_HEIGHT / 2 + 5}>{course.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
