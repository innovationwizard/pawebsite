"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">
          Algo salió mal
        </h1>
        <p className="mt-4 text-gray">
          Ocurrió un error inesperado. Por favor intenta de nuevo.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={reset}>Intentar de nuevo</Button>
          <a href="/">
            <Button variant="outline">Volver al Inicio</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
