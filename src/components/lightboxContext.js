import { createContext, useContext } from "react";

export const LightboxContext = createContext({ open: () => {} });

export function useLightbox() {
  return useContext(LightboxContext);
}
