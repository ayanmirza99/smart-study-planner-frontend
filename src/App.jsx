import { useEffect, useState } from 'react';
import { RotateCw, PlugZap } from 'lucide-react';
import { api } from './api.js';
import CoursesTab from './components/CoursesTab.jsx';
import PlanTab from './components/PlanTab.jsx';
import BenchmarkTab from './components/BenchmarkTab.jsx';

const TABS = ['Study Plan', 'Courses', 'Benchmark'];

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="3" y="4" width="26" height="7" rx="1.5" className="bm-tab" />
      <rect x="9" y="11" width="14" height="17" rx="1.5" className="bm-body" />
      <path d="M12 17h8M12 21h5" className="bm-line" />
    </svg>
  );
}

export default function App() {
  const [tab, setTab] = useState('Study Plan');
  const [courses, setCourses] = useState([]);
  const [loadError, setLoadError] = useState('');

  async function loadCourses() {
    setCourses(await api.getCourses());
    setLoadError('');
  }

  function retry() {
    loadCourses().catch((error) => setLoadError(error.message));
  }

  useEffect(retry, []);

  // Shared by the empty board and the Courses tab; throws so callers can show the error their own way
  async function loadSample(name) {
    if (courses.length > 0 && !confirm('This replaces all current courses. Continue?')) {
      return false;
    }
    await api.loadSample(name);
    await loadCourses();
    return true;
  }

  return (
    <div className="app">
      <header className="frame">
        <div className="frame-inner">
          <div className="brand">
            <BrandMark />
            <div>
              <h1>Smart Study Planner</h1>
              <p className="brand-sub">Topological scheduling · DAA semester project</p>
            </div>
          </div>
          <nav className="tabs" aria-label="Sections">
            {TABS.map((name) => (
              <button
                key={name}
                className="tab"
                aria-current={tab === name ? 'page' : undefined}
                onClick={() => setTab(name)}
              >
                {name}
                {name === 'Courses' && <span className="tab-count">{courses.length}</span>}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="page">
        {loadError && (
          <div className="fault-banner" role="alert">
            <PlugZap aria-hidden="true" />
            <div>
              <strong>Backend offline</strong>
              <p>{loadError} Start it with <code>npm start</code> in the backend repo, then retry.</p>
            </div>
            <button className="btn" onClick={retry}><RotateCw aria-hidden="true" />Retry</button>
          </div>
        )}

        {tab === 'Study Plan' && <PlanTab courses={courses} onLoadSample={loadSample} onGoToCourses={() => setTab('Courses')} />}
        {tab === 'Courses' && <CoursesTab courses={courses} onChange={loadCourses} onLoadSample={loadSample} />}
        {tab === 'Benchmark' && <BenchmarkTab />}
      </main>

      <footer className="colophon">
        Fuzail Ahmed Siddiqui (CT-24177) · Ayan Mirza (CT-24197) · Ahmed Raza (CT-24171) · Hassan Shakil (CT-24185)
      </footer>
    </div>
  );
}
