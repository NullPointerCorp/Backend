# NovacodesSP

Sistema web de gestión logística para empresas con múltiples sucursales. Permite registrar, asignar y rastrear envíos desde su origen hasta su destino, y administrar de forma centralizada la flota de transportes, el personal, los almacenes y los clientes.

| Repositorio | Enlace |
|---|---|
| Backend | [github.com/NullPointerCorp/Backend](https://github.com/NullPointerCorp/Backend) |
| Frontend | [github.com/NullPointerCorp/Frontend](https://github.com/NullPointerCorp/Frontend) |

---

## Tabla de contenidos

1. [Funcionalidades](#funcionalidades)
2. [Stack tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Backend](#backend)
5. [Frontend](#frontend)
6. [Referencia de la API](#referencia-de-la-api)
7. [Puesta en marcha](#puesta-en-marcha)
8. [Variables de entorno](#variables-de-entorno)
9. [Scripts](#scripts)

---

## Funcionalidades

- Autenticación con Firebase Auth (correo/contraseña) con bloqueo automático de cuenta tras intentos fallidos y auditoría de accesos
- Gestión de sucursales con dirección completa, coordenadas geográficas y supervisor asignado
- Gestión de almacenes por sucursal con historial de movimientos de entrada y salida
- Gestión de empleados con cinco roles diferenciados: Administrador, Supervisor, Operador, Conductor y Almacenista
- Gestión de flota de transporte con tipo, subtipo, capacidad de carga y conductor asignado
- Gestión de clientes y catálogo de tipos de paquete con precio
- Registro y seguimiento de envíos con estados: `registrado`, `en_camino`, `entregado`, `retrasado` y `devuelto`
- Sistema de notificaciones y devoluciones sobre envíos
- Validación de datos con Zod en backend y frontend
- Interfaz Material Design con soporte para tema claro y oscuro

---

## Stack tecnológico

### Backend

| Tecnología | Versión |
|---|---|
| Node.js | >= 18 |
| TypeScript | ^5.9 |
| Express | ^5.2 |
| MySQL2 | ^3.18 |
| Firebase Admin SDK | ^13.7 |
| Zod | ^3.25 |
| dotenv | ^17.3 |
| cors | ^2.8 |

### Frontend

| Tecnología | Versión |
|---|---|
| Vue 3 | ^3.5 |
| TypeScript | ~5.9 |
| Vite | ^7.3 |
| Vuetify | ^4.0 |
| Vue Router | ^5.0 |
| Pinia | ^3.0 |
| Axios | ^1.15 |
| Firebase | ^12.9 |
| Zod | ^3.25 |
| Vue Sonner | ^2.0 |

---

## Arquitectura

El proyecto sigue una arquitectura cliente-servidor desacoplada. El frontend es una SPA que se comunica exclusivamente con la API REST del backend.

```
[ Vue 3 SPA — puerto 5173 ]
        |
        |  Firebase SDK  →  obtiene JWT al hacer login
        |  Axios + interceptores  →  adjunta Bearer token en cada petición
        |
        v
[ Express API REST — puerto 3000 ]
        |
        |  authMiddleware  →  verifica JWT con Firebase Admin SDK
        |  validate middleware  →  valida body/params con Zod
        |
        v
[ MySQL ]
```

### Patrón de módulos — backend

Cada dominio de negocio está aislado en su propio módulo con cuatro capas:

```
routes  →  controller  →  service  →  repository
```

- **routes** — define los endpoints y aplica los middlewares que correspondan
- **controller** — recibe la request, delega al service y devuelve la response
- **service** — contiene la lógica de negocio
- **repository** — ejecuta las consultas contra la base de datos

Cada módulo incluye además sus tipos TypeScript (`*.dto.ts`) y sus esquemas de validación Zod (`*.schema.ts`).

### Patrón de módulos — frontend

```
modules/nombre/
├── api/          →  instancia Axios configurada para el módulo
├── controllers/  →  composables: listado, creación y edición
├── interfaces/   →  tipos TypeScript
├── schemas/      →  esquemas Zod para validación de formularios
└── views/        →  componentes Vue y modales
```

---

## Backend

### Estructura de carpetas

```
backend/
├── app.ts
├── src/
│   ├── index.ts
│   ├── config/
│   │   ├── database.ts             # Pool de conexiones MySQL2
│   │   └── firebase.ts             # Inicialización de Firebase Admin SDK
│   ├── errors/
│   │   └── http-errors.ts          # HttpError, NotFoundError, BadRequestError,
│   │                               # ConflictError, UnauthorizedError
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # Verificación de JWT Firebase
│   │   ├── validate.middleware.ts   # Validación de body/params/query con Zod
│   │   └── error-handler.ts        # Captura global de errores
│   └── modules/
│       ├── auth/
│       ├── ubicacion/
│       ├── roles/
│       ├── empleados/
│       ├── sucursales/
│       ├── almacenes/
│       ├── clientes/
│       ├── tipo-paquetes/
│       ├── transportes/
│       └── envios/
└── tsconfig.json
```

### Middlewares

**`auth.middleware`** — Extrae el token del header `Authorization: Bearer <token>` y lo verifica con Firebase Admin SDK. Si el token es válido, adjunta el `firebaseUid` al objeto `Request`. Devuelve `401` si el header no existe o el token es inválido.

**`validate`** — Recibe un `ZodSchema` y un target (`body`, `params` o `query`). Si la validación falla, devuelve `400` con la lista de errores por campo. Si tiene éxito, reemplaza el dato original con la versión parseada por Zod.

**`error-handler`** — Middleware de cuatro parámetros de Express. Usa el status del error si es instancia de `HttpError`, o devuelve `500` por defecto. Nunca expone stack traces.

### Seguridad de contraseñas

Las contraseñas se almacenan usando `crypto.scrypt` de Node.js sin dependencias externas. El formato almacenado es `scrypt$<salt>$<derivedKey>`. La comparación usa `crypto.timingSafeEqual` para prevenir timing attacks.

### Flujo de autenticación

```
1. Frontend llama POST /auth/prelogin { correo }
   → El backend verifica si la cuenta está bloqueada
   → Si está bloqueada responde 423 con locked_until

2. Firebase signInWithEmailAndPassword en el cliente
   → Si falla: POST /auth/login-failed { correo }
     El backend incrementa failed_login_attempts
     Al llegar a 3 → bloqueo temporal de 15 minutos

3. Firebase devuelve el JWT
   → GET /auth/me  con  Authorization: Bearer <token>
     authMiddleware verifica el token
     El backend localiza al empleado por firebase_uid
     Resetea el contador de intentos fallidos
     Devuelve { id, nombre, rol, rol_id }
```

---

## Frontend

### Estructura de carpetas

```
frontend/
├── index.html
├── src/
│   ├── main.ts                     # Bootstrap: Vue, Vuetify, Pinia, Router
│   ├── App.vue
│   ├── firebase.ts                 # Inicialización de Firebase Auth en el cliente
│   ├── router/
│   │   └── index.ts                # Rutas SPA con navigation guard global
│   ├── api/
│   │   ├── base.api.ts             # Fábrica de instancias Axios con interceptores
│   │   ├── ciudadAPI.ts
│   │   └── estadoAPI.ts
│   ├── composables/
│   │   ├── useZodValidation.ts     # Validación de campos y formularios completos
│   │   ├── useToast.ts             # Sistema de notificaciones toast
│   │   ├── useConfirmar.ts         # Diálogo de confirmación basado en Promises
│   │   ├── useSidebar.ts           # Estado del menú lateral
│   │   └── useUbicacion.ts         # Carga de estados y ciudades para selectores
│   ├── components/
│   │   ├── AppHeader.vue
│   │   ├── Sidebar.vue
│   │   ├── Tabla.vue               # Tabla genérica con paginación y búsqueda
│   │   ├── ToastContainer.vue
│   │   ├── ModalConfirmar.vue
│   │   └── ModalCerrarSesion.vue
│   ├── layouts/
│   │   └── MainLayout.vue          # Layout raíz: sidebar + header + router-view
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       ├── global.css
│   │       ├── catalogo.style.css
│   │       └── modal.style.css
│   └── modules/
│       ├── auth/
│       ├── dashboard/
│       ├── sucursal/
│       ├── almacen/
│       ├── empleado/
│       ├── rol/
│       ├── cliente/
│       ├── tipo_paquete/
│       ├── transporte/
│       └── envio/
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.node.json
```

### Vistas y rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/login` | `Login.vue` | Pública |
| `/dashboard` | `Dashboard.vue` | Autenticado |
| `/sucursales` | `Sucursales.vue` | Autenticado |
| `/almacenes` | `Almacen.vue` | Autenticado |
| `/roles` | `Roles.vue` | Autenticado |
| `/empleados` | `Empleados.vue` | Autenticado |
| `/transporte` | `Transportes.vue` | Autenticado |
| `/clientes` | `Clientes.vue` | Autenticado |
| `/tipos-paquete` | `TiposPaquetes.vue` | Autenticado |
| `/envios` | `Envios.vue` | Autenticado |
| `/registrar-envio` | `RegistrarEnvio.vue` | Autenticado |

Un navigation guard global verifica `authStore.session` antes de cada navegación. Si no hay sesión activa, redirige a `/login`.

### Axios y manejo de sesión

`base.api.ts` expone una función `createAPI(baseURL)` que retorna una instancia de Axios con dos interceptores:

- **Request:** Lee el JWT de `localStorage`. Si no existe, cancela la petición y redirige a `/login`. Si existe, adjunta `Authorization: Bearer <token>` a todos los headers.
- **Response:** Si el servidor devuelve `401`, elimina el token del almacenamiento local y redirige a `/login`.

La sesión del usuario (`id`, `nombre`, `rol`, `rol_id`) se persiste en `localStorage` mediante el store de Pinia `useAuthStore`.

### Composables compartidos

**`useZodValidation`** — Recibe un `ZodObject` y expone `validate(field)` para validación en tiempo real compatible con Vuetify, y `validateAll(data)` para validar el formulario completo antes de enviarlo.

**`useConfirmar`** — Diálogo de confirmación basado en Promises. Permite usar `await confirmar("¿Eliminar este registro?")` directamente en cualquier controller y recibir `true` o `false` sin callbacks.

**`useToast`** — Estado global reactivo de notificaciones con autoeliminación. Tipos: `success`, `error`, `warning` e `info`.

**`useUbicacion`** — Carga el catálogo de estados al montarse y, al seleccionar uno, carga sus ciudades. Usado en los formularios de sucursales y empleados.

---

## Referencia de la API

Todos los endpoints requieren autenticación salvo los indicados. El token se envía en el header:

```
Authorization: Bearer <firebase_id_token>
```

Todas las respuestas son `application/json`.

### Autenticación — `/auth`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/prelogin` | No | Verifica si la cuenta está bloqueada antes del login |
| POST | `/auth/login-failed` | No | Registra un intento fallido e incrementa el contador |
| GET | `/auth/me` | Sí | Devuelve `{ id, nombre, rol, rol_id }` del usuario autenticado |

### Ubicación — `/ubicacion`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/ubicacion/estados` | Sí | Lista todos los estados |
| GET | `/ubicacion/ciudades/:estado_id` | Sí | Lista las ciudades de un estado |

### Roles — `/roles`

| Método | Ruta | Auth |
|---|---|---|
| GET | `/roles` | Sí |
| GET | `/roles/:id` | Sí |
| POST | `/roles/nuevo` | Sí |
| PUT | `/roles/:id` | Sí |
| DELETE | `/roles/:id` | Sí |

### Empleados — `/empleados`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/empleados` | Sí | Lista empleados con rol, sucursal y estado de cuenta |
| GET | `/empleados/supervisores` | Sí | Empleados con rol Supervisor |
| GET | `/empleados/transportistas` | Sí | Empleados con rol Conductor |
| GET | `/empleados/roles` | Sí | Catálogo de roles para selectores |
| GET | `/empleados/sucursales` | Sí | Catálogo de sucursales para selectores |
| GET | `/empleados/:id` | Sí | Detalle de un empleado |
| POST | `/empleados` | Sí | Crea un empleado |
| PUT | `/empleados/:id` | Sí | Edita un empleado |
| DELETE | `/empleados/:id` | Sí | Elimina un empleado |

### Sucursales — `/sucursales`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/sucursales` | Sí | Lista todas las sucursales |
| GET | `/sucursales/por-ciudad` | Sí | Filtra sucursales por ciudad |
| GET | `/sucursales/:id` | Sí | Detalle de una sucursal |
| POST | `/sucursales/nuevo` | Sí | Crea una sucursal |
| PUT | `/sucursales/:id` | Sí | Actualiza una sucursal |
| DELETE | `/sucursales/:id` | Sí | Elimina una sucursal |

### Almacenes — `/almacenes`

| Método | Ruta | Auth |
|---|---|---|
| GET | `/almacenes` | Sí |
| GET | `/almacenes/:id` | Sí |
| POST | `/almacenes/nuevo` | Sí |
| PUT | `/almacenes/:id` | Sí |
| DELETE | `/almacenes/:id` | Sí |

### Clientes — `/clientes`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/clientes` | Sí | Lista todos los clientes |
| GET | `/clientes/buscar` | Sí | Busca por correo vía query param `?correo=` |
| GET | `/clientes/:id` | Sí | Detalle de un cliente |
| POST | `/clientes/nuevo` | Sí | Crea un cliente |
| PUT | `/clientes/:id` | Sí | Actualiza un cliente |
| DELETE | `/clientes/:id` | Sí | Elimina un cliente |

### Tipos de paquete — `/tipo-paquetes`

| Método | Ruta | Auth |
|---|---|---|
| GET | `/tipo-paquetes` | Sí |
| GET | `/tipo-paquetes/:folio` | Sí |
| POST | `/tipo-paquetes/nuevo` | Sí |
| PUT | `/tipo-paquetes/:folio` | Sí |
| DELETE | `/tipo-paquetes/:folio` | Sí |

### Transportes — `/transporte`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/transporte/tipos` | Sí | Catálogo de tipos de transporte |
| GET | `/transporte/subtipos` | Sí | Catálogo de subtipos de transporte |
| GET | `/transporte` | Sí | Lista todos los transportes |
| GET | `/transporte/:numero_serie` | Sí | Detalle de un transporte |
| POST | `/transporte/nuevo` | Sí | Crea un transporte |
| PUT | `/transporte/:numero_serie` | Sí | Actualiza un transporte |
| DELETE | `/transporte/:numero_serie` | Sí | Elimina un transporte |

### Envíos — `/envios`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/envios` | Sí | Lista envíos con datos del cliente, transporte, origen y destino |
| GET | `/envios/:id` | Sí | Detalle de un envío |
| POST | `/envios/nuevo` | Sí | Registra un nuevo envío |
| PUT | `/envios/:id` | Sí | Actualiza el estado u otros datos de un envío |

---

## Puesta en marcha

### Requisitos

- Node.js >= 18
- pnpm >= 10 — `npm install -g pnpm`
- MySQL 8 corriendo localmente o en la nube
- Proyecto en [Firebase Console](https://console.firebase.google.com) con Authentication habilitado (proveedor correo/contraseña)

### Configuración de Firebase

Antes de arrancar cualquiera de los dos servicios es necesario obtener las credenciales de Firebase del equipo o generarlas desde Firebase Console:

- **Backend:** requiere las credenciales de la cuenta de servicio (Firebase Admin SDK). Consultar al responsable del proyecto para obtenerlas.
- **Frontend:** requiere la configuración del SDK web del proyecto Firebase. Consultar al responsable del proyecto para obtenerla.

### Backend

```bash
git clone https://github.com/NullPointerCorp/Backend.git
cd Backend
pnpm install
```

Crear el archivo `.env` en la raíz del proyecto (ver sección [Variables de entorno](#variables-de-entorno)) y arrancar el servidor:

```bash
pnpm dev
# Servidor disponible en http://localhost:3000
```

### Frontend

```bash
git clone https://github.com/NullPointerCorp/Frontend.git
cd Frontend
pnpm install
```

Crear el archivo `.env` en la raíz del proyecto y arrancar la aplicación:

```bash
pnpm dev
# Aplicación disponible en http://localhost:5173
```

---

## Variables de entorno

Ninguno de los dos repositorios incluye un archivo `.env`. Deben crearse manualmente antes de arrancar cada servicio.

### Backend — `.env`

```env
PORT=3000

DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=novalogistics_db
```

### Frontend — `.env`

```env
VITE_API_URL=http://localhost:3000
```

---

## Scripts

### Backend

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo con hot reload (nodemon + ts-node) |
| `pnpm build` | Compila TypeScript a JavaScript en `/dist` |

### Frontend

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo Vite en `localhost:5173` |
| `pnpm build` | Build de producción optimizado en `/dist` |
| `pnpm preview` | Previsualización local del build de producción |
