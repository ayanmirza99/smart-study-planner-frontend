import { useState } from 'react';
import { Pencil, Trash2, Library, Repeat2, Eraser, CircleCheck, CircleAlert } from 'lucide-react';
import { api } from '../api.js';
import CourseForm from './CourseForm.jsx';
import { formatDate } from './TCard.jsx';

export default function CoursesTab({ courses, onChange, onLoadSample }) {
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);

  async function run(action, successText) {
    try {
      await action();
      await onChange();
      setMessage({ type: 'success', text: successText });
      return true;
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      return false;
    }
  }

  async function saveCourse(course) {
    const saved = await run(
      () => (editing ? api.updateCourse(course) : api.addCourse(course)),
      editing ? `Updated ${course.id}` : `Added ${course.id.toUpperCase()}`,
    );
    if (saved) {
      setEditing(null);
    }
    return saved;
  }

  function deleteCourse(id) {
    if (confirm(`Delete ${id}?`)) {
      run(() => api.deleteCourse(id), `Deleted ${id}`);
    }
  }

  async function loadSample(name) {
    try {
      if (await onLoadSample(name)) {
        setMessage({ type: 'success', text: name === 'cycle' ? 'Cycle example loaded. Open Study Plan to see the error.' : 'Sample curriculum loaded' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  }

  function clearAll() {
    if (confirm('Delete all courses?')) {
      run(api.clearCourses, 'All courses deleted');
    }
  }

  return (
    <div className="courses-layout">
      <section className="sheet form-sheet">
        <h2>{editing ? `Edit ${editing.id}` : 'Add a course'}</h2>
        <CourseForm
          key={editing ? editing.id : 'new'}
          initial={editing}
          onSave={saveCourse}
          onCancel={() => setEditing(null)}
        />
        {message && (
          <p className={`status status-${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
            {message.type === 'error' ? <CircleAlert aria-hidden="true" /> : <CircleCheck aria-hidden="true" />}
            <span>{message.text}</span>
          </p>
        )}
      </section>

      <section className="sheet list-sheet">
        <div className="sheet-head row">
          <h2>Courses <span className="count">{courses.length}</span></h2>
          <div className="button-row">
            <button className="btn" onClick={() => loadSample('courses')}><Library aria-hidden="true" />Load sample courses</button>
            <button className="btn" onClick={() => loadSample('cycle')}><Repeat2 aria-hidden="true" />Load cycle example</button>
            <button className="btn btn-danger" onClick={clearAll} disabled={courses.length === 0}><Eraser aria-hidden="true" />Clear all</button>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="empty-note">
            <p><b>No courses yet.</b> Add one with the form, or load the 19-course sample curriculum.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th className="num">Credits</th>
                  <th className="num">Priority</th>
                  <th className="num">Difficulty</th>
                  <th>Deadline</th>
                  <th>Prerequisites</th>
                  <th><span className="visually-hidden">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className={editing?.id === course.id ? 'is-editing' : undefined}>
                    <td><span className={`id-chip d${course.difficulty}`}>{course.id}</span></td>
                    <td className="name-cell">{course.name}</td>
                    <td className="num">{course.credits}</td>
                    <td className="num">{course.priority}</td>
                    <td className="num">{course.difficulty}</td>
                    <td>{formatDate(course.deadline)}</td>
                    <td className="prereq-cell">{course.prerequisites.join(', ') || '–'}</td>
                    <td className="row-actions"><div>
                      <button className="icon-btn" onClick={() => { setEditing(course); document.querySelector('.form-sheet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} aria-label={`Edit ${course.id}`} title="Edit"><Pencil aria-hidden="true" /></button>
                      <button className="icon-btn icon-btn-danger" onClick={() => deleteCourse(course.id)} aria-label={`Delete ${course.id}`} title="Delete"><Trash2 aria-hidden="true" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
