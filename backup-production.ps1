# Definir variáveis
$backupDir = ".\backups"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "$backupDir\backup_$timestamp"

# Criar diretório de backup se não existir
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

Write-Host "Iniciando backup do ambiente de produção..."

# Backup do banco de dados
Write-Host "`nFazendo backup do banco de dados..."
docker-compose exec -T db pg_dump -U postgres > "$backupPath.sql"

# Backup dos arquivos
Write-Host "`nFazendo backup dos arquivos..."
Compress-Archive -Path ".\src", ".\config", ".\docker-compose.yml", ".\Dockerfile" -DestinationPath "$backupPath.zip"

Write-Host "`nBackup concluído com sucesso!"
Write-Host "Arquivos de backup:"
Write-Host "- Banco de dados: $backupPath.sql"
Write-Host "- Arquivos: $backupPath.zip" 