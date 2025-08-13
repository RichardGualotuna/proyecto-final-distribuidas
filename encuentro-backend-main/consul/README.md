Invoke-RestMethod -Method Put -Uri http://localhost:8500/v1/agent/service/register -ContentType "application/json" -InFile .\ms-events.json
