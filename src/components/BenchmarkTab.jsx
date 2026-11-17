import { useState } from 'react';
import { api } from '../api.js';
import LineChart from './LineChart.jsx';

function ms(value) {
  return `${value.toFixed(2)} ms`;
}

function times(slow, fast) {
  return `${(slow / fast).toFixed(1)}x`;
}

export default function BenchmarkTab() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  async function runBenchmark() {
    setRunning(true);
    setError('');
    try {
      setResults(await api.runBenchmark());
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <>
      <section className="card">
        <div className="card-header">
          <h2>Efficiency comparison</h2>
          <button className="primary" onClick={runBenchmark} disabled={running}>
            {running ? 'Running...' : 'Run benchmark'}
          </button>
        </div>
        <p className="muted">
          Generates random courses (5 prerequisite links per course) and times each algorithm on the same data.
          Each time is the best of 3 runs.
        </p>
        {error && <p className="message error">{error}</p>}
      </section>

      {results && (
        <>
          <section className="card">
            <h2>Ranking: merge sort O(n log n) vs bubble sort O(n²)</h2>
            <LineChart
              rows={results.sorting}
              xKey="size"
              xLabel="Number of courses (n)"
              yLabel="Time (ms)"
              lines={[
                { key: 'mergeMs', label: 'Merge sort', color: '#2f6fed' },
                { key: 'bubbleMs', label: 'Bubble sort', color: '#e8590c' },
              ]}
            />
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>n</th>
                    <th>Merge sort</th>
                    <th>Bubble sort</th>
                    <th>Merge comparisons</th>
                    <th>Bubble comparisons</th>
                    <th>Merge sort is faster by</th>
                  </tr>
                </thead>
                <tbody>
                  {results.sorting.map((row) => (
                    <tr key={row.size}>
                      <td>{row.size}</td>
                      <td>{ms(row.mergeMs)}</td>
                      <td>{ms(row.bubbleMs)}</td>
                      <td>{row.mergeComparisons.toLocaleString()}</td>
                      <td>{row.bubbleComparisons.toLocaleString()}</td>
                      <td>{times(row.bubbleMs, row.mergeMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <h2>Scheduling: topological sort O(V + E) vs repeated scan O(V²)</h2>
            <LineChart
              rows={results.scheduling}
              xKey="size"
              xLabel="Number of courses (V)"
              yLabel="Time (ms)"
              lines={[
                { key: 'topoMs', label: 'Topological sort (source removal)', color: '#2f6fed' },
                { key: 'naiveMs', label: 'Repeated scan', color: '#e8590c' },
              ]}
            />
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Courses (V)</th>
                    <th>Links (E)</th>
                    <th>Topological sort</th>
                    <th>Repeated scan</th>
                    <th>Topological sort is faster by</th>
                  </tr>
                </thead>
                <tbody>
                  {results.scheduling.map((row) => (
                    <tr key={row.size}>
                      <td>{row.size}</td>
                      <td>{row.links.toLocaleString()}</td>
                      <td>{ms(row.topoMs)}</td>
                      <td>{ms(row.naiveMs)}</td>
                      <td>{times(row.naiveMs, row.topoMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}
