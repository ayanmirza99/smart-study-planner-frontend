import { useState } from 'react';
import { api } from '../api.js';
import CourseForm from './CourseForm.jsx';

export default function CoursesTab({ courses, onChange }) {
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

  function loadSample(name) {
    if (courses.length === 0 || confirm('This replaces all current courses. Continue?')) {
      run(() => api.loadSample(name), 'Sample loaded');
    }
  }

  function clearAll() {
    if (confirm('Delete all courses?')) {
      run(api.clearCourses, 'All courses deleted');
    }
  }

  return (
    <>
      <section className="card">
        <h2>{editing ? `Edit ${editing.id}` : 'Add a course'}</h2>
        <CourseForm
          key={editing ? editing.id : 'new'}
          initial={editing}
          onSave={saveCourse}
          onCancel={() => setEditing(null)}
        />
      </section>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}

      <section className="card">
        <div className="card-header">
          <h2>Courses ({courses.length})</h2>
          <div className="actions">
            <button onClick={() => loadSample('courses')}>Load sample courses</button>
            <button onClick={() => loadSample('cycle')}>Load cycle example</button>
            <button className="danger" onClick={clearAll} disabled={courses.length === 0}>Clear all</button>
          </div>
        </div>

        {courses.length === 0 ? (
          <p className="muted">No courses yet. Add one above or load a sample.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Credits</th>
                  <th>Priority</th>
                  <th>Difficulty</th>
                  <th>Deadline</th>
                  <th>Prerequisites</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td><strong>{course.id}</strong></td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td>{course.priority}</td>
                    <td>{course.difficulty}</td>
                    <td>{course.deadline}</td>
                    <td>{course.prerequisites.join(', ') || '-'}</td>
                    <td className="row-actions">
                      <button onClick={() => setEditing(course)}>Edit</button>
                      <button className="danger" onClick={() => deleteCourse(course.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
