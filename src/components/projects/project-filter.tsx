"use client";

import { useState } from "react";
import type { ProjectStatus } from "@/lib/types/database";

interface ProjectFilterProps {
  onFilterChange: (status: ProjectStatus | "all") => void;
  activeFilter: ProjectStatus | "all";
}

const FILTERS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "En Venta" },
  { value: "delivered", label: "Entregados" },
];

export function ProjectFilter({ onFilterChange, activeFilter }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeFilter === filter.value
              ? "bg-navy text-white shadow-md"
              : "bg-gray/5 text-gray hover:bg-gray/10 hover:text-navy"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export function useProjectFilter() {
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | "all">("all");
  return { activeFilter, setActiveFilter };
}
