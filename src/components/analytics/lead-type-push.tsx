"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DataLayerPush } from "./data-layer-push";

const KNOWN_LEAD_TYPES = new Set(["contacto", "proyecto", "cotizador", "terrenos", "servicios"]);

function LeadTypePushInner() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("tipo");
  const leadType = raw && KNOWN_LEAD_TYPES.has(raw) ? raw : "contacto";
  const data = useMemo(() => ({ lead_type: leadType }), [leadType]);
  return <DataLayerPush event="lead_form_submitted" data={data} />;
}

/**
 * Fires `lead_form_submitted` with a `lead_type` read from `?tipo=` so GA4 /
 * ad platforms can split B2C (contacto, proyecto, cotizador, terrenos) from
 * B2B (servicios) conversions. Wrapped in Suspense so the page stays static.
 */
export function LeadTypePush() {
  return (
    <Suspense fallback={null}>
      <LeadTypePushInner />
    </Suspense>
  );
}
