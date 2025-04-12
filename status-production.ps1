# Verificar status dos serviços
Write-Host "Verificando status dos serviços..."
docker-compose ps

# Verificar uso de recursos
Write-Host "`nVerificando uso de recursos..."
docker stats --no-stream

# Verificar logs de erros
Write-Host "`nVerificando logs de erros..."
docker-compose logs --tail=50 | Select-String -Pattern "error|Error|ERROR|exception|Exception|EXCEPTION" -Context 2,2 