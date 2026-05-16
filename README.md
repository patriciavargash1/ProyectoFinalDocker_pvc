# ProyectoFinalDocker

Proyecto Dockerizado con backend Node.js + Express, base de datos MySQL y frontend React (Vite + Nginx).

Repositorio original: https://github.com/patriciavargash1/ProyectoFinalDocker_pvc.git

## Estructura del proyecto

- `backend/` - API Node.js con Express, acceso a MySQL y rutas REST.
- `frontend/` - Aplicación React creada con Vite.
- `db/` - Script de inicialización de MySQL (`init.sql`).
- `docker-compose.yml` - Orquestación de servicios MySQL, backend y frontend.
- `.env` - Variables de entorno usadas por Docker Compose.
- `reload-db.ps1` - Script para reiniciar contenedores y recargar la base de datos.

## Requisitos

- Docker
- Docker Compose
- Node.js y npm (solo para desarrollo local, no es necesario si usas Docker)

## Variables de entorno

El proyecto utiliza el archivo `.env` con estas variables:

- `DB_ROOT_PASSWORD`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Asegúrate de que `.env` existe en la raíz del proyecto antes de iniciar los servicios.

## Uso con Docker Compose

### Clonar el proyecto

```bash
git clone https://github.com/patriciavargash1/ProyectoFinalDocker_pvc.git
cd ProyectoFinalDocker_pvc
```

### Levantar los servicios

```bash
docker compose up -d
```

Esto iniciará:

- MySQL en `3306`
- Backend en `4000`
- Frontend en `3000`

### Funcionamiento de la aplicación en el navegador: 

La aplicación de CV estará disponible en:
`http://localhost:3000`

### Recargar la base de datos

Para borrar los datos anteriores y recargar desde `db/init.sql`:

```powershell
powershell -ExecutionPolicy Bypass -File reload-db.ps1
```

O manualmente:

```bash
docker compose down -v
docker compose up -d
```

## Uso local sin Docker

### Backend

```bash
cd backend
npm install
npm start
```

El backend quedará escuchando en `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend quedará disponible en el puerto que muestre Vite, normalmente
`http://localhost:5173`.

## Notas de Docker Hub

El `docker-compose.yml` actual está configurado para usar las imágenes remotas:

- `patriciavargash1/vargaschoque_backend`
- `patriciavargash1/vargaschoque_frontend`

Si no existen o quieres usar las versiones locales, reemplaza los bloques `image:` por `build:` en `docker-compose.yml`.

## Endpoints principales

- `GET /api/personas`
- `GET /api/formacion`
- `GET /api/formacion/:id`

## Información adicional

- El backend convierte la imagen almacenada en la base de datos a un formato `data:image/...;base64,...` para el frontend.
- Si necesitas modificar el frontend o backend y quieres ver cambios inmediatos, es mejor usar el modo local de desarrollo en lugar de las imágenes remotas.
