const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const SERVER_DOWN_MESSAGE = `Could not reach the backend at ${API_URL}. Is it running?`;

async function request(method, path, body) {
  const options = { method };
  if (body) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_URL + path, options).catch(() => null);
  if (!response) {
    throw new Error(SERVER_DOWN_MESSAGE);
  }

  const data = await response.json().catch(() => ({ errors: [SERVER_DOWN_MESSAGE] }));
  if (!response.ok) {
    throw new Error(data.errors.join('\n'));
  }
  return data;
}

export const api = {
  getCourses: () => request('GET', '/api/courses'),
  addCourse: (course) => request('POST', '/api/courses', course),
  updateCourse: (course) => request('PUT', `/api/courses/${course.id}`, course),
  deleteCourse: (id) => request('DELETE', `/api/courses/${id}`),
  clearCourses: () => request('DELETE', '/api/courses'),
  loadSample: (name) => request('POST', `/api/samples/${name}`),
  makePlan: (sortBy) => request('POST', '/api/plan', { sortBy }),
  runBenchmark: () => request('GET', '/api/benchmark'),
};
