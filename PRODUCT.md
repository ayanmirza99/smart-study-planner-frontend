# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Evaluators (primary moment):** the course instructor during a live demo / viva, seated up close at a laptop, judging whether the group understood and implemented the algorithms.
- **Students:** classmates who use it to turn their courses into a semester-by-semester plan.

## Product Purpose
Smart Study Planner is a Design & Analysis of Algorithms (DAA) semester project. Given courses with credits, priority, difficulty, deadline and prerequisites, it schedules them into semesters (at most 18 credits each), detects circular prerequisites, and benchmarks the algorithms against naive alternatives. Success means an evaluator can see each algorithm working and a student gets a correct plan.

## Positioning
The planner shows its algorithms instead of hiding them: topological sort (source removal), greedy credit-limited semester packing, merge-sort ranking by a chosen key, cycle detection, and measured complexity comparisons (merge vs bubble sort, topo sort vs repeated scan).

## Operating Context
- Backend is a separate repo (`secureflow`) at `VITE_API_URL` (default http://localhost:3001). All algorithms run there.
- Demo flow: load the sample (19-course curriculum) or the cycle example → view the plan → switch the ranking key → show the graph → run the benchmark.

## Capabilities and Constraints
- **Backend API is frozen:** endpoints and data shapes in `src/api.js` must not change.
- **All features stay:** course CRUD, sample + cycle loaders, clear all, ranking keys (priority, deadline, credits, difficulty), CSV export, prerequisite graph view, circular-dependency error, benchmark charts + tables.
- UX structure (navigation, flow, layout) may be redesigned freely.
- New npm dependencies are allowed when justified.

## Brand Commitments
Name: "Smart Study Planner". Group: Fuzail Ahmed Siddiqui (CT-24177), Ayan Mirza (CT-24197), Ahmed Raza (CT-24171), Hassan Shakil (CT-24185).

## Evidence on Hand
The sample data and benchmark results come from the backend at runtime. There are no testimonials, users or metrics, so none should be invented.

## Product Principles
1. Make the algorithm legible: every result shows the reasoning behind it (order, deferrals, cycle path, complexity).
2. Dense but legible up close: the demo happens on laptop screens, so rich detail is welcome but hierarchy must stay obvious.
3. Failure is a feature: the cycle error and the backend-down state get real design attention.
4. No dead ends: an empty state always points to the next action (load the sample, add a course).
