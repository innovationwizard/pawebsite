import type { Database } from "@/lib/types/database";
import { BedDouble, Ruler, Car } from "lucide-react";

type UnitTypeRow = Database["public"]["Tables"]["unit_types"]["Row"];

interface UnitTypesTableProps {
  unitTypes: UnitTypeRow[];
  currency: string;
}

export function UnitTypesTable({ unitTypes, currency }: UnitTypesTableProps) {
  if (unitTypes.length === 0) return null;

  return (
    <section className="bg-off-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
          Tipos de Unidad
        </h2>
        <p className="mt-2 text-gray">
          Explora las diferentes opciones disponibles.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray/10">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  <BedDouble className="inline h-3.5 w-3.5 mr-1" />
                  Hab.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  <Ruler className="inline h-3.5 w-3.5 mr-1" />
                  Área Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  Interior
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  Terraza
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  <Car className="inline h-3.5 w-3.5 mr-1" />
                  Parqueo
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody>
              {unitTypes.map((unit) => (
                <tr
                  key={unit.id}
                  className="border-b border-gray/5 transition-colors hover:bg-white"
                >
                  <td className="px-4 py-4 font-medium text-navy">
                    {unit.type_name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray">
                    {unit.bedrooms}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-navy">
                    {unit.total_area_m2} m²
                  </td>
                  <td className="px-4 py-4 text-sm text-gray">
                    {unit.interior_area_m2 ? `${unit.interior_area_m2} m²` : "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray">
                    {unit.terrace_area_m2 ? `${unit.terrace_area_m2} m²` : "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray">
                    {unit.parking_description ?? (unit.parking_spaces ? `${unit.parking_spaces}` : "—")}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-navy">
                    {unit.price_display ?? "Consultar"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
