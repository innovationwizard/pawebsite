"use client";

import { useEffect, useMemo, useState } from "react";
import { Select } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

interface Departamento {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

interface Municipio {
  id: string;
  departamento_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

interface Zona {
  id: string;
  municipio_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

interface LocationPickerProps {
  value: string | null;
  onChange: (zonaId: string | null) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(true);

  const [deptoId, setDeptoId] = useState<string>("");
  const [muniId, setMuniId] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const [d, m, z] = await Promise.all([
        supabase
          .from("departamentos")
          .select("id, name, slug, sort_order")
          .order("sort_order", { ascending: true }),
        supabase
          .from("municipios")
          .select("id, departamento_id, name, slug, sort_order")
          .order("sort_order", { ascending: true }),
        supabase
          .from("zonas")
          .select("id, municipio_id, name, slug, sort_order")
          .order("sort_order", { ascending: true }),
      ]);
      if (cancelled) return;
      setDepartamentos((d.data ?? []) as Departamento[]);
      setMunicipios((m.data ?? []) as Municipio[]);
      setZonas((z.data ?? []) as Zona[]);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!value) {
      setDeptoId("");
      setMuniId("");
      return;
    }
    const zona = zonas.find((z) => z.id === value);
    if (!zona) {
      setDeptoId("");
      setMuniId("");
      return;
    }
    const muni = municipios.find((m) => m.id === zona.municipio_id);
    setMuniId(muni?.id ?? "");
    setDeptoId(muni?.departamento_id ?? "");
  }, [value, loading, zonas, municipios]);

  const filteredMunicipios = useMemo(
    () => municipios.filter((m) => m.departamento_id === deptoId),
    [municipios, deptoId],
  );

  const filteredZonas = useMemo(
    () => zonas.filter((z) => z.municipio_id === muniId),
    [zonas, muniId],
  );

  function handleDeptoChange(id: string) {
    setDeptoId(id);
    setMuniId("");
    onChange(null);
  }

  function handleMuniChange(id: string) {
    setMuniId(id);
    onChange(null);
  }

  function handleZonaChange(id: string) {
    onChange(id || null);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3 sm:col-span-2">
      <Select
        id="departamento"
        label="Departamento"
        value={deptoId}
        onChange={(e) => handleDeptoChange(e.target.value)}
        placeholder={loading ? "Cargando…" : "Selecciona departamento"}
        disabled={loading}
        options={departamentos.map((d) => ({ value: d.id, label: d.name }))}
      />
      <Select
        id="municipio"
        label="Municipio"
        value={muniId}
        onChange={(e) => handleMuniChange(e.target.value)}
        placeholder={
          !deptoId ? "Selecciona departamento primero" : "Selecciona municipio"
        }
        disabled={loading || !deptoId}
        options={filteredMunicipios.map((m) => ({ value: m.id, label: m.name }))}
      />
      <Select
        id="zona"
        label="Zona"
        value={value ?? ""}
        onChange={(e) => handleZonaChange(e.target.value)}
        placeholder={!muniId ? "Selecciona municipio primero" : "Selecciona zona"}
        disabled={loading || !muniId}
        options={filteredZonas.map((z) => ({ value: z.id, label: z.name }))}
      />
    </div>
  );
}
