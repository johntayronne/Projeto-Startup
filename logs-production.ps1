# Verificar logs dos serviços
Write-Host "Exibindo logs dos serviços..."
docker-compose logs --tail=100 --follow 