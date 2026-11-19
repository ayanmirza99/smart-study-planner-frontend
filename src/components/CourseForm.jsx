import { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';

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

// 1–5 rating as native radios, so arrow keys and screen readers work for free
function Scale({ name, label, value, onChange, low, high, colored }) {
  return (
    <fieldset className="scale">
      <legend>{label}</legend>
      <div className="scale-options">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={colored ? `scale-option d${n}` : 'scale-option'}>
            <input type="radio" name={name} value={n} checked={Number(value) === n} onChange={onChange} />
            <span>{n}</span>
          </label>
        ))}
      </div>
      <div className="scale-ends"><span>{low}</span><span>{high}</span></div>
    </fieldset>
  );
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
    <form className={`course-form d${form.difficulty}`} onSubmit={handleSubmit}>
      <div className="form-tab">
        <label className="field field-id">
          <span>Course ID</span>
          <input name="id" value={form.id} onChange={handleChange} disabled={Boolean(initial)} placeholder="CS101" required autoComplete="off" />
        </label>
        <label className="field field-credits">
          <span>Credits</span>
          <input name="credits" type="number" min="1" max="18" value={form.credits} onChange={handleChange} required />
        </label>
      </div>
      <div className="form-body">
        <label className="field">
          <span>Name</span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Programming Fundamentals" required autoComplete="off" />
        </label>
        <Scale name="priority" label="Priority" value={form.priority} onChange={handleChange} low="Low" high="Must take" />
        <Scale name="difficulty" label="Difficulty (card colour)" value={form.difficulty} onChange={handleChange} low="Easy" high="Very hard" colored />
        <label className="field">
          <span>Deadline</span>
          <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
        </label>
        <label className="field">
          <span>Prerequisites</span>
          <input name="prerequisites" value={form.prerequisites} onChange={handleChange} placeholder="CS101, MT101" autoComplete="off" />
          <small>Course IDs, separated by commas</small>
        </label>
        <div className="button-row">
          <button type="submit" className="btn btn-signal">
            {initial ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
            {initial ? 'Save changes' : 'Add course'}
          </button>
          {initial && <button type="button" className="btn" onClick={onCancel}><X aria-hidden="true" />Cancel</button>}
        </div>
      </div>
    </form>
  );
}
