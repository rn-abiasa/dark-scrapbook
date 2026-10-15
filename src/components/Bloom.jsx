// Satu bunga SVG. Saat `planted` berubah true, batang tumbuh lalu kepala bunga mekar
// (hanya transform pada dua grup kecil, lihat .bloom-* di index.css).
export default function Bloom({ color = "#e9b6bf", center = "#e2b13c", petals = 6, planted = true }) {
  return (
    <svg
      viewBox="0 0 60 90"
      className={`h-full w-full ${planted ? "is-planted" : ""}`}
      aria-hidden="true"
    >
      <g className="bloom-stem">
        <path d="M30 88C28 70 32 55 30 38" stroke="#7f9a78" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M30 68C20 66 16 58 15 52c9 2 14 8 15 16Z" fill="#7f9a78" />
        <path d="M30 60c10-2 14-10 15-15-9 2-14 8-15 15Z" fill="#6b8564" />
      </g>
      <g className="bloom-head">
        {Array.from({ length: petals }, (_, i) => (
          <ellipse
            key={i}
            cx="30"
            cy="25"
            rx="5"
            ry="9.5"
            fill={color}
            stroke="#141312"
            strokeWidth="0.8"
            transform={`rotate(${(360 / petals) * i} 30 34)`}
          />
        ))}
        <circle cx="30" cy="34" r="5.5" fill={center} stroke="#141312" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
