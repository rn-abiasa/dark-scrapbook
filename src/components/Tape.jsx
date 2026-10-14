const ZIGZAG =
  "polygon(0 0,100% 0,97% 25%,100% 50%,97% 75%,100% 100%,0 100%,3% 75%,0 50%,3% 25%)";

// Selotip transparan pink, dipasang miring di sudut foto atau kertas.
export default function Tape({ className = "", rotate = -6 }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 h-5 w-14 bg-bunting/55 ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, clipPath: ZIGZAG }}
    />
  );
}
