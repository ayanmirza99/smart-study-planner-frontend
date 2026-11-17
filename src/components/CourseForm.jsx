import { useState } from 'react';

const EMPTY_FORM = {
  id: '',
  name: '',
  credits: 3,
  priority: 3,
  difficulty: 3,
  deadline: '',
  prerequisites: '',
};

function toForm(course) {
  if (!course) {
    return EMPTY_FORM;
  }
  return { ...course, prerequisites: course.prerequisites.join(', ') };
}

export default function CourseForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(toForm(initial));

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const course = {
      ...form,
      credits: Number(form.credits),
      priority: Number(form.priority),
      difficulty: Number(form.difficulty),
      prerequisites: form.prerequisites.split(',').map((id) => id.trim()).filter(Boolean),
    };

    const saved = await onSave(course);
    if (saved && !initial) {
      setForm(EMPTY_FORM);
    }
  }

  return (
    <form className="course-form" onSubmit={handleSubmit}>
      <label>
        Course ID
        <input name="id" value={form.id} onChange={handleChange} disabled={Boolean(initial)} placeholder="CS101" required />
      </label>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} placeholder="Programming Fundamentals" required />
      </label>
      <label>
        Credits
        <input name="credits" type="number" min="1" max="18" value={form.credits} onChange={handleChange} required />
      </label>
      <label>
        Priority (1-5)
        <input name="priority" type="number" min="1" max="5" value={form.priority} onChange={handleChange} required />
      </label>
      <label>
        Difficulty (1-5)
        <input name="difficulty" type="number" min="1" max="5" value={form.difficulty} onChange={handleChange} required />
      </label>
      <label>
        Deadline
        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
      </label>
      <label className="wide">
        Prerequisites (course IDs, comma separated)
        <input name="prerequisites" value={form.prerequisites} onChange={handleChange} placeholder="CS101, MT101" />
      </label>
      <div className="form-buttons">
        <button type="submit" className="primary">{initial ? 'Save changes' : 'Add course'}</button>
        {initial && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
