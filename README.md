# AprendeUES

Plataforma educativa moderna diseñada para ofrecer contenido en video, recursos interactivos y herramientas de aprendizaje estructurado.

El proyecto está organizado bajo una arquitectura desacoplada en tres capas principales: **Frontend**, **Backend** y **Database**, permitiendo escalabilidad, mantenibilidad y evolución independiente de cada componente.

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

## Requisitos previos

Antes de levantar el proyecto asegúrate de tener instalado:

- [mise](https://mise.jdx.dev/) — gestión de herramientas y tareas → [ver guía de instalación](docs/mise.md)
- [Docker](https://www.docker.com/) — para la base de datos PostgreSQL

mise se encarga de instalar automáticamente **Java 21 (Temurin)** al entrar al proyecto.

---

## Configuración inicial (solo la primera vez)

```bash
# Clona el repositorio
git clone <url-del-repositorio>
cd DAW-Plataforma-Educativa-Grupo9

# Autoriza el mise.toml del proyecto (medida de seguridad de mise)
mise trust

# Instala las herramientas definidas en mise.toml (Java 21)
mise install
```

---

## Levantar el proyecto

```bash
mise run dev
```

Esto ejecuta en orden:

1. Levanta PostgreSQL en Docker en el puerto **5433**
2. Arranca el backend de Spring Boot
3. Aplica las migraciones de base de datos automáticamente con **Flyway**
4. Abre el navegador en **Swagger UI** cuando el servidor esté listo

---

## Tareas disponibles

| Comando | Descripción |
|---|---|
| `mise run dev` | Inicia todo: base de datos + backend |
| `mise run backend` | Solo el backend (requiere DB activa) |
| `mise run db:up` | Solo levanta el contenedor de PostgreSQL |
| `mise run db:down` | Detiene y elimina el contenedor |
| `mise run db:logs` | Muestra los logs de PostgreSQL |
| `mise run db:migrate` | Ejecuta las migraciones sin arrancar el backend |

---

## URLs de desarrollo

| Servicio | URL |
|---|---|
| API base | `http://localhost:8080/api` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| Actuator (health) | `http://localhost:8080/actuator/health` |

---

## Base de datos

PostgreSQL corre en Docker con la siguiente configuración:

| Parámetro | Valor |
|---|---|
| Host | `localhost` |
| Puerto | `5433` |
| Base de datos | `aprende_ues` |
| Usuario | `aprende_ues` |
| Contraseña | `aprende_ues` |

> El puerto es **5433** (no 5432) para evitar conflictos con instalaciones locales de PostgreSQL.

### Migraciones

El schema se gestiona con **Flyway**. Cada cambio a la base de datos debe hacerse creando un nuevo archivo en:

```
backend/src/main/resources/db/migration/
├── V1__initial_schema.sql   ← tablas, enums, triggers
└── V2__seed_data.sql        ← datos de prueba
```

**Regla:** nunca modificar archivos `V` ya commiteados. Flyway verifica el checksum y fallará para todos los miembros del equipo.

Para agregar un cambio nuevo:
```
V3__descripcion_del_cambio.sql
V4__otra_migracion.sql
```

---

## Arquitectura del Backend

```
backend/src/main/java/com/aprende/ues/backend/
├── config/       ← Configuración de Swagger/OpenAPI
├── controller/   ← Endpoints REST con anotaciones @Operation @Tag
├── dto/          ← Objetos de transferencia (Request/Response)
├── model/        ← Entidades JPA y enums
│   └── enums/
├── repository/   ← Interfaces JpaRepository
└── service/      ← Lógica de negocio y mapeo Entity ↔ DTO
```

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Spring Boot 3.5 + Java 21 |
| Persistencia | Spring Data JPA + Hibernate 6 |
| Base de datos | PostgreSQL 16 |
| Migraciones | Flyway |
| Documentación | SpringDoc OpenAPI (Swagger UI) |
| Contenedores | Docker / Docker Compose |
| Gestión de entorno | mise |

---

## Funcionalidades planeadas

- [ ] Sistema de cursos y módulos
- [ ] Reproductor de video con control de avance
- [ ] Seguimiento de progreso por usuario
- [ ] Sistema de certificados
- [ ] Panel administrativo

---

## Convención de commits

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agrega endpoint de creación de cursos
fix: corrige validación de UUID en CourseController
chore: actualiza dependencia de Flyway
docs: actualiza README con pasos de instalación
```
