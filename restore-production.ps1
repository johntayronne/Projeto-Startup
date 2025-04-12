# Verificar se o arquivo de backup foi fornecido
param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

# Verificar se o arquivo existe
if (-not (Test-Path $BackupFile)) {
    Write-Host "Erro: Arquivo de backup não encontrado: $BackupFile"
    exit 1
}

Write-Host "Iniciando restauração do ambiente de produção..."

# Parar os serviços
Write-Host "`nParando os serviços..."
docker-compose down

# Restaurar banco de dados
Write-Host "`nRestaurando banco de dados..."
docker-compose up -d db
Start-Sleep -Seconds 10  # Aguardar o banco iniciar
docker-compose exec -T db psql -U postgres -c "DROP DATABASE IF EXISTS app;"
docker-compose exec -T db psql -U postgres -c "CREATE DATABASE app;"
docker-compose exec -T db psql -U postgres -d app < $BackupFile

# Restaurar arquivos
Write-Host "`nRestaurando arquivos..."
Expand-Archive -Path $BackupFile -DestinationPath "." -Force

# Reiniciar serviços
Write-Host "`nReiniciando serviços..."
docker-compose up -d

Write-Host "`nRestauração concluída com sucesso!" 