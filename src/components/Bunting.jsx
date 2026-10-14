const COLORS = ["#e9b6bf", "#f2cbd1", "#df9fac"];

function quad(p0, p1, p2, t) {
  const u = 1 - t;
  return {
    x: u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    y: u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
    dx: 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]),
    dy: 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]),
  };
}

// Bendera huruf pink yang menggantung di tali melengkung.
export default function Bunting({ text, w = 280, sag = 18, className = "" }) {
  const letters = [...text];
  const n = letters.length;
  const top = 8;
  const p0 = [6, top];
  const p1 = [w / 2, top + sag * 2];
  const p2 = [w - 6, top];
  const fw = Math.min(28, ((w - 12) / n) * 0.88);
  const fh = 26;
  const H = top + sag + fh + 14;

  return (
    <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} className={`h-auto max-w-full ${className}`} aria-hidden="true">
      <path
        d={`M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`}
        fill="none"
        stroke="#ece7dc"
        strokeOpacity="0.75"
        strokeWidth="1.2"
      />
      {letters.map((ch, i) => {
        const { x, y, dx, dy } = quad(p0, p1, p2, (i + 0.5) / n);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + ((i * 37) % 7) - 3;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <polygon
              points={`${-fw / 2},0 ${fw / 2},0 ${fw / 2},${fh} 0,${fh + 8} ${-fw / 2},${fh}`}
              fill={COLORS[i % COLORS.length]}
            />
            <text
              x="0"
              y={fh * 0.72}
              textAnchor="middle"
              fontFamily="var(--font-hand)"
              fontSize="22"
              fill="#141312"
            >
              {ch}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
