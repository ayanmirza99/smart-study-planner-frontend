import { useEffect, useState } from 'react';
import { api } from './api.js';
import CoursesTab from './components/CoursesTab.jsx';
import PlanTab from './components/PlanTab.jsx';
import BenchmarkTab from './components/BenchmarkTab.jsx';

const TABS = ['Courses', 'Study Plan', 'Benchmark'];

export default function App() {
  const [tab, setTab] = useState('Courses');
  const [courses, setCourses] = useState([]);
  const [loadError, setLoadError] = useState('');

  async function loadCourses() {
    setCourses(await api.getCourses());
    setLoadError('');
  }

  useEffect(() => {
    loadCourses().catch((error) => setLoadError(error.message));
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Smart Study Planner</h1>
        <nav>
          {TABS.map((name) => (
            <button key={name} className={tab === name ? 'tab active' : 'tab'} onClick={() => setTab(name)}>
              {name}
            </button>
          ))}
        </nav>
      </header>

      {loadError && <p className="message error">{loadError}</p>}

      {tab === 'Courses' && <CoursesTab courses={courses} onChange={loadCourses} />}
      {tab === 'Study Plan' && <PlanTab courses={courses} />}
      {tab === 'Benchmark' && <BenchmarkTab />}
    </div>
  );
}
