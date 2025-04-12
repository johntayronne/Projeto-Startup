#!/bin/bash

# Configurações
BACKUP_DIR="backups"
DB_USER="user"
DB_PASS="password"
DB_NAME="startup"
DB_HOST="localhost"

# Verificar se foi fornecido um arquivo de backup
if [ -z "$1" ]; then
    echo "Por favor, forneça o arquivo de backup."
    echo "Uso: $0 <arquivo_de_backup>"
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

# Verificar se o arquivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Arquivo de backup não encontrado: $BACKUP_FILE"
    exit 1
fi

# Verificar se é um arquivo compactado
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Descompactando arquivo de backup..."
    gunzip -c "$BACKUP_FILE" > "${BACKUP_FILE%.gz}"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Restaurar banco de dados
echo "Iniciando restauração do banco de dados..."
PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME < $BACKUP_FILE

# Verificar se a restauração foi bem sucedida
if [ $? -eq 0 ]; then
    echo "Restauração realizada com sucesso!"
    
    # Remover arquivo temporário se foi descompactado
    if [[ "$1" == *.gz ]]; then
        rm $BACKUP_FILE
    fi
else
    echo "Erro ao restaurar banco de dados!"
    exit 1
fi 