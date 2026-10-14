import { useEffect, useState } from "react";
import Book from "./components/Book";
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
    <main className="grid min-h-dvh place-items-center overflow-x-clip">
      <h1 className="sr-only">
        Happy Birthday {content.name}, {content.age} tahun
      </h1>
      <Book
        data={content}
        phase={phase}
        onOpen={() => setPhase("opening")}
        onClose={() => setPhase("closed")}
      />
    </main>
  );
}
