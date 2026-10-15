import { useState } from "react";
import Book from "./components/Book";
import { content } from "./data/content";

export default function App() {
  // Satu boolean. Animasi buka/tutup sepenuhnya dikendalikan CSS lewat
  // atribut data-open (lihat .fold & .cover di index.css) -- tanpa setTimeout.
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="grid min-h-dvh place-items-center overflow-x-clip">
      <h1 className="sr-only">
        Happy Birthday {content.name}, {content.age} tahun
      </h1>
      <Book
        data={content}
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      />
    </main>
  );
}
