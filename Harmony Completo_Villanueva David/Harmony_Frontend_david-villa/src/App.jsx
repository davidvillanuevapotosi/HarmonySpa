import { useEffect, useState } from "react";
import * as api from "./api.js";
import Login from "./pages/Login.jsx";
import Users from "./pages/Users.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("profile");

  const reset = () => {
    api.clearToken();
    setUser(null);
  };

  useEffect(() => {
    api.setUnauthorizedHandler(reset);
    if (!api.getToken()) return setReady(true);
    api
      .me()
      .then((u) => {
        setUser(u);
        setView(u.role === "SUPER_ADMIN" ? "users" : "profile");
      })
      .catch(reset)
      .finally(() => setReady(true));
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    setView(u.role === "SUPER_ADMIN" ? "users" : "profile");
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {}
    reset();
  };

  if (!ready) return <p className="center">Cargando…</p>;
  if (!user) return <Login onLogin={handleLogin} />;

  const isSuper = user.role === "SUPER_ADMIN";

  return (
    <>
      <header className="bar">
        <strong>Harmony Spa</strong>
        <nav>
          {isSuper && (
            <button className={view === "users" ? "active" : ""} onClick={() => setView("users")}>
              Usuarios
            </button>
          )}
          <button className={view === "profile" ? "active" : ""} onClick={() => setView("profile")}>
            Mi perfil
          </button>
        </nav>
        <span className="grow" />
        <span className="muted">
          {user.first_name} · {user.role}
        </span>
        <button onClick={handleLogout}>Salir</button>
      </header>
      <main>
        {view === "users" && isSuper ? (
          <Users />
        ) : (
          <Profile user={user} onUpdated={setUser} />
        )}
      </main>
    </>
  );
}
