import { useCallback, useEffect, useState } from "react";
import * as api from "../api.js";
import UserForm from "./UserForm.jsx";

const ROLES = ["ADMIN", "ESTETICISTA", "CLIENTE"];
const LIMIT = 10;

export default function Users() {
  const [filters, setFilters] = useState({ search: "", role: "", is_active: "" });
  const [skip, setSkip] = useState(0);
  const [data, setData] = useState({ items: [], total: 0 });
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setData(await api.listUsers({ ...filters, skip, limit: LIMIT }));
    } catch (e) {
      setError(e.message);
    }
  }, [filters, skip]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = (k, v) => {
    setSkip(0);
    setFilters((f) => ({ ...f, [k]: v }));
  };

  const toggle = async (u) => {
    try {
      await api.setUserStatus(u.id, !u.is_active);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const done = () => {
    setEditing(null);
    load();
  };

  return (
    <>
      <div className="row">
        <input placeholder="Buscar…" value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
        <select value={filters.role} onChange={(e) => setFilter("role", e.target.value)}>
          <option value="">Todos los roles</option>
          <option>SUPER_ADMIN</option>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select value={filters.is_active} onChange={(e) => setFilter("is_active", e.target.value)}>
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <span className="grow" />
        <button className="primary" onClick={() => setEditing({})}>
          + Nuevo usuario
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Estado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.items.map((u) => (
            <tr key={u.id}>
              <td>
                {u.first_name} {u.last_name}
              </td>
              <td>{u.email}</td>
              <td>{u.phone || "—"}</td>
              <td>{u.role}</td>
              <td>{u.is_active ? "Activo" : "Inactivo"}</td>
              <td className="actions">
                {u.role !== "SUPER_ADMIN" && (
                  <>
                    <button onClick={() => setEditing(u)}>Editar</button>
                    <button onClick={() => toggle(u)}>{u.is_active ? "Desactivar" : "Activar"}</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {data.items.length === 0 && (
            <tr>
              <td colSpan={6} className="muted">
                Sin resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="row">
        <button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - LIMIT))}>
          ←
        </button>
        <span className="muted">
          {data.total === 0 ? 0 : skip + 1}–{Math.min(skip + LIMIT, data.total)} de {data.total}
        </span>
        <button disabled={skip + LIMIT >= data.total} onClick={() => setSkip(skip + LIMIT)}>
          →
        </button>
      </div>

      {editing && <UserForm user={editing} onClose={() => setEditing(null)} onDone={done} />}
    </>
  );
}
