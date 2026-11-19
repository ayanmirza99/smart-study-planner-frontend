import { useState } from 'react';
import { Gauge, LoaderCircle } from 'lucide-react';
import { api } from '../api.js';
import LineChart from './LineChart.jsx';

function ms(value) {
  return `${value.toFixed(2)} ms`;
}

function times(slow, fast) {
  return `${(slow / fast).toFixed(1)}×`;
}

const MATCHUPS = [
  { fast: 'Merge sort', fastO: 'O(n log n)', slow: 'Bubble sort', slowO: 'O(n²)', what: 'Ranking the ready queue' },
  { fast: 'Topological sort', fastO: 'O(V + E)', slow: 'Repeated scan', slowO: 'O(V²)', what: 'Ordering by prerequisites' },
];

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

  const lastSort = results?.sorting.at(-1);
  const lastSched = results?.scheduling.at(-1);

  return (
    <>
      <section className="sheet bench-head">
        <div>
          <h2>Efficiency comparison</h2>
          <p className="note">
            Generates random courses (5 prerequisite links per course) and times each algorithm on the same data.
            Each time is the best of 3 runs.
          </p>
        </div>
        <button className="btn btn-signal" onClick={runBenchmark} disabled={running} aria-busy={running}>
          {running ? <LoaderCircle className="spin" aria-hidden="true" /> : <Gauge aria-hidden="true" />}
          {running ? 'Running…' : results ? 'Run again' : 'Run benchmark'}
        </button>
      </section>

      {error && <p className="fault-inline" role="alert">{error}</p>}

      {!results && !error && (
        <ul className="matchups">
          {MATCHUPS.map((m) => (
            <li key={m.fast} className="sheet">
              <h3>{m.fast} <span className="vs">vs</span> {m.slow}</h3>
              <p><span className="big-o tone-fast">{m.fastO}</span> <span className="vs">vs</span> <span className="big-o tone-slow">{m.slowO}</span> · {m.what}</p>
            </li>
          ))}
        </ul>
      )}

      {results && (
        <div className={running ? 'bench-results is-stale' : 'bench-results'}>
          <section className="sheet">
            <div className="sheet-head">
              <h2>Merge sort <span className="big-o tone-fast">O(n log n)</span> vs bubble sort <span className="big-o tone-slow">O(n²)</span></h2>
              <p className="verdict">At n = {lastSort.size.toLocaleString()}, merge sort is <b>{times(lastSort.bubbleMs, lastSort.mergeMs)}</b> faster.</p>
            </div>
            <LineChart
              rows={results.sorting}
              xKey="size"
              xLabel="Number of courses (n)"
              yLabel="Time (ms)"
              lines={[
                { key: 'mergeMs', label: 'Merge sort', tone: 'fast', bigO: 'O(n log n)' },
                { key: 'bubbleMs', label: 'Bubble sort', tone: 'slow', bigO: 'O(n²)' },
              ]}
            />
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th className="num">n</th>
                    <th className="num">Merge sort</th>
                    <th className="num">Bubble sort</th>
                    <th className="num">Merge comparisons</th>
                    <th className="num">Bubble comparisons</th>
                    <th className="num" title="Merge sort is faster by">Speed-up</th>
                  </tr>
                </thead>
                <tbody>
                  {results.sorting.map((row) => (
                    <tr key={row.size}>
                      <td className="num">{row.size.toLocaleString()}</td>
                      <td className="num">{ms(row.mergeMs)}</td>
                      <td className="num">{ms(row.bubbleMs)}</td>
                      <td className="num">{row.mergeComparisons.toLocaleString()}</td>
                      <td className="num">{row.bubbleComparisons.toLocaleString()}</td>
                      <td className="num"><b>{times(row.bubbleMs, row.mergeMs)}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="sheet">
            <div className="sheet-head">
              <h2>Topological sort <span className="big-o tone-fast">O(V + E)</span> vs repeated scan <span className="big-o tone-slow">O(V²)</span></h2>
              <p className="verdict">At V = {lastSched.size.toLocaleString()}, topological sort is <b>{times(lastSched.naiveMs, lastSched.topoMs)}</b> faster.</p>
            </div>
            <LineChart
              rows={results.scheduling}
              xKey="size"
              xLabel="Number of courses (V)"
              yLabel="Time (ms)"
              lines={[
                { key: 'topoMs', label: 'Topological sort (source removal)', tone: 'fast', bigO: 'O(V + E)' },
                { key: 'naiveMs', label: 'Repeated scan', tone: 'slow', bigO: 'O(V²)' },
              ]}
            />
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th className="num">Courses (V)</th>
                    <th className="num">Links (E)</th>
                    <th className="num">Topological sort</th>
                    <th className="num">Repeated scan</th>
                    <th className="num" title="Topological sort is faster by">Speed-up</th>
                  </tr>
                </thead>
                <tbody>
                  {results.scheduling.map((row) => (
                    <tr key={row.size}>
                      <td className="num">{row.size.toLocaleString()}</td>
                      <td className="num">{row.links.toLocaleString()}</td>
                      <td className="num">{ms(row.topoMs)}</td>
                      <td className="num">{ms(row.naiveMs)}</td>
                      <td className="num"><b>{times(row.naiveMs, row.topoMs)}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
