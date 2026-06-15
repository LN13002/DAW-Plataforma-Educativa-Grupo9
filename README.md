<p align="center">
  <img src="./docs/ues.jpg" alt="Logo UES" width="130">
</p>



<p align="center">
  <b>Plataforma Educativa | Universidad de El Salvador</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>
<h1 align="center" style="color: #f4e9e9; border-bottom: none;">AprendeUES</h1>

Plataforma educativa para gestionar cursos, módulos, lecciones, progreso académico, comentarios, reseñas y certificados de finalización. El proyecto combina una experiencia web en React con una API REST en Spring Boot, persistencia en PostgreSQL y un flujo de desarrollo reproducible con mise y Docker.

---

## Descripción del proyecto

AprendeUES resuelve la necesidad de centralizar la administración y seguimiento de cursos virtuales para estudiantes, docentes y administradores de la Universidad de El Salvador. La plataforma permite organizar contenido académico, registrar inscripciones, medir el avance de aprendizaje y emitir certificados de finalización cuando el estudiante completa un curso.

### Problema que resuelve

En una plataforma educativa, no basta con mostrar cursos: también se necesita controlar quién imparte cada curso, cómo se organiza el contenido, qué estudiantes están inscritos, qué lecciones han completado y qué certificados pueden emitirse con respaldo verificable. AprendeUES integra esas operaciones en un solo sistema con frontend web, API REST y base de datos relacional.

### Funciones principales

- Gestión de usuarios con roles de estudiante, docente/instructor y administrador.
- Gestión de categorías, cursos, módulos y lecciones.
- Inscripción de estudiantes a cursos.
- Seguimiento del progreso por lección y por curso.
- Comentarios y respuestas dentro de lecciones.
- Reseñas de cursos.
- Emisión y descarga de certificados PDF para cursos completados.
- Documentación interactiva de la API mediante Swagger UI.
- Despliegue reproducible con Docker Compose.

---

## Integrantes

| Nombre | Carnet |
|---|---|
| Rodrigo Alexis Mercado Calidonio | MC24029 |
| Kevin Manuel Lemus Najarro | LN13002 |
| Jose Gerardo Pleites Campos | PC24020 |
| Salvador Ernesto Ventura Vasquez | VV24014 |
| Kevin Geovanni Gonzalez Salazar | GS24037 |

---

## Vista general

```mermaid
flowchart LR
  User["Usuario / Admin / Docente"] --> Browser["Navegador"]
  Browser --> React["React + Vite"]
  React --> API["Spring Boot REST API"]
  API --> JPA["Spring Data JPA / Hibernate"]
  JPA --> DB[("PostgreSQL 16")]
  API --> Flyway["Flyway migrations"]
  Flyway --> DB
  API --> PDF["PDFBox certificados"]

  subgraph Runtime["Runtime contenerizado"]
    React
    API
    DB
  end
```

La aplicación puede ejecutarse en modo desarrollo local o como stack completo con Docker Compose. En el stack contenerizado, el frontend se compila y queda servido como archivos estáticos dentro del backend Spring Boot.

---

## Stack tecnológico

| Capa | Tecnología | Uso |
|---|---|---|
| Frontend | React + Vite | Interfaz web, vistas por rol, consumo de API |
| Backend | Spring Boot 3.5 + Java 21 | API REST, validación, lógica de negocio |
| Persistencia | Spring Data JPA + Hibernate | Repositorios y mapeo entidad-tabla |
| Base de datos | PostgreSQL 16 | Datos académicos y progreso |
| Migraciones | Flyway | Versionado del schema y seed data |
| Certificados | Apache PDFBox | Generación de PDF descargable |
| DX | mise | Instalación de herramientas y ejecución de tareas |
| Contenedores | Docker + Docker Compose | App completa y PostgreSQL reproducibles |

---

## Estructura de carpetas

```text
.
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   └── src/
│       ├── main/
│       │   ├── java/com/aprende/ues/backend/
│       │   │   ├── config/          # OpenAPI / Swagger
│       │   │   ├── controller/      # Endpoints REST
│       │   │   ├── dto/             # Request/Response DTOs
│       │   │   ├── exceptions/      # Errores de dominio y handler REST
│       │   │   ├── model/           # Entidades JPA y enums
│       │   │   ├── repository/      # Spring Data repositories
│       │   │   └── service/         # Casos de uso y reglas de negocio
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── assets/          # Recursos usados por backend, como logo UES
│       │       └── db/migration/    # Migraciones Flyway
│       └── test/                    # Pruebas de backend
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/              # Componentes reutilizables
│       ├── pages/                   # Pantallas CRUD / administración
│       ├── services/                # Cliente API y mappers DTO
│       ├── assets/                  # Imágenes estáticas
│       ├── App.jsx
│       └── main.jsx
├── docs/
│   ├── evidencias/                 # Capturas de Swagger y vistas
│   ├── mise.md
│   └── ues.jpg
├── Dockerfile                       # Build multi-stage frontend + backend
├── docker-compose.yml               # App + PostgreSQL
├── mise.toml                        # Herramientas y tareas DX
└── README.md
```

---

## Arquitectura de la aplicación

```mermaid
flowchart TB
  subgraph Frontend["Frontend - React"]
    App["App.jsx"]
    Components["components/*"]
    Pages["pages/*"]
    ApiClient["services/api.js"]
  end

  subgraph Backend["Backend - Spring Boot"]
    Controllers["Controllers REST"]
    DTOs["DTOs"]
    Services["Services"]
    Repositories["Repositories"]
    Entities["JPA Entities"]
  end

  subgraph Data["Data layer"]
    Flyway["Flyway"]
    Postgres[("PostgreSQL")]
  end

  App --> Components
  App --> Pages
  Pages --> ApiClient
  Components --> ApiClient
  ApiClient --> Controllers
  Controllers --> DTOs
  Controllers --> Services
  Services --> Repositories
  Repositories --> Entities
  Entities --> Postgres
  Flyway --> Postgres
```

### Capas del backend

```mermaid
flowchart LR
  HTTP["HTTP / JSON"] --> Controller["Controller"]
  Controller --> DTO["DTO"]
  DTO --> Service["Service"]
  Service --> Repository["Repository"]
  Repository --> Entity["Entity"]
  Entity --> DB[("PostgreSQL")]
```

---

## Diagrama Entidad-Relación

```mermaid
erDiagram
  USERS {
    uuid id PK
    varchar first_name
    varchar last_name
    varchar email UK
    text password_hash
    text avatar_url
    varchar role
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }

  CATEGORIES {
    uuid id PK
    varchar name
    varchar slug UK
    text description
    uuid parent_id FK
  }

  COURSES {
    uuid id PK
    varchar title
    text description
    text thumbnail_url
    varchar level
    varchar status
    uuid instructor_id FK
    uuid category_id FK
    timestamptz created_at
    timestamptz updated_at
  }

  MODULES {
    uuid id PK
    uuid course_id FK
    varchar title
    text description
    smallint position
    boolean is_published
  }

  LESSONS {
    uuid id PK
    uuid module_id FK
    varchar title
    text description
    text video_url
    integer duration_sec
    smallint position
    varchar type
    boolean is_preview
    boolean is_published
  }

  ENROLLMENTS {
    uuid id PK
    uuid user_id FK
    uuid course_id FK
    varchar status
    numeric progress
    timestamptz enrolled_at
    timestamptz completed_at
  }

  LESSON_PROGRESS {
    uuid id PK
    uuid enrollment_id FK
    uuid lesson_id FK
    boolean is_completed
    integer seconds_watched
    timestamptz last_watched_at
  }

  CERTIFICATES {
    uuid id PK
    uuid enrollment_id FK
    varchar code UK
    text pdf_url
    timestamptz issued_at
  }

  COMMENTS {
    uuid id PK
    uuid user_id FK
    uuid lesson_id FK
    uuid parent_id FK
    text content
    integer likes
    timestamptz created_at
  }

  REVIEWS {
    uuid id PK
    uuid user_id FK
    uuid course_id FK
    smallint rating
    text body
    timestamptz created_at
  }

  USERS ||--o{ COURSES : teaches
  CATEGORIES ||--o{ CATEGORIES : parent
  CATEGORIES ||--o{ COURSES : groups
  COURSES ||--o{ MODULES : contains
  MODULES ||--o{ LESSONS : contains
  USERS ||--o{ ENROLLMENTS : enrolls
  COURSES ||--o{ ENROLLMENTS : receives
  ENROLLMENTS ||--o{ LESSON_PROGRESS : tracks
  LESSONS ||--o{ LESSON_PROGRESS : progresses
  ENROLLMENTS ||--o| CERTIFICATES : issues
  USERS ||--o{ COMMENTS : writes
  LESSONS ||--o{ COMMENTS : receives
  COMMENTS ||--o{ COMMENTS : replies
  USERS ||--o{ REVIEWS : writes
  COURSES ||--o{ REVIEWS : receives
```

El diagrama anterior representa el diseño entidad-relación de la base de datos. Puede visualizarse directamente en GitHub por estar escrito en Mermaid; si se requiere como imagen, se puede exportar desde el visor Markdown o desde una herramienta compatible con Mermaid.

### Reglas importantes del schema

- Un usuario puede tener rol `student`, `instructor` o `admin`.
- Un curso pertenece a un instructor y opcionalmente a una categoría.
- Un curso contiene módulos; un módulo contiene lecciones.
- Una inscripción une un usuario con un curso y mantiene `progress`.
- `lesson_progress` recalcula automáticamente el progreso de la inscripción mediante trigger.
- Un certificado pertenece a una inscripción completada y tiene código único.
- Los comentarios soportan respuestas anidadas mediante `parent_id`.
- Las reseñas son únicas por usuario y curso.

---

## Cómo se conectan las herramientas

```mermaid
flowchart LR
  Dev["Desarrollador"] --> Mise["mise"]
  Mise --> Java["Java 21"]
  Mise --> Node["Node LTS"]
  Mise --> Tasks["Tareas del proyecto"]

  Tasks --> Compose["Docker Compose"]
  Compose --> Pg["PostgreSQL 16"]
  Compose --> App["Contenedor app"]

  Tasks --> Spring["Spring Boot local"]
  Tasks --> Vite["Vite dev server"]

  Vite --> Spring
  Spring --> Pg
  App --> Pg
```

### Flujo con Docker

```mermaid
flowchart TB
  Source["Código fuente"] --> Dockerfile["Dockerfile multi-stage"]

  Dockerfile --> FrontBuild["Stage 1: node:lts-alpine"]
  FrontBuild --> Dist["frontend/dist"]

  Dockerfile --> BackBuild["Stage 2: eclipse-temurin:21-jdk-alpine"]
  Dist --> BackBuild
  BackBuild --> Jar["Spring Boot jar"]

  Jar --> Runtime["Stage 3: eclipse-temurin:21-jre-alpine"]
  Runtime --> Container["aprende_ues_app:8080"]
  Compose["docker-compose.yml"] --> Container
  Compose --> DB["aprende_ues_db:5432 interno / 5433 host"]
```

---

## Requisitos previos

- [mise](https://mise.jdx.dev/) para herramientas y tareas del proyecto.
- [Docker](https://www.docker.com/) para PostgreSQL y stack contenerizado.
- Git.

El proyecto define las herramientas en `mise.toml`:

```toml
[tools]
java = "temurin-21"
node = "lts"
```

---

## Configuración inicial

```bash
git clone <url-del-repositorio>
cd DAW-Plataforma-Educativa-Grupo9

mise trust
mise install
```

---

## Ejecución

### Desarrollo local

```bash
mise run dev
```

Este flujo levanta PostgreSQL con Docker, ejecuta backend y frontend en modo desarrollo y deja disponible Swagger UI para explorar la API.

### Manual de despliegue con Docker Compose

Sigue estos pasos para levantar el sistema completo desde cero usando Docker Compose:

1. Ubicarse en la raíz del repositorio:

```bash
cd DAW-Plataforma-Educativa-Grupo9
```

2. Verificar que Docker esté disponible:

```bash
docker --version
docker compose version
```

3. Compilar la imagen de la aplicación:

```bash
docker compose build
```

4. Levantar la aplicación y la base de datos:

```bash
docker compose up
```

5. Esperar a que PostgreSQL aparezca como `Healthy` y Spring Boot termine de iniciar.

6. Abrir la aplicación en el navegador:

```text
http://localhost:8080
```

7. Abrir Swagger UI para verificar la API:

```text
http://localhost:8080/swagger-ui.html
```

8. Para detener el stack:

```bash
docker compose down
```

Comando alternativo para compilar e iniciar en un solo paso:

```bash
docker compose up --build
```

Si el puerto `8080` está ocupado, detén el proceso local que lo utiliza o cambia el mapeo de puertos en `docker-compose.yml`, por ejemplo `8082:8080`.

### Stack completo con Docker

```bash
mise run app:up
```

Este comando construye la imagen de la aplicación, empaqueta el frontend dentro del backend y levanta:

- App web: `http://localhost:8080`
- API REST: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- PostgreSQL host: `localhost:5433`

También puedes ejecutar el stack directamente con Docker Compose:

```bash
# Compilar la imagen
docker compose build

# Iniciar la app y la base de datos
docker compose up
```

Para compilar e iniciar en un solo paso:

```bash
docker compose up --build
```

Si prefieres dejarlo corriendo en segundo plano:

```bash
docker compose up -d
```

Para ver los logs del stack:

```bash
docker compose logs -f
```

Para detener el stack:

```bash
mise run app:down
```

O directamente con Docker Compose:

```bash
docker compose down
```

---

## Tareas disponibles

| Comando | Descripción |
|---|---|
| `mise run dev` | Levanta DB, backend y frontend para desarrollo local |
| `mise run app:up` | Construye y levanta app + DB con Docker Compose |
| `mise run app:down` | Detiene el stack de Docker Compose |
| `mise run app:logs` | Muestra logs de app y base de datos |
| `mise run backend` | Ejecuta solo Spring Boot, requiere DB activa |
| `mise run db:up` | Levanta PostgreSQL en Docker |
| `mise run db:down` | Detiene y elimina los servicios de compose |
| `mise run db:logs` | Muestra logs de PostgreSQL |
| `mise run db:migrate` | Ejecuta migraciones sin levantar toda la app |
| `mise run backend:test` | Ejecuta pruebas del backend |

---

## URLs útiles

| Servicio | URL |
|---|---|
| App web contenerizada | `http://localhost:8080` |
| Frontend local Vite | `http://localhost:5173` |
| API base | `http://localhost:8080/api` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| Actuator health | `http://localhost:8080/actuator/health` |

---

## Base de datos

PostgreSQL corre en Docker con la siguiente configuración:

| Parámetro | Desarrollo local |
|---|---|
| Host | `localhost` |
| Puerto host | `5433` |
| Puerto contenedor | `5432` |
| Base de datos | `aprende_ues` |
| Usuario | `aprende_ues` |
| Contraseña | `aprende_ues` |

El backend usa variables de entorno con fallback:

```properties
DB_HOST=localhost
DB_PORT=5433
DB_NAME=aprende_ues
DB_USER=aprende_ues
DB_PASSWORD=aprende_ues
```

En Docker Compose, el backend se conecta a `db:5432` dentro de la red de contenedores.

---

## Migraciones Flyway

Las migraciones viven en:

```text
backend/src/main/resources/db/migration/
├── V1__initial_schema.sql
├── V2__seed_data.sql
├── V3__realistic_seed.sql
├── V4__change_role_to_varchar.sql
├── V5__create_categories_table.sql
├── V6__repair_orphan_course_categories.sql
├── V7__translate_seed_data_to_spanish.sql
├── V8__change_enrollment_status_to_varchar.sql
├── V9__add_matching_youtube_links_to_html_css_lessons.sql
└── V10__fix_progress_trigger_enrollment_status.sql
```

Regla de equipo: no modificar migraciones `V` ya aplicadas. Para cambios nuevos se agrega una migración nueva:

```text
V10__descripcion_del_cambio.sql
V11__otra_mejora.sql
```

Flyway valida checksums y Spring Boot usa `spring.jpa.hibernate.ddl-auto=validate`, por lo que el schema real debe coincidir con las entidades JPA.

---

## Tabla de rutas del backend

| Módulo | Método | Endpoint | Descripción |
|---|---:|---|---|
| Usuarios | GET | `/api/users` | Lista usuarios registrados |
| Usuarios | GET | `/api/users/{id}` | Obtiene un usuario por ID |
| Usuarios | POST | `/api/users` | Crea un usuario |
| Usuarios | PUT | `/api/users/{id}` | Actualiza un usuario |
| Usuarios | DELETE | `/api/users/{id}` | Elimina un usuario |
| Categorías | GET | `/api/categories` | Lista categorías |
| Categorías | GET | `/api/categories/{id}` | Obtiene una categoría por ID |
| Categorías | POST | `/api/categories` | Crea una categoría |
| Categorías | PUT | `/api/categories/{id}` | Actualiza una categoría |
| Categorías | DELETE | `/api/categories/{id}` | Elimina una categoría |
| Cursos | GET | `/api/courses` | Lista cursos |
| Cursos | GET | `/api/courses/{id}` | Obtiene un curso por ID |
| Cursos | POST | `/api/courses` | Crea un curso |
| Cursos | PUT | `/api/courses/{id}` | Actualiza un curso |
| Cursos | DELETE | `/api/courses/{id}` | Elimina un curso |
| Módulos | GET | `/api/modules` | Lista módulos |
| Módulos | GET | `/api/modules/{id}` | Obtiene un módulo por ID |
| Módulos | POST | `/api/modules` | Crea un módulo |
| Módulos | PUT | `/api/modules/{id}` | Actualiza un módulo |
| Módulos | DELETE | `/api/modules/{id}` | Elimina un módulo |
| Lecciones | GET | `/api/lessons` | Lista lecciones |
| Lecciones | GET | `/api/lessons/{id}` | Obtiene una lección por ID |
| Lecciones | GET | `/api/lessons/module/{moduleId}` | Lista lecciones de un módulo |
| Lecciones | POST | `/api/lessons` | Crea una lección |
| Lecciones | PUT | `/api/lessons/{id}` | Actualiza una lección |
| Lecciones | DELETE | `/api/lessons/{id}` | Elimina una lección |
| Inscripciones | GET | `/api/enrollments` | Lista inscripciones |
| Inscripciones | GET | `/api/enrollments/{id}` | Obtiene una inscripción por ID |
| Inscripciones | GET | `/api/enrollments/user/{userId}` | Lista inscripciones de un usuario |
| Inscripciones | GET | `/api/enrollments/course/{courseId}` | Lista inscripciones de un curso |
| Inscripciones | POST | `/api/enrollments` | Crea una inscripción |
| Inscripciones | PATCH | `/api/enrollments/{id}/status` | Actualiza el estado de una inscripción |
| Inscripciones | DELETE | `/api/enrollments/{id}` | Elimina una inscripción |
| Progreso de lección | GET | `/api/lesson-progress` | Lista registros de progreso |
| Progreso de lección | GET | `/api/lesson-progress/{id}` | Obtiene un progreso por ID |
| Progreso de lección | GET | `/api/lesson-progress/enrollment/{enrollmentId}/lesson/{lessonId}` | Obtiene progreso por inscripción y lección |
| Progreso de lección | GET | `/api/lesson-progress/enrollment/{enrollmentId}` | Lista progreso de una inscripción |
| Progreso de lección | GET | `/api/lesson-progress/lesson/{lessonId}` | Lista progreso de una lección |
| Progreso de lección | PUT | `/api/lesson-progress` | Crea o actualiza progreso |
| Progreso de lección | DELETE | `/api/lesson-progress/{id}` | Elimina un registro de progreso |
| Certificados | GET | `/api/certificates` | Lista certificados |
| Certificados | GET | `/api/certificates/{id}` | Obtiene un certificado por ID |
| Certificados | GET | `/api/certificates/{id}/download` | Descarga certificado PDF |
| Certificados | POST | `/api/certificates` | Emite un certificado |
| Certificados | PUT | `/api/certificates/{id}` | Actualiza un certificado |
| Certificados | DELETE | `/api/certificates/{id}` | Elimina un certificado |
| Comentarios | GET | `/api/comments` | Lista comentarios |
| Comentarios | GET | `/api/comments/{id}` | Obtiene un comentario por ID |
| Comentarios | POST | `/api/comments` | Crea un comentario |
| Comentarios | PUT | `/api/comments/{id}` | Actualiza un comentario |
| Comentarios | DELETE | `/api/comments/{id}` | Elimina un comentario |
| Reseñas | GET | `/api/reviews` | Lista reseñas |
| Reseñas | GET | `/api/reviews/{id}` | Obtiene una reseña por ID |
| Reseñas | POST | `/api/reviews` | Crea una reseña |
| Reseñas | PUT | `/api/reviews/{id}` | Actualiza una reseña |
| Reseñas | DELETE | `/api/reviews/{id}` | Elimina una reseña |

Swagger UI está disponible en:

```text
http://localhost:8080/swagger-ui.html
```

---

## Evidencias de funcionamiento

Las capturas deben colocarse en `docs/evidencias/` para que el README las muestre directamente. Se recomienda capturar la aplicación después de levantarla con `docker compose up --build`.

### Documentación Swagger

| Evidencia | Archivo | Descripción |
|---|---|---|
| Swagger 1 | `docs/evidencias/Swagger-1.png` | Vista de documentación Swagger generada por Springdoc/OpenAPI |
| Swagger 2 | `docs/evidencias/Swagger-2.png` | Evidencia de endpoints disponibles en la API |
| Swagger 3 | `docs/evidencias/Swagger-3.png` | Evidencia de operaciones REST documentadas |
| Swagger 4 | `docs/evidencias/Swagger-4.png` | Evidencia de contratos de request/response |
| Swagger 5 | `docs/evidencias/Swagger-5.png` | Evidencia de módulos adicionales de la API |
| Swagger 6 | `docs/evidencias/Swagger-6.png` | Evidencia final de documentación interactiva |

![Swagger 1](docs/evidencias/Swagger-1.png)

![Swagger 2](docs/evidencias/Swagger-2.png)

![Swagger 3](docs/evidencias/Swagger-3.png)

![Swagger 4](docs/evidencias/Swagger-4.png)

![Swagger 5](docs/evidencias/Swagger-5.png)

![Swagger 6](docs/evidencias/Swagger-6.png)

---

## Convención de commits

Este proyecto usa Conventional Commits:

```text
feat: agrega emisión de certificados
fix: corrige cálculo de progreso por inscripción
docs: actualiza README con arquitectura
chore: actualiza configuración de Docker
```
---
<div align="center">
    <kbd>© 2026 - Grupo 9 | Desarrollo de Aplicaciones Web</kbd>
</div>
