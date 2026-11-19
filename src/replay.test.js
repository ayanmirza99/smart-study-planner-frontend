// Run with: node src/replay.test.js  (checks the replay against a live plan if the backend is up)
import assert from 'node:assert/strict';
import { buildSteps, boardAt } from './replay.js';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

for (const sortBy of ['priority', 'deadline', 'credits', 'difficulty']) {
  const plan = await fetch(`${API_URL}/api/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sortBy }),
  }).then((r) => r.json());
  if (!plan.ok) continue;

  const steps = buildSteps(plan);
  for (const step of steps) {
    if (step.kind === 'take') assert.ok(step.credits <= plan.maxCredits, `${step.courseId} overfills`);
    if (step.kind === 'defer') {
      const course = plan.semesters.flatMap((s) => s.courses).find((c) => c.id === step.courseId);
      assert.ok(step.credits + course.credits > plan.maxCredits, `${step.courseId} deferred but fits (first-fit order mismatch)`);
    }
  }

  const final = boardAt(plan, steps, steps.length - 1);
  plan.semesters.forEach((semester, i) => {
    assert.deepEqual(final.columns[i].cards, semester.courses.map((c) => c.id));
    assert.deepEqual([...final.columns[i].deferred].sort(), [...semester.deferred].sort());
    assert.equal(final.columns[i].credits, semester.credits);
  });
  console.log(`ok ${sortBy}: ${steps.length} steps`);
}
