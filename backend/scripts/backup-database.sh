#!/bin/bash

# Configurações
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Configurações do banco de dados
DB_USER="user"
DB_PASS="password"
DB_NAME="startup"
DB_HOST="localhost"

# Realizar backup
echo "Iniciando backup do banco de dados..."
PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F p > $BACKUP_FILE

# Verificar se o backup foi bem sucedido
if [ $? -eq 0 ]; then
    echo "Backup realizado com sucesso: $BACKUP_FILE"
    
    # Compactar o arquivo
    gzip $BACKUP_FILE
    echo "Backup compactado: ${BACKUP_FILE}.gz"
    
    # Manter apenas os últimos 7 backups
    ls -t $BACKUP_DIR/*.gz | tail -n +8 | xargs -r rm
    
    echo "Backup finalizado com sucesso!"
else
    echo "Erro ao realizar backup!"
    exit 1
fi 