"use client";

import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

export interface ProjectFilters {
  keyword: string;
  projectType: string;
  zone: string;
  bedrooms: string;
  priceMax: string;
}

const EMPTY_FILTERS: ProjectFilters = {
  keyword: "",
  projectType: "",
  zone: "",
  bedrooms: "",
  priceMax: "",
};

const PROJECT_TYPE_OPTIONS = [
  { value: "casas", label: "Casas" },
  { value: "apartamentos", label: "Apartamentos" },
  { value: "terrenos", label: "Terrenos" },
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
  { value: "mixed-use", label: "Uso mixto" },
];

const BEDROOM_OPTIONS = [
  { value: "1", label: "1 hab." },
  { value: "2", label: "2 hab." },
  { value: "3", label: "3 hab." },
  { value: "4", label: "4+ hab." },
];

const PRICE_MAX_OPTIONS = [
  { value: "500000", label: "Hasta Q500,000" },
  { value: "1000000", label: "Hasta Q1,000,000" },
  { value: "2000000", label: "Hasta Q2,000,000" },
  { value: "5000000", label: "Hasta Q5,000,000" },
];

interface ProjectFilterProps {
  zones: string[];
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  totalResults: number;
}

function activeFilterCount(filters: ProjectFilters): number {
  return Object.values(filters).filter(Boolean).length;
}

export function ProjectFilter({
  zones,
  filters,
  onFiltersChange,
  totalResults,
}: ProjectFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = activeFilterCount(filters);

  const update = useCallback(
    (key: keyof ProjectFilters, value: string) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange],
  );

  const clearAll = useCallback(() => {
    onFiltersChange(EMPTY_FILTERS);
  }, [onFiltersChange]);

  const filterPanelContent = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Tipo de proyecto */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray">
          Tipo de proyecto
        </label>
        <div className="relative">
          <select
            value={filters.projectType}
            onChange={(e) => update("projectType", e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray/20 bg-white px-4 py-2.5 pr-9 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
          >
            <option value="">Todos</option>
            {PROJECT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray" />
        </div>
      </div>

      {/* Zona / Ubicación */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray">
          Ubicación
        </label>
        <div className="relative">
          <select
            value={filters.zone}
            onChange={(e) => update("zone", e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray/20 bg-white px-4 py-2.5 pr-9 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
          >
            <option value="">Todas las zonas</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray" />
        </div>
      </div>

      {/* Habitaciones */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray">
          Habitaciones
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {BEDROOM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                update("bedrooms", filters.bedrooms === opt.value ? "" : opt.value)
              }
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                filters.bedrooms === opt.value
                  ? "border-navy bg-navy text-white"
                  : "border-gray/20 bg-white text-gray hover:border-navy/40 hover:text-navy"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Precio máximo */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray">
          Precio máximo
        </label>
        <div className="relative">
          <select
            value={filters.priceMax}
            onChange={(e) => update("priceMax", e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray/20 bg-white px-4 py-2.5 pr-9 text-sm text-navy outline-none transition-colors focus:border-celeste focus:ring-2 focus:ring-celeste/20"
          >
            <option value="">Sin límite</option>
            {PRICE_MAX_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search bar + mobile toggle row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray/60" />
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => update("keyword", e.target.value)}
            placeholder="Buscar por nombre o ubicación..."
            className="w-full rounded-lg border border-gray/20 bg-white py-3 pl-10 pr-4 text-sm text-navy outline-none transition-colors placeholder:text-gray/50 focus:border-celeste focus:ring-2 focus:ring-celeste/20"
          />
          {filters.keyword && (
            <button
              type="button"
              onClick={() => update("keyword", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray/50 hover:text-gray"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden flex items-center gap-2 rounded-lg border border-gray/20 bg-white px-4 py-3 text-sm font-medium text-navy transition-colors hover:border-navy/40"
          aria-expanded={mobileOpen}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-celeste text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop filter panel — always visible */}
      <div className="hidden lg:block">{filterPanelContent}</div>

      {/* Mobile filter panel — collapsible */}
      {mobileOpen && (
        <div className="rounded-xl border border-gray/10 bg-off-white p-4 lg:hidden">
          {filterPanelContent}
        </div>
      )}

      {/* Results count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray">
          <span className="font-semibold text-navy">{totalResults}</span>{" "}
          {totalResults === 1 ? "proyecto encontrado" : "proyectos encontrados"}
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 text-sm font-medium text-celeste transition-colors hover:text-navy"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
