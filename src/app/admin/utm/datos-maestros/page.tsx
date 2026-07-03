"use client";

import { useState, useEffect } from "react";
import { Settings, Plus, Pencil, Trash2, Save, X, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { MASTER_DATA_LABELS, type MasterDataCategory } from "@/lib/utm/types";

interface MasterItem {
  id: string;
  name: string;
  abbreviation: string;
  isActive: boolean;
  sortOrder: number;
  source?: string;
  medium?: string;
}

const CATEGORIES: MasterDataCategory[] = [
  "industries",
  "brands",
  "platforms",
  "countries",
  "companies",
  "adFormats",
  "buyTypes",
  "campaignTypes",
  "segmentationTypes",
  "adPieceTypes",
];

const OK_BADGE = "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800";
const FAIL_BADGE = "inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800";
const CELL_INPUT = "w-full rounded border border-gray/30 px-2 py-1 text-sm outline-none focus:border-celeste focus:ring-2 focus:ring-celeste/20";

export default function MasterDataPage() {
  const [category, setCategory] = useState<MasterDataCategory>("industries");
  const [items, setItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MasterItem>>({});
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/utm/master-data?category=${category}`)
      .then((r) => r.json())
      .then((data) => setItems(data[category] || []))
      .catch(() => toast.error("Error cargando datos"))
      .finally(() => setLoading(false));
  }, [category]);

  function startEdit(item: MasterItem) {
    setEditingId(item.id);
    setEditForm(item);
    setIsNew(false);
  }

  function startNew() {
    setEditingId("new");
    setEditForm({ name: "", abbreviation: "", isActive: true, sortOrder: items.length });
    setIsNew(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
    setIsNew(false);
  }

  async function saveItem() {
    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(`/api/utm/master-data`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, ...editForm }),
      });
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Creado exitosamente" : "Actualizado exitosamente");
      cancelEdit();
      const data = await fetch(`/api/utm/master-data?category=${category}`).then((r) => r.json());
      setItems(data[category] || []);
    } catch {
      toast.error("Error al guardar");
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;
    try {
      const res = await fetch(`/api/utm/master-data?category=${category}&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Eliminado exitosamente");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      toast.error("Error al eliminar. Puede estar en uso por campañas.");
    }
  }

  const isPlatform = category === "platforms";
  const isSimple =
    category === "campaignTypes" || category === "segmentationTypes" || category === "adPieceTypes";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy">Datos Maestros</h1>
        <p className="mt-1 text-sm text-gray">Gestiona los datos maestros para los dropdowns del generador</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray" />
              <span className="text-sm font-semibold text-navy">Categorías</span>
            </div>
          </div>
          <nav className="p-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  cancelEdit();
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                  category === cat ? "bg-navy font-medium text-white" : "text-gray hover:bg-navy/5"
                }`}
              >
                {MASTER_DATA_LABELS[cat]}
                {category === cat && <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray/10 px-5 py-3">
            <h2 className="text-sm font-semibold text-navy">{MASTER_DATA_LABELS[category]}</h2>
            <button
              onClick={startNew}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-navy/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-gray">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray/10 bg-off-white">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray">Nombre</th>
                    {!isSimple && <th className="px-4 py-2.5 text-left text-xs font-medium text-gray">Abreviación</th>}
                    {isPlatform && (
                      <>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-gray">Source</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-gray">Medium</th>
                      </>
                    )}
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray">Estado</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-gray">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray/10">
                  {isNew && (
                    <tr className="bg-celeste/5">
                      <td className="px-4 py-2">
                        <input value={editForm.name || ""} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className={CELL_INPUT} placeholder="Nombre" autoFocus />
                      </td>
                      {!isSimple && (
                        <td className="px-4 py-2">
                          <input value={editForm.abbreviation || ""} onChange={(e) => setEditForm((p) => ({ ...p, abbreviation: e.target.value }))} className={CELL_INPUT} placeholder="Abreviación" />
                        </td>
                      )}
                      {isPlatform && (
                        <>
                          <td className="px-4 py-2">
                            <input value={editForm.source || ""} onChange={(e) => setEditForm((p) => ({ ...p, source: e.target.value }))} className={CELL_INPUT} placeholder="source" />
                          </td>
                          <td className="px-4 py-2">
                            <input value={editForm.medium || ""} onChange={(e) => setEditForm((p) => ({ ...p, medium: e.target.value }))} className={CELL_INPUT} placeholder="medium" />
                          </td>
                        </>
                      )}
                      <td className="px-4 py-2"><span className={OK_BADGE}>Activo</span></td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={saveItem} className="rounded p-1.5 text-green-600 hover:bg-green-50"><Save className="h-4 w-4" /></button>
                          <button onClick={cancelEdit} className="rounded p-1.5 text-gray hover:bg-gray/5"><X className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {items.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-navy/5">
                      <td className="px-4 py-2.5">
                        {editingId === item.id ? (
                          <input value={editForm.name || ""} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className={CELL_INPUT} />
                        ) : (
                          <span className="font-medium text-navy">{item.name}</span>
                        )}
                      </td>
                      {!isSimple && (
                        <td className="px-4 py-2.5">
                          {editingId === item.id ? (
                            <input value={editForm.abbreviation || ""} onChange={(e) => setEditForm((p) => ({ ...p, abbreviation: e.target.value }))} className={`${CELL_INPUT} font-mono`} />
                          ) : (
                            <code className="rounded bg-off-white px-1.5 py-0.5 text-xs text-gray">{item.abbreviation}</code>
                          )}
                        </td>
                      )}
                      {isPlatform && (
                        <>
                          <td className="px-4 py-2.5">
                            {editingId === item.id ? (
                              <input value={editForm.source || ""} onChange={(e) => setEditForm((p) => ({ ...p, source: e.target.value }))} className={`${CELL_INPUT} font-mono`} />
                            ) : (
                              <code className="text-xs text-gray">{item.source}</code>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            {editingId === item.id ? (
                              <input value={editForm.medium || ""} onChange={(e) => setEditForm((p) => ({ ...p, medium: e.target.value }))} className={`${CELL_INPUT} font-mono`} />
                            ) : (
                              <code className="text-xs text-gray">{item.medium}</code>
                            )}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-2.5">
                        <span className={item.isActive !== false ? OK_BADGE : FAIL_BADGE}>
                          {item.isActive !== false ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {editingId === item.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={saveItem} className="rounded p-1.5 text-green-600 hover:bg-green-50"><Save className="h-4 w-4" /></button>
                            <button onClick={cancelEdit} className="rounded p-1.5 text-gray hover:bg-gray/5"><X className="h-4 w-4" /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => startEdit(item)} className="rounded p-1.5 text-gray hover:bg-navy/5 hover:text-navy"><Pencil className="h-3.5 w-3.5" /></button>
                            <button onClick={() => deleteItem(item.id)} className="rounded p-1.5 text-gray hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
