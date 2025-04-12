# Verificar se o Docker está instalado
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker não encontrado. Por favor, instale o Docker Desktop para Windows."
    exit 1
}

# Verificar se o Docker Compose está instalado
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Compose não encontrado. Por favor, instale o Docker Desktop para Windows."
    exit 1
}

Write-Host "Iniciando reinicialização do ambiente de produção..."
Write-Host "================================================"

# Parar os serviços
Write-Host "`nParando os serviços..."
docker-compose down

# Limpar volumes não utilizados
Write-Host "`nLimpando volumes não utilizados..."
docker volume prune -f

# Limpar imagens não utilizadas
Write-Host "`nLimpando imagens não utilizadas..."
docker image prune -f

# Reconstruir as imagens
Write-Host "`nReconstruindo as imagens..."
docker-compose build --no-cache

# Iniciar os serviços
Write-Host "`nIniciando os serviços..."
docker-compose up -d

# Verificar status dos serviços
Write-Host "`nVerificando status dos serviços..."
docker-compose ps

# Verificar logs de erro
Write-Host "`nVerificando logs de erro..."
docker-compose logs --tail=50 | Select-String -Pattern "error|Error|ERROR|exception|Exception|EXCEPTION" -Context 2,2

Write-Host "`nReinicialização concluída com sucesso!"
Write-Host "Frontend: https://localhost:3000"
Write-Host "Backend: https://localhost:3001"
Write-Host "Redis: localhost:6379"
Write-Host "PostgreSQL: localhost:5432" 