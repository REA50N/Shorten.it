"use client";

import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      theme="dark"
      richColors
      position="top-center"
      style={{ zIndex: 9999 }}
      closeButton
    />
  );
}
