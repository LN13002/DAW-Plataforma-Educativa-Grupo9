# mise description="Start the Spring Boot backend and open Swagger UI"

Set-Location "$env:MISE_PROJECT_ROOT/backend"

$port = 8080
$conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($conn) { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue }

$job = Start-Job -ScriptBlock { Set-Location $using:PWD; .\mvnw.cmd spring-boot:run }

Write-Host "Waiting for backend to be ready..."
while (-not (Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -ErrorAction SilentlyContinue)) {
    Start-Sleep 2
}
Start-Process "http://localhost:8080/swagger-ui.html"
Receive-Job -Job $job -Wait
