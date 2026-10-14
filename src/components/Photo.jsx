import Tape from "./Tape";

// Foto bingkai putih. Tanpa `src`, tampil kotak abu sebagai placeholder.
export default function Photo({
  src,
  label = "Foto",
  alt = "",
  rotate = 0,
  ratio = "aspect-[4/5]",
  tape = false,
  tapeClass = "-top-2 left-1/2 -translate-x-1/2",
  className = "",
  style,
}) {
  return (
    <figure
      className={`relative flex flex-col bg-chalk p-1.5 shadow-[0_6px_14px_rgba(0,0,0,0.55)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      {tape && <Tape className={tapeClass} rotate={rotate * -1.5 - 3} />}
      <div className={`relative min-h-0 flex-1 overflow-hidden ${ratio}`}>
        {src ? (
          <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(145deg,#4a4640,#2b2824)] font-type text-[11px] text-chalk/55">
            {label}
          </div>
        )}
      </div>
    </figure>
  );
}
