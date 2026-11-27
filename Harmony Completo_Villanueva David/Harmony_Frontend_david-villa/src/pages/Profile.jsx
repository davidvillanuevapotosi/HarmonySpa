import { useState } from "react";
import * as api from "../api.js";

export default function Profile({ user, onUpdated }) {
  const [form, setForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone || "",
  });
  const [pw, setPw] = useState({ current: "", next: "" });
  const [msg, setMsg] = useState({ profile: "", password: "" });
  const [err, setErr] = useState({ profile: "", password: "" });

  const saveProfile = async (e) => {
    e.preventDefault();
    setErr((s) => ({ ...s, profile: "" }));
    setMsg((s) => ({ ...s, profile: "" }));
    try {
      const updated = await api.updateMe({ ...form, phone: form.phone || null });
      onUpdated(updated);
      setMsg((s) => ({ ...s, profile: "Perfil actualizado" }));
    } catch (error) {
      setErr((s) => ({ ...s, profile: error.message }));
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setErr((s) => ({ ...s, password: "" }));
    setMsg((s) => ({ ...s, password: "" }));
    try {
      const r = await api.changePassword(pw.current, pw.next);
      setPw({ current: "", next: "" });
      setMsg((s) => ({ ...s, password: r.message }));
    } catch (error) {
      setErr((s) => ({ ...s, password: error.message }));
    }
  };

  return (
    <div className="grid">
      <form className="card" onSubmit={saveProfile}>
        <h3>Mi perfil</h3>
        <p className="muted">{user.email}</p>
        <label>
          Nombre
          <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required minLength={2} />
        </label>
        <label>
          Apellido
          <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required minLength={2} />
        </label>
        <label>
          Teléfono
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        {err.profile && <p className="error">{err.profile}</p>}
        {msg.profile && <p className="ok">{msg.profile}</p>}
        <button className="primary">Guardar</button>
      </form>

      <form className="card" onSubmit={savePassword}>
        <h3>Cambiar contraseña</h3>
        <label>
          Contraseña actual
          <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required />
        </label>
        <label>
          Nueva contraseña
          <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required minLength={12} />
        </label>
        <p className="muted">12 a 128 caracteres, con al menos una letra y un número.</p>
        {err.password && <p className="error">{err.password}</p>}
        {msg.password && <p className="ok">{msg.password}</p>}
        <button className="primary">Actualizar</button>
      </form>
    </div>
  );
}
