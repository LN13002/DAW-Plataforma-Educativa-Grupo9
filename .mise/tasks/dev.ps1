# mise description="Start Postgres, backend and frontend in development mode"

mise run db:up

$backend = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    mise run backend
}

$frontend = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    mise run frontend
}

try {
    Receive-Job -Job $backend, $frontend -Wait
}
finally {
    Stop-Job -Job $backend, $frontend -ErrorAction SilentlyContinue
    Remove-Job -Job $backend, $frontend -ErrorAction SilentlyContinue
}
