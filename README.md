# Smart Study Planner: Frontend

DAA semester project. This is the React frontend. It talks to the Smart Study Planner backend API, which is in a separate repository (`secureflow`), where all the algorithms run.

**Group members:** Fuzail Ahmed Siddiqui (CT-24177), Ayan Mirza (CT-24197), Ahmed Raza (CT-24171), Hassan Shakil (CT-24185)

## How to run

Start the backend first; it runs on http://localhost:3001. Then:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

The frontend calls the backend at `http://localhost:3001` by default. If the backend runs somewhere else, copy `.env.example` to `.env` and change `VITE_API_URL`.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the app into `dist/` |
| `npm run preview` | Serves the built app |

## Using the app

1. **Courses tab:** add, edit or delete courses. Or click **Load sample courses** to load a 19-course curriculum. **Load cycle example** loads courses that contain a circular prerequisite.
2. **Study Plan tab:** pick a ranking key and the plan updates straight away. Each semester shows a ranked table, its total credits and any courses deferred because of the 18-credit limit. **Export CSV** downloads the plan. The graph view at the bottom draws each semester as a column, with arrows from prerequisites to courses. If the courses have a circular prerequisite, the tab shows a **Circular Dependency Error** listing the loop.
3. **Benchmark tab:** times merge sort against bubble sort, and topological sort against a repeated scan, on random data of increasing size. The results are shown as charts and tables.

## Project structure

```
index.html
src/
  main.jsx               Entry point
  App.jsx                Tabs and course loading
  api.js                 Calls to the backend API
  csv.js                 CSV export
  styles.css
  components/
    CoursesTab.jsx       Course list, sample buttons
    CourseForm.jsx       Add / edit form
    PlanTab.jsx          Semester tables, cycle error
    GraphView.jsx        SVG graph of the plan
    BenchmarkTab.jsx     Efficiency comparison
    LineChart.jsx        SVG line chart
```
