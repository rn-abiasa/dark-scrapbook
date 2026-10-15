import { useEffect, useState } from "react";

// Isi dialog "Perjalanan kita". Tiap momen muncul bergantian setelah dialog terbuka.
export default function Timeline({ data }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const last = data.items.length - 1;

  return (
    <>
      <div className="pr-16">
        <p className="font-type text-xs text-chalk/70">{data.intro}</p>
        <h2 className="mt-1 font-hand text-4xl leading-none text-chalk">{data.title}</h2>
      </div>

      <ol className={`relative mt-6 flex flex-col gap-5 pl-7 ${on ? "tl-on" : ""}`}>
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[5px] top-2 border-l border-dashed border-chalk/40"
        />
        {data.items.map((item, i) => (
          <li
            key={item.date + item.title}
            className="tl-item relative"
            style={{ "--d": `${250 + i * 130}ms` }}
          >
            <span
              aria-hidden="true"
              className={`absolute -left-7 top-1 h-[11px] w-[11px] rounded-full border-2 border-chalk ${
                i === last ? "bg-bunting" : "bg-ink"
              }`}
            />
            <span
              className="inline-block bg-bunting px-2 py-px font-type text-[11px] leading-tight text-ink"
              style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
            >
              {item.date}
            </span>
            <h3 className="mt-1 font-hand text-[1.6rem] leading-none text-chalk">{item.title}</h3>
            <p className="font-hand text-[1.25rem] leading-[1.1] text-chalk/80">{item.text}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
