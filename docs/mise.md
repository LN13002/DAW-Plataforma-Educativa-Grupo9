# Guía de mise

[mise](https://mise.jdx.dev/) es una herramienta que gestiona versiones de lenguajes/runtimes (Java, Node, Python…) y define tareas de desarrollo, todo desde un archivo `mise.toml` en la raíz del proyecto.

Es el reemplazo moderno de `asdf`, `nvm`, `sdkman` y Makefiles combinados.

---

## Instalación

### Linux / macOS

```bash
curl https://mise.run | sh
```

Luego agrega mise a tu shell. Ejecuta **uno** de estos según el shell que uses:

```bash
# Bash (~/.bashrc)
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc && source ~/.bashrc

# Zsh (~/.zshrc)
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc && source ~/.zshrc

# Fish (~/.config/fish/config.fish)
echo '~/.local/bin/mise activate fish | source' >> ~/.config/fish/config.fish
```

Verifica la instalación:

```bash
mise --version
```

### Windows

```powershell
winget install jdx.mise
```

Luego activa mise en PowerShell:

```powershell
Add-Content $PROFILE "`n& mise activate pwsh | Out-String | Invoke-Expression"
. $PROFILE
```

---

## Primer uso en este proyecto

Al clonar el repositorio por primera vez, mise pedirá que confíes en el archivo `mise.toml` antes de ejecutar cualquier tarea:

```bash
cd DAW-Plataforma-Educativa-Grupo9
mise trust
```

> Esto es una medida de seguridad de mise para evitar ejecutar scripts de repositorios desconocidos.

Luego instala las herramientas declaradas en `mise.toml` (Java 21 y Node.js LTS):

```bash
mise install
```

mise descargará y configurará automáticamente **Java 21 (Temurin)** y **Node.js LTS** sin tocar las instalaciones globales de tu sistema.

---

## Tareas del proyecto

Las tareas están definidas en `mise.toml` y se ejecutan con `mise run <tarea>`.

| Comando | Descripción |
|---|---|
| `mise run dev` | Inicia todo: base de datos + backend + frontend |
| `mise run backend` | Solo el backend (requiere DB activa) |
| `mise run frontend` | Solo el frontend de Vite |
| `mise run db:up` | Levanta el contenedor de PostgreSQL |
| `mise run db:down` | Detiene y elimina el contenedor |
| `mise run db:logs` | Muestra los logs de PostgreSQL en tiempo real |
| `mise run db:migrate` | Ejecuta migraciones de Flyway sin arrancar el backend |

Puedes ver todas las tareas disponibles con:

```bash
mise tasks
```

---

## Variables de entorno

mise inyecta automáticamente las variables definidas en `[env]` del `mise.toml` al ejecutar cualquier tarea. No necesitas crear un archivo `.env` manual.

```toml
[env]
DB_HOST     = "localhost"
DB_PORT     = "5433"
DB_NAME     = "aprende_ues"
DB_USER     = "aprende_ues"
DB_PASSWORD = "aprende_ues"
```

---

## Comandos útiles

```bash
# Ver las herramientas instaladas en el proyecto actual
mise list

# Ver todas las tareas disponibles
mise tasks

# Ejecutar una tarea
mise run <nombre>

# Instalar una herramienta manualmente
mise install java@temurin-21

# Actualizar mise
mise self-update
```

---

## Más información

- Documentación oficial: https://mise.jdx.dev/
- Repositorio: https://github.com/jdx/mise
