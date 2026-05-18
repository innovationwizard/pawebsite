"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

interface DataLayerPushProps {
  event: string;
  data?: Record<string, unknown>;
}

export function DataLayerPush({ event, data }: DataLayerPushProps) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  }, [event, data]);

  return null;
}
