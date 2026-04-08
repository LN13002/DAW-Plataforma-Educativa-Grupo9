# mise description="Run pending Flyway migrations without starting the app"

Set-Location "$env:MISE_PROJECT_ROOT/backend"

.\mvnw.cmd flyway:migrate `
  "-Dflyway.url=jdbc:postgresql://$env:DB_HOST`:$env:DB_PORT/$env:DB_NAME" `
  "-Dflyway.user=$env:DB_USER" `
  "-Dflyway.password=$env:DB_PASSWORD"
