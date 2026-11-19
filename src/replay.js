// Mirrors the backend comparator (secureflow/src/algorithms/compare.js) so the replay scans
// each semester's ready queue in the same order the greedy packer did.
const SORT_ORDER = { priority: 'desc', deadline: 'asc', credits: 'desc', difficulty: 'desc' };

function compareBy(key) {
  const direction = SORT_ORDER[key] === 'asc' ? 1 : -1;
  return (a, b) => {
    if (a[key] < b[key]) return -direction;
    if (a[key] > b[key]) return direction;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  };
}

// Turns a finished plan into the steps the planner took: for every semester, the ranked
// in-degree-0 queue, then each course either taken (fits under maxCredits) or deferred,
// then the source-removal step that unlocks the next semester's courses.
export function buildSteps(plan) {
  const byId = new Map(plan.semesters.flatMap((s) => s.courses).map((c) => [c.id, c]));
  const compare = compareBy(plan.sortBy);
  const steps = [];

  plan.semesters.forEach((semester, column) => {
    const taken = new Set(semester.courses.map((c) => c.id));
    const queue = [...semester.courses, ...semester.deferred.map((id) => byId.get(id))].sort(compare);
    steps.push({ kind: 'queue', column, queue: queue.map((c) => c.id), credits: 0 });

    let credits = 0;
    for (const course of queue) {
      const kind = taken.has(course.id) ? 'take' : 'defer';
      if (kind === 'take') credits += course.credits;
      steps.push({ kind, column, courseId: course.id, credits, queue: queue.map((c) => c.id) });
    }

    const next = plan.semesters[column + 1];
    if (next) {
      const carried = new Set(semester.deferred);
      const unlocked = next.courses.map((c) => c.id).concat(next.deferred).filter((id) => !carried.has(id));
      steps.push({ kind: 'unlock', column, credits, removed: semester.courses.map((c) => c.id), unlocked: [...new Set(unlocked)], carried: semester.deferred });
    }
  });

  return steps;
}

// What the board shows after step `index`: which cards sit in which column and each queue entry's fate.
export function boardAt(plan, steps, index) {
  const columns = plan.semesters.map(() => ({ cards: [], deferred: [], credits: 0 }));
  const fate = new Map();
  for (const step of steps.slice(0, index + 1)) {
    if (step.kind === 'queue') {
      fate.clear();
      continue;
    }
    if (step.kind === 'unlock') continue;
    fate.set(step.courseId, step.kind);
    const column = columns[step.column];
    column.credits = step.credits;
    if (step.kind === 'take') column.cards.push(step.courseId);
    else column.deferred.push(step.courseId);
  }
  return { columns, fate };
}

// Unmet prerequisites (in-degree in the remaining graph) for every course not yet placed
export function inDegrees(courses, placed) {
  return new Map(courses.filter((c) => !placed.has(c.id)).map((c) => [c.id, c.prerequisites.filter((id) => !placed.has(id)).length]));
}
