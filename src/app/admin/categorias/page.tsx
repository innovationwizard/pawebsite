"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  async function fetchCategories() {
    const { data } = await supabase
      .from("news_categories")
      .select("*")
      .order("name", { ascending: true });
    setCategories((data ?? []) as Category[]);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd() {
    if (!newName.trim()) return;
    const { error } = await supabase
      .from("news_categories")
      .insert({ name: newName.trim(), slug: toSlug(newName) });
    if (error) {
      alert("Error al crear categoría: " + error.message);
      return;
    }
    setNewName("");
    setIsAdding(false);
    fetchCategories();
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) return;
    const { error } = await supabase
      .from("news_categories")
      .update({ name: editName.trim(), slug: toSlug(editName) })
      .eq("id", id);
    if (error) {
      alert("Error al actualizar: " + error.message);
      return;
    }
    setEditingId(null);
    fetchCategories();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los artículos asociados quedarán sin categoría.`))
      return;
    const { error } = await supabase
      .from("news_categories")
      .delete()
      .eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }
    fetchCategories();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-celeste border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">
            Categorías del Blog
          </h1>
          <p className="mt-1 text-sm text-gray">
            Gestiona las categorías de artículos y noticias.
          </p>
        </div>
        {!isAdding && (
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        )}
      </div>

      <div className="rounded-2xl bg-white">
        {/* Add new row */}
        {isAdding && (
          <div className="flex items-center gap-3 border-b border-gray/10 px-5 py-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Nombre de la categoría"
              className="flex-1 rounded-lg border border-gray/20 px-3 py-2 text-sm text-navy focus:border-celeste focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewName(""); }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray hover:bg-gray/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Category list */}
        {categories.length === 0 && !isAdding ? (
          <p className="px-5 py-12 text-center text-sm text-gray/40">
            No hay categorías. Crea la primera.
          </p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 border-b border-gray/10 px-5 py-4 last:border-b-0"
            >
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                    className="flex-1 rounded-lg border border-gray/20 px-3 py-2 text-sm text-navy focus:border-celeste focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray hover:bg-gray/5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-navy">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray/40">{cat.slug}</span>
                  <button
                    onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray hover:bg-gray/5 hover:text-navy"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
