const WIDTH = 600;
const HEIGHT = 300;
const LEFT = 64;
const RIGHT = 110;
const TOP = 20;
const BOTTOM = 48;

function formatValue(value) {
  return value < 10 ? value.toFixed(2) : Math.round(value).toLocaleString();
}

// Round axis step (1, 2 or 5 × 10^k) giving about four gridlines
function niceStep(max) {
  const raw = max / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * power).find((step) => step >= raw);
}

// lines: [{ key, label, tone: 'fast' | 'slow', bigO }]; the Big-O label is set at the end of each line
export default function LineChart({ rows, xKey, xLabel, yLabel, lines }) {
  const maxX = Math.max(...rows.map((row) => row[xKey]));
  const dataMax = Math.max(...rows.flatMap((row) => lines.map((line) => row[line.key]))) || 1;
  const stepY = niceStep(dataMax);
  const maxY = Math.ceil(dataMax / stepY) * stepY;
  const decimals = stepY < 1 ? Math.ceil(-Math.log10(stepY)) : 0;
  const tickLabel = (tick) => tick.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const toX = (value) => LEFT + (value / maxX) * (WIDTH - LEFT - RIGHT);
  const toY = (value) => HEIGHT - BOTTOM - (value / maxY) * (HEIGHT - TOP - BOTTOM);
  const yTicks = Array.from({ length: Math.round(maxY / stepY) + 1 }, (_, i) => i * stepY);
  const lastRow = rows[rows.length - 1];

  return (
    <figure className="chart">
      <figcaption className="legend">
        {lines.map((line) => (
          <span key={line.key} className={`legend-item tone-${line.tone}`}>
            <i />
            {line.label}
          </span>
        ))}
      </figcaption>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${yLabel} against ${xLabel}`}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={LEFT} x2={WIDTH - RIGHT} y1={toY(tick)} y2={toY(tick)} className={tick === 0 ? 'chart-axis' : 'chart-grid'} />
            <text x={LEFT - 8} y={toY(tick) + 4} textAnchor="end" className="chart-text">{tickLabel(tick)}</text>
          </g>
        ))}

        {rows.map((row) => (
          <text key={row[xKey]} x={toX(row[xKey])} y={HEIGHT - BOTTOM + 18} textAnchor="middle" className="chart-text">
            {row[xKey].toLocaleString()}
          </text>
        ))}

        <text x={(LEFT + WIDTH - RIGHT) / 2} y={HEIGHT - 6} textAnchor="middle" className="chart-title">{xLabel}</text>
        <text transform={`translate(14 ${(TOP + HEIGHT - BOTTOM) / 2}) rotate(-90)`} textAnchor="middle" className="chart-title">
          {yLabel}
        </text>

        {lines.map((line) => (
          <g key={line.key} className={`series tone-${line.tone}`}>
            <polyline points={rows.map((row) => `${toX(row[xKey])},${toY(row[line.key])}`).join(' ')} />
            {rows.map((row) => (
              <circle key={row[xKey]} cx={toX(row[xKey])} cy={toY(row[line.key])} r="3.5">
                <title>{`${line.label}: ${formatValue(row[line.key])} ms at ${row[xKey]}`}</title>
              </circle>
            ))}
            <text x={toX(lastRow[xKey]) + 10} y={toY(lastRow[line.key]) + 5} className="series-label">{line.bigO}</text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
