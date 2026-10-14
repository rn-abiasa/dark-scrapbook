export function Butterfly({ className = "" }) {
  return (
    <svg viewBox="0 0 60 50" className={className} aria-hidden="true">
      <path d="M30 25C20 4 2 8 6 24c2 10 16 10 24 4Z" fill="#e2b13c" stroke="#141312" strokeWidth="1.4" />
      <path d="M30 25C40 4 58 8 54 24c-2 10-16 10-24 4Z" fill="#e2b13c" stroke="#141312" strokeWidth="1.4" />
      <path d="M30 28C22 34 14 46 24 46c6 0 6-10 6-18Z" fill="#cf9a2a" stroke="#141312" strokeWidth="1.4" />
      <path d="M30 28c8 6 16 18 6 18-6 0-6-10-6-18Z" fill="#cf9a2a" stroke="#141312" strokeWidth="1.4" />
      <path d="M30 20v20" stroke="#141312" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 20c-2-6-5-8-7-9M30 20c2-6 5-8 7-9" fill="none" stroke="#141312" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Flower({ className = "" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="20"
          cy="10"
          rx="6"
          ry="10"
          fill="#a9bfd4"
          stroke="#ece7dc"
          strokeWidth="1.4"
          transform={`rotate(${a} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="#ece7dc" />
      <circle cx="20" cy="20" r="1.6" fill="#8ea6bd" />
    </svg>
  );
}

export function Sparkle({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M10 0c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z" fill="currentColor" />
    </svg>
  );
}

export function Heart({ className = "" }) {
  return (
    <svg viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 20C2 13 1 6 6 3.5 9 2 11 4 12 6c1-2 3-4 6-2.5 5 2.5 4 9.5-6 16.5Z" />
    </svg>
  );
}

export function Plane({ className = "" }) {
  return (
    <svg viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 11 22 2l-7 18-4-7-9-2Zm9 2L22 2" />
    </svg>
  );
}

export function Arrow({ className = "" }) {
  return (
    <svg viewBox="0 0 26 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 4c12-2 20 6 16 18M13 17l5 6 5-6" />
    </svg>
  );
}

export function ScribbleCircle({ className = "" }) {
  return (
    <svg
      viewBox="0 0 210 125"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        d="M22 58C14 24 92 6 150 20c54 14 52 76-30 88C50 118 6 94 24 54c10-22 48-38 88-42"
      />
    </svg>
  );
}
