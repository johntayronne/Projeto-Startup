# Definir intervalo de monitoramento (em segundos)
$interval = 60

# Loop infinito de monitoramento
while ($true) {
    Clear-Host
    Write-Host "Monitoramento do Ambiente de Produção"
    Write-Host "====================================="
    Write-Host "Última atualização: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
    Write-Host "`nStatus dos Serviços:"
    docker-compose ps

    Write-Host "`nUso de Recursos:"
    docker stats --no-stream

    Write-Host "`nLogs de Erro (últimos 50):"
    docker-compose logs --tail=50 | Select-String -Pattern "error|Error|ERROR|exception|Exception|EXCEPTION" -Context 2,2

    Write-Host "`nPressione Ctrl+C para sair..."
    Start-Sleep -Seconds $interval
} 