"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserEmail(user.email ?? "");
        setUsers([
          {
            id: user.id,
            email: user.email ?? "",
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at ?? null,
          },
        ]);
      }

      setIsLoading(false);
    }
    fetchCurrentUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-celeste border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy">Usuarios</h1>
        <p className="mt-1 text-sm text-gray">
          Usuarios administradores del panel. Para agregar nuevos usuarios,
          utiliza el panel de Supabase Authentication.
        </p>
      </div>

      <div className="rounded-2xl border border-gray/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray/10 bg-off-white">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  Correo Electrónico
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  Fecha de Registro
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray">
                  Último Ingreso
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray/5">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-navy">
                        {user.email}
                      </span>
                      {user.email === currentUserEmail && (
                        <Badge variant="info">Tú</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="success">Activo</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray">
                    {new Date(user.created_at).toLocaleDateString("es-GT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString(
                          "es-GT",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <strong>Nota:</strong> La gestión de usuarios (crear, editar roles,
          eliminar) se realiza directamente desde el panel de Supabase
          Authentication. Esta página muestra solo una referencia de los usuarios
          conectados actualmente.
        </p>
      </div>
    </div>
  );
}
