// Semua isi placeholder ada di sini. Taruh foto di /public/photos lalu isi `src`
// dengan path-nya (contoh: "/photos/03.jpg"). Kalau `src` null, tampil kotak berwarna.
// Setiap foto punya entri sendiri, jadi tiap kotak bisa diisi foto yang berbeda.

import one from "../assets/11.webp";
import two from "../assets/12.webp";
import three from "../assets/13.webp";
import four from "../assets/14.webp";
import five from "../assets/15.webp";

export const content = {
  name: "Sella",
  age: 21,

  // ID video YouTube (11 karakter di URL setelah "v="). Ganti dengan lagu kalian.
  song: {
    id: "__Pb1fO2H2A",
    title: "Kita Lewati Berdua",
    artist: "Overnight",
  },

  left: {
    intro: "Happy birthday (untuk seseorang yang spesial banget)",
    body: [
      "Ini tempat untuk cerita pertama kalian. Tulis hari pertama bertemu, hal kecil yang masih diingat.",
      "Ganti teks ini dengan suratmu sendiri.",
    ],
    photoTop: { src: one, label: "Foto 1" },
    photoBottom: { src: two, label: "Foto 2" },
  },

  center: {
    greeting: "Sella 🤍",
    favourite: "Favourite person",
    // 8 kotak kolase berbentuk hati: 2 besar di atas, 4 di tengah, 2 di bawah
    collage: [
      { src: two, label: "Foto 3" }, // besar kiri atas
      { src: one, label: "Foto 4" }, // besar kanan atas
      { src: three, label: "Foto 5" },
      { src: four, label: "Foto 6" },
      { src: five, label: "Foto 7" },
      { src: one, label: "Foto 8" },
      { src: two, label: "Foto 9" }, // bawah kiri
      { src: three, label: "Foto 10" }, // bawah kanan
    ],
    call: "Panggilan masuk 2j 15m 6d",
    note: "Telepon yang panjang itu selalu terasa singkat kalau sama kamu.",
  },

  right: {
    intro: "I love you",
    body: [
      "Terima kasih sudah jadi tempat cerita paling aman.",
      "Tulis surat penutup di sini, pakai bahasamu sendiri.",
    ],
    photoTop: { src: three, label: "Foto 11" },
    photoBottom: { src: four, label: "Foto 12" },
  },

  // Garis waktu (maks. 5 momen, deskripsi singkat). Ganti dengan momen kalian.
  timeline: {
    intro: "Momen-momen kecil kita",
    title: "Perjalanan kita",
    items: [
      {
        date: "12 Maret 2022",
        title: "Pertama kali ngobrol",
        text: "Awalnya cuma balas story, lalu nggak berhenti sampai pagi.",
      },
      {
        date: "2 Juni 2022",
        title: "Ketemu pertama kali",
        text: "Canggung banget, tapi pulangnya senyum-senyum sendiri.",
      },
      {
        date: "14 Februari 2023",
        title: "Resmi jadian",
        text: "Hari yang nggak akan kami lupa, dan dia yang bilang duluan.",
      },
      {
        date: "9 Oktober 2023",
        title: "Liburan pertama",
        text: "Nyasar berdua, tapi itu jadi bagian paling lucu.",
      },
      {
        date: "Hari ini",
        title: "Ulang tahunmu",
        text: "Satu lagi cerita yang pengin aku tulis bareng kamu.",
      },
    ],
  },

  // Kebun mini: tiap bunga membawa satu pesan singkat (jumlah bunga = jumlah pesan, disarankan 6).
  garden: {
    intro: "Satu bunga untuk tiap alasan",
    title: "Kebun mini",
    hint: "Ketuk tanah untuk menanam bunga.",
    finale: "kebunnya penuh",
    flowers: [
      "Kamu bikin hari biasa terasa spesial.",
      "Tawamu itu hal favoritku.",
      "Kamu selalu dengerin sampai habis.",
      "Sama kamu, diam pun nyaman.",
      "Kamu percaya sama aku, bahkan saat aku ragu.",
      "Terima kasih sudah jadi kamu.",
    ],
  },
};
