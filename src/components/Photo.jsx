import Tape from "./Tape";
import { useLightbox } from "./lightboxContext";
import { placeholderStyle } from "./placeholder";

// Foto bingkai putih yang "ditempel" rata di kertas (bayangan tipis, tanpa mengapung).
// Klik untuk memperbesar (lightbox).
export default function Photo({
  src,
  label = "Foto",
  alt = "",
  index = 0,
  rotate = 0,
  ratio = "aspect-[4/5]",
  tape = false,
  tapeClass = "-top-[2.222cqw] left-1/2 -translate-x-1/2",
  className = "",
  style,
}) {
  const { open } = useLightbox();
  const name = alt || label;

  return (
    <figure
      className={`relative flex flex-col bg-chalk p-[1.667cqw] shadow-[0_0.278cqw_0.278cqw_rgba(0,0,0,0.6)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      {tape && <Tape className={tapeClass} rotate={rotate * -1.5 - 3} />}
      <button
        type="button"
        onClick={() => open(index)}
        aria-label={`Perbesar foto: ${name}`}
        className={`relative block w-full min-h-0 flex-1 cursor-zoom-in overflow-hidden ${ratio}`}
      >
        {src ? (
          <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span
            className="absolute inset-0 grid place-items-center font-hand text-[6.667cqw] leading-none text-chalk/70"
            style={placeholderStyle(index)}
          >
            {label}
          </span>
        )}
      </button>
    </figure>
  );
}
