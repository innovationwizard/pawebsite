"use client";

import { useEffect, useRef, useState } from "react";
import { getUtmParams } from "@/lib/utils/utm-params";

const LOADER_SRC = "https://webforms.pipedrive.com/f/loader";

declare global {
  interface Window {
    /** Read by the Pipedrive loader to prefill hidden fields mapped to JS variables. */
    pd_webform?: Record<string, string>;
  }
}

interface PipedriveWebFormProps {
  /** The form URL from the Pipedrive embed snippet (data-pd-webforms). */
  formUrl: string;
  /** Height reserved while the iframe loads, so the layout does not jump. */
  minHeight?: number;
}

/**
 * Pipedrive Web Form embed.
 *
 * The Pipedrive loader replaces the container with a cross-origin iframe and
 * keeps it sized via postMessage; styling of the fields lives in Pipedrive's
 * form editor and the post-submit redirect is a form setting there. This
 * component only mounts the loader reliably inside a React tree (the loader
 * scans the DOM once when it executes, so a fresh script element is appended
 * per mount) and exposes UTM parameters for hidden-field prefill.
 */
export function PipedriveWebForm({ formUrl, minHeight = 560 }: PipedriveWebFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const utm = getUtmParams();
    window.pd_webform = {
      ...(utm.utm_source ? { utm_source: utm.utm_source } : {}),
      ...(utm.utm_medium ? { utm_medium: utm.utm_medium } : {}),
      ...(utm.utm_campaign ? { utm_campaign: utm.utm_campaign } : {}),
      page_url: window.location.href,
    };

    // The loader marks initialised containers with an id; a fresh mount has none.
    const observer = new MutationObserver(() => {
      const iframe = container.querySelector("iframe");
      if (iframe) {
        iframe.addEventListener("load", () => setStatus("ready"), { once: true });
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true });

    const script = document.createElement("script");
    script.src = LOADER_SRC;
    script.async = true;
    script.onerror = () => setStatus("error");
    container.appendChild(script);

    return () => {
      observer.disconnect();
      script.remove();
    };
  }, [formUrl]);

  return (
    <div className="relative" style={{ minHeight: status === "ready" ? undefined : minHeight }}>
      {status === "loading" && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse space-y-4 rounded-xl"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-11 rounded-lg bg-navy/5" />
          ))}
          <div className="h-12 rounded-full bg-primary/15" />
        </div>
      )}
      {status === "error" && (
        <p className="text-sm text-gray">
          El formulario no pudo cargarse. Escríbenos por WhatsApp y te contactamos.
        </p>
      )}
      <div
        ref={containerRef}
        className={`pipedriveWebForms transition-opacity duration-300 ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
        data-pd-webforms={formUrl}
      />
    </div>
  );
}
