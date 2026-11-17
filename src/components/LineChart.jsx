const WIDTH = 560;
const HEIGHT = 280;
const LEFT = 64;
const RIGHT = 16;
const TOP = 16;
const BOTTOM = 48;

function formatValue(value) {
  return value < 10 ? value.toFixed(2) : Math.round(value).toLocaleString();
}

export default function LineChart({ rows, xKey, xLabel, yLabel, lines }) {
  const maxX = Math.max(...rows.map((row) => row[xKey]));
  const maxY = Math.max(...rows.flatMap((row) => lines.map((line) => row[line.key]))) || 1;
  const toX = (value) => LEFT + (value / maxX) * (WIDTH - LEFT - RIGHT);
  const toY = (value) => HEIGHT - BOTTOM - (value / maxY) * (HEIGHT - TOP - BOTTOM);
  const yTicks = [0, maxY / 2, maxY];

  return (
    <div className="chart">
      <div className="legend">
        {lines.map((line) => (
          <span key={line.key}>
            <i style={{ background: line.color }} />
            {line.label}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={LEFT} x2={WIDTH - RIGHT} y1={toY(tick)} y2={toY(tick)} className="chart-grid" />
            <text x={LEFT - 8} y={toY(tick) + 4} textAnchor="end" className="chart-text">{formatValue(tick)}</text>
          </g>
        ))}

        {rows.map((row) => (
          <text key={row[xKey]} x={toX(row[xKey])} y={HEIGHT - BOTTOM + 18} textAnchor="middle" className="chart-text">
            {row[xKey]}
          </text>
        ))}

        <text x={(LEFT + WIDTH - RIGHT) / 2} y={HEIGHT - 6} textAnchor="middle" className="chart-text">{xLabel}</text>
        <text transform={`translate(14 ${(TOP + HEIGHT - BOTTOM) / 2}) rotate(-90)`} textAnchor="middle" className="chart-text">
          {yLabel}
        </text>

        {lines.map((line) => (
          <g key={line.key}>
            <polyline
              points={rows.map((row) => `${toX(row[xKey])},${toY(row[line.key])}`).join(' ')}
              fill="none"
              stroke={line.color}
              strokeWidth="2.5"
            />
            {rows.map((row) => (
              <circle key={row[xKey]} cx={toX(row[xKey])} cy={toY(row[line.key])} r="4" fill={line.color} />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
