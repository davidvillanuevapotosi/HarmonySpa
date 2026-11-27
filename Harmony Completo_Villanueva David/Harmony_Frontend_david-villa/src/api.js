const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";
const KEY = "harmony_token";

export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => (onUnauthorized = fn);

function errorMessage(data, status) {
  const d = data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) {
    return d
      .map((e) => `${(e.loc || []).slice(1).join(".")}: ${(e.msg || "").replace("Value error, ", "")}`)
      .join(" | ");
  }
  return `Error ${status}`;
}

export async function api(path, { method = "GET", body, params } = {}) {
  const qs = params
    ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    : "";
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(BASE + path + qs, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && token && path !== "/auth/login") onUnauthorized();
    throw new Error(errorMessage(data, res.status));
  }
  return data;
}

export const login = (email, password) =>
  api("/auth/login", { method: "POST", body: { email, password } });
export const logout = () => api("/auth/logout", { method: "POST" });
export const me = () => api("/auth/me");
export const updateMe = (body) => api("/users/me", { method: "PATCH", body });
export const changePassword = (current_password, new_password) =>
  api("/users/me/password", { method: "POST", body: { current_password, new_password } });

export const listUsers = (params) => api("/users", { params });
export const createUser = (body) => api("/users", { method: "POST", body });
export const updateUser = (id, body) => api(`/users/${id}`, { method: "PATCH", body });
export const setUserStatus = (id, is_active) =>
  api(`/users/${id}/status`, { method: "PATCH", body: { is_active } });
