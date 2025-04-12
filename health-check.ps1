# Função para verificar se um serviço está respondendo
function Test-ServiceHealth {
    param (
        [string]$ServiceName,
        [string]$Url
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "${ServiceName}: OK (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "${ServiceName}: ERRO (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "${ServiceName}: ERRO ($($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

# Verificar serviços
Write-Host "Verificando saúde do ambiente de produção..."
Write-Host "==========================================="

# Verificar API
$apiHealth = Test-ServiceHealth -ServiceName "API" -Url "http://localhost:3001/health"

# Verificar Frontend
$frontendHealth = Test-ServiceHealth -ServiceName "Frontend" -Url "http://localhost:3000"

# Verificar banco de dados
docker-compose exec -T db pg_isready -U postgres
if ($LASTEXITCODE -eq 0) {
    Write-Host "Banco de Dados: OK" -ForegroundColor Green
} else {
    Write-Host "Banco de Dados: ERRO" -ForegroundColor Red
}

# Verificar Redis
try {
    $redisHealth = docker-compose exec -T redis redis-cli ping
    if ($redisHealth -eq "PONG") {
        Write-Host "Redis: OK" -ForegroundColor Green
    } else {
        Write-Host "Redis: ERRO" -ForegroundColor Red
    }
} catch {
    Write-Host "Redis: ERRO ($($_.Exception.Message))" -ForegroundColor Red
}

# Verificar uso de recursos
Write-Host "`nUso de Recursos:"
docker stats --no-stream

# Verificar logs de erro
Write-Host "`nÚltimos erros nos logs:"
docker-compose logs --tail=50 | Select-String -Pattern "error|Error|ERROR|exception|Exception|EXCEPTION" -Context 2,2

# Status geral
if ($apiHealth -and $frontendHealth -and $LASTEXITCODE -eq 0) {
    Write-Host "`nStatus Geral: SAUDÁVEL" -ForegroundColor Green
} else {
    Write-Host "`nStatus Geral: PROBLEMAS DETECTADOS" -ForegroundColor Red
} 