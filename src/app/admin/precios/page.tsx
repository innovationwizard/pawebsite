"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface SyncResult {
  ok: boolean;
  synced_at: string;
  orion_count: number;
  projects: string[];
}

export default function AdminPreciosPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    setIsSyncing(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/sync-prices", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al sincronizar precios.");
        return;
      }

      setResult(data);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy">Precios</h1>
      <p className="mt-1 text-sm text-gray">
        Sincroniza los precios y tipos de unidad desde Orion Intelligence.
      </p>

      <div className="mt-8 max-w-lg rounded-2xl bg-white p-8">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-celeste px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-celeste/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-5 w-5 ${isSyncing ? "animate-spin" : ""}`}
          />
          {isSyncing ? "Sincronizando..." : "Sincronizar precios ahora"}
        </button>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-xl bg-green-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              Sincronización exitosa
            </div>
            <ul className="mt-3 space-y-1 text-sm text-green-700">
              {result.projects.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-green-600">
              {result.orion_count} unidades disponibles &middot; Datos al{" "}
              {new Date(result.synced_at).toLocaleString("es-GT")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
