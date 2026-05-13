# mise description="Start the Vite frontend"

Set-Location "$env:MISE_PROJECT_ROOT/frontend"

if (-not (Test-Path "node_modules")) {
    npm install
}

npm run dev -- --host 0.0.0.0
