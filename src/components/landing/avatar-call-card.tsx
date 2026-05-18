"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, PhoneOff } from "lucide-react";
import { AvatarCall } from "@runwayml/avatars-react";
import "@runwayml/avatars-react/styles.css";

type CallState = "idle" | "active";

interface AvatarCallCardProps {
  photoUrl: string | null;
  name: string;
  title: string;
}

export function AvatarCallCard({ photoUrl, name, title }: AvatarCallCardProps) {
  const [callState, setCallState] = useState<CallState>("idle");

  if (callState === "active") {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <AvatarCall
          avatarId="55798887-ab64-47ac-ace3-93801f623427"
          connectUrl="/api/avatar/session"
          video={false}
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            onClick={() => setCallState("idle")}
            className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-red-700 active:scale-95"
            aria-label="Colgar llamada"
          >
            <PhoneOff className="h-4 w-4" />
            Colgar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-navy">
      <div className="flex flex-col items-center px-8 py-12 text-center">
        <div className="relative">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name}
              width={160}
              height={160}
              className="h-40 w-40 rounded-full object-cover ring-4 ring-celeste/30"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-celeste/20 ring-4 ring-celeste/30">
              <span className="font-heading text-4xl font-bold text-celeste">
                {name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
          )}
          <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-navy bg-green-400" />
        </div>

        <p className="mt-5 font-heading text-xl font-bold text-white">{name}</p>
        <p className="mt-1 text-sm text-white/60">{title}</p>

        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
          Habla directamente con nuestro asesor especializado. Disponible ahora.
        </p>

        <button
          onClick={() => setCallState("active")}
          className="mt-8 flex items-center gap-2.5 rounded-full bg-celeste px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-celeste/90 hover:shadow-celeste/30 hover:shadow-xl active:scale-95"
        >
          <Phone className="h-4 w-4" />
          LLAMAR
        </button>
      </div>
    </div>
  );
}
