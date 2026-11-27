import { useState } from "react";
import * as api from "../api.js";

const empty = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  role: "CLIENTE",
  birth_date: "",
  address: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  job_title: "",
  specialty: "",
};

const nn = (v) => (v === "" ? null : v);

export default function UserForm({ user, onClose, onDone }) {
  const isEdit = Boolean(user.id);
  const [f, setF] = useState(isEdit ? { ...empty, ...user, phone: user.phone || "" } : empty);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEdit) {
        await api.updateUser(user.id, {
          first_name: f.first_name,
          last_name: f.last_name,
          email: f.email,
          phone: nn(f.phone),
        });
      } else {
        const body = {
          first_name: f.first_name,
          last_name: f.last_name,
          email: f.email,
          phone: nn(f.phone),
          password: f.password,
          role: f.role,
        };
        if (f.role === "CLIENTE") {
          body.client_profile = {
            birth_date: nn(f.birth_date),
            address: nn(f.address),
            emergency_contact_name: nn(f.emergency_contact_name),
            emergency_contact_phone: nn(f.emergency_contact_phone),
          };
        } else {
          body.employee_profile = { job_title: f.job_title, specialty: nn(f.specialty) };
        }
        await api.createUser(body);
      }
      onDone();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>{isEdit ? "Editar usuario" : "Nuevo usuario"}</h3>
        <div className="two">
          <label>
            Nombre
            <input value={f.first_name} onChange={set("first_name")} required minLength={2} />
          </label>
          <label>
            Apellido
            <input value={f.last_name} onChange={set("last_name")} required minLength={2} />
          </label>
        </div>
        <label>
          Correo
          <input type="email" value={f.email} onChange={set("email")} required />
        </label>
        <label>
          Teléfono
          <input value={f.phone} onChange={set("phone")} />
        </label>

        {!isEdit && (
          <>
            <label>
              Contraseña
              <input type="password" value={f.password} onChange={set("password")} required minLength={12} />
            </label>
            <label>
              Rol
              <select value={f.role} onChange={set("role")}>
                <option>CLIENTE</option>
                <option>ESTETICISTA</option>
                <option>ADMIN</option>
              </select>
            </label>

            {f.role === "CLIENTE" ? (
              <>
                <label>
                  Fecha de nacimiento
                  <input type="date" value={f.birth_date} onChange={set("birth_date")} />
                </label>
                <label>
                  Dirección
                  <input value={f.address} onChange={set("address")} />
                </label>
                <div className="two">
                  <label>
                    Contacto de emergencia
                    <input value={f.emergency_contact_name} onChange={set("emergency_contact_name")} />
                  </label>
                  <label>
                    Teléfono de emergencia
                    <input value={f.emergency_contact_phone} onChange={set("emergency_contact_phone")} />
                  </label>
                </div>
              </>
            ) : (
              <div className="two">
                <label>
                  Cargo
                  <input value={f.job_title} onChange={set("job_title")} required minLength={2} />
                </label>
                <label>
                  Especialidad
                  <input value={f.specialty} onChange={set("specialty")} />
                </label>
              </div>
            )}
          </>
        )}

        {error && <p className="error">{error}</p>}
        <div className="row end">
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary">Guardar</button>
        </div>
      </form>
    </div>
  );
}
