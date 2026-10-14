// Semua isi placeholder ada di sini. Ganti teks dan isi `src` foto dengan
// file di /public (contoh: "/photos/01.jpg"). Kalau `src` null, tampil kotak foto kosong.
export const content = {
  name: "Nama",
  age: 21,

  left: {
    intro: "Happy birthday (untuk seseorang yang spesial banget)",
    body: [
      "Ini tempat untuk cerita pertama kalian. Tulis hari pertama bertemu, hal kecil yang masih diingat sampai sekarang.",
      "Ganti teks ini dengan suratmu sendiri.",
    ],
    photoTop: { src: null, label: "Foto 1" },
    photoBottom: { src: null, label: "Foto 2" },
  },

  center: {
    greeting: "Happy Birthday dear",
    favourite: "Favourite person",
    // 8 foto kolase berbentuk hati
    collage: Array.from({ length: 8 }, (_, i) => ({ src: null, label: `Foto ${i + 3}` })),
    call: "Panggilan masuk 2j 15m 6d",
    note: "Telepon yang panjang itu selalu terasa singkat kalau sama kamu.",
  },

  right: {
    intro: "I love you",
    body: [
      "Terima kasih sudah jadi tempat cerita paling aman.",
      "Tulis surat penutup di sini, pakai bahasamu sendiri.",
    ],
    photoTop: { src: null, label: "Foto 11" },
    photoBottom: { src: null, label: "Foto 12" },
  },
};
