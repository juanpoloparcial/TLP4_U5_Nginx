# Gestor de Tareas (React + Vite, Node+TS, MongoDB, Nginx, Docker Compose)

## Comandos

Levantar todo:
```
docker-compose up --build -d
```

Parar y eliminar:
```
docker-compose down
```

La aplicación estará disponible en `http://localhost/`.
La API está en `http://localhost/api/tasks`.

## Estructura
- backend/    -> Node.js + Express + TypeScript
- frontend/   -> React + Vite
- nginx/      -> Dockerfile + nginx.conf (nginx servirá frontend y hará proxy a /api --> backend)
- docker-compose.yml
- .env        -> variables de entorno (usa `.env.sample`)

