# Harmony Spa – Frontend

React + Vite (JavaScript) mínimo para el backend de Harmony Spa.

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```
Abre http://localhost:5173 (ya está permitido en `CORS_ORIGINS` del backend).
Inicia sesión con el SUPER_ADMIN creado con `python -m scripts.create_super_admin`.

- SUPER_ADMIN: gestión de usuarios (listar, filtrar, crear, editar, activar/desactivar) y su perfil.
- Otros roles: solo su perfil y cambio de contraseña.
- Un `401` cierra la sesión local y vuelve al login.
