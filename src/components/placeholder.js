// Warna placeholder berbeda untuk tiap foto, supaya tiap kotak terlihat sebagai foto sendiri.
export function placeholderStyle(index = 0) {
  const h = (index * 47 + 20) % 360;
  return {
    background: `linear-gradient(145deg, hsl(${h} 16% 32%), hsl(${h} 14% 18%))`,
  };
}
