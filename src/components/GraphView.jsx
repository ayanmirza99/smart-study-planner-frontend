import { useState } from 'react';

const NODE_WIDTH = 120;
const NODE_HEIGHT = 44;
const TAB_HEIGHT = 8;
const COLUMN_GAP = 64;
const ROW_GAP = 14;
const PADDING = 16;
const LABEL_HEIGHT = 30;
const MAX_COURSES_SHOWN = 150;

function columnX(column) {
  return PADDING + column * (NODE_WIDTH + COLUMN_GAP);
}

// Every course reachable from `id` by following `next` links (prerequisites or dependents)
function reach(id, next) {
  const seen = new Set();
  const stack = [id];
  while (stack.length) {
    for (const other of next.get(stack.pop()) ?? []) {
      if (!seen.has(other)) {
        seen.add(other);
        stack.push(other);
      }
    }
  }
  return seen;
}

export default function GraphView({ semesters }) {
  const [focus, setFocus] = useState(null);
  const courseCount = semesters.reduce((total, semester) => total + semester.courses.length, 0);
  if (courseCount > MAX_COURSES_SHOWN) {
    return <p className="note">The graph view is only drawn for up to {MAX_COURSES_SHOWN} courses.</p>;
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
  const prereqs = new Map();
  const dependents = new Map();
  for (const { course } of positions.values()) {
    prereqs.set(course.id, course.prerequisites);
    for (const prereqId of course.prerequisites) {
      edges.push({ id: `${prereqId}-${course.id}`, fromId: prereqId, toId: course.id, from: positions.get(prereqId), to: positions.get(course.id) });
      dependents.set(prereqId, [...(dependents.get(prereqId) ?? []), course.id]);
    }
  }

  const chain = focus ? new Set([focus, ...reach(focus, prereqs), ...reach(focus, dependents)]) : null;
  const lit = (id) => !chain || chain.has(id);

  return (
    <div className="graph-scroll">
      <svg width={width} height={height} className={chain ? 'graph is-tracing' : 'graph'} role="img" aria-label="Prerequisite graph by semester">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" className="graph-arrow" />
          </marker>
          <marker id="arrow-lit" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" className="graph-arrow-lit" />
          </marker>
        </defs>

        {semesters.map((semester, column) => (
          <text key={semester.number} x={columnX(column)} y={PADDING + 12} className="graph-label">
            SEMESTER {semester.number}
          </text>
        ))}

        {edges.map(({ id, fromId, toId, from, to }) => {
          const x1 = from.x + NODE_WIDTH;
          const y1 = from.y + NODE_HEIGHT / 2;
          const x2 = to.x;
          const y2 = to.y + NODE_HEIGHT / 2;
          const middleX = (x1 + x2) / 2;
          const on = chain && chain.has(fromId) && chain.has(toId);
          // Adjacent semesters: a curve inside the gutter. Longer edges run along the row gap above the
          // target so they never cross a node body in the semesters they skip.
          const lane = to.y - ROW_GAP / 2;
          const exitX = x1 + COLUMN_GAP / 2;
          const enterX = x2 - COLUMN_GAP / 2;
          const d = x2 - x1 <= COLUMN_GAP
            ? `M${x1},${y1} C${middleX},${y1} ${middleX},${y2} ${x2},${y2}`
            : `M${x1},${y1} H${exitX} V${lane} H${enterX} V${y2} H${x2}`;
          return (
            <path
              key={id}
              d={d}
              className={on ? 'graph-edge is-lit' : 'graph-edge'}
              markerEnd={on ? 'url(#arrow-lit)' : 'url(#arrow)'}
            />
          );
        })}

        {[...positions.values()].map(({ x, y, course }) => (
          <g
            key={course.id}
            className={`graph-node d${course.difficulty}${lit(course.id) ? '' : ' is-dim'}${focus === course.id ? ' is-focus' : ''}`}
            tabIndex={0}
            onMouseEnter={() => setFocus(course.id)}
            onMouseLeave={() => setFocus(null)}
            onFocus={() => setFocus(course.id)}
            onBlur={() => setFocus(null)}
          >
            <title>{`${course.name} (${course.credits} credits)`}</title>
            <rect x={x} y={y} width={NODE_WIDTH} height={NODE_HEIGHT} rx="3" className="node-body" />
            <rect x={x} y={y} width={NODE_WIDTH} height={TAB_HEIGHT} rx="2" className="node-tab" />
            <text x={x + 10} y={y + TAB_HEIGHT + 22} className="node-id">{course.id}</text>
            <text x={x + NODE_WIDTH - 10} y={y + TAB_HEIGHT + 22} className="node-cr">{course.credits} cr</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
