import { useEffect, useState } from "react";
import Book from "./components/Book";
import Cover from "./components/Cover";
import { content } from "./data/content";

export default function App() {
  const [phase, setPhase] = useState("closed"); // closed -> opening -> open

  useEffect(() => {
    if (phase !== "opening") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setPhase("open"), reduce ? 0 : 1250);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <main className="min-h-dvh">
      <h1 className="sr-only">
        Happy Birthday {content.name}, {content.age} tahun
      </h1>

      {phase === "open" ? (
        <div className="book-in pb-10">
          <Book data={content} name={content.name} />
          <button
            type="button"
            onClick={() => setPhase("closed")}
            className="mx-auto block font-hand text-2xl text-chalk/60 underline underline-offset-4 hover:text-chalk"
          >
            Tutup scrapbook
          </button>
        </div>
      ) : (
        <div className="grid min-h-dvh place-items-center py-8">
          <Cover
            name={content.name}
            age={content.age}
            phase={phase}
            onOpen={() => setPhase("opening")}
          />
        </div>
      )}
    </main>
  );
}
