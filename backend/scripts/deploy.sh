#!/bin/bash

# Configurações
APP_NAME="startup-backend"
DEPLOY_DIR="/var/www/$APP_NAME"
BACKUP_DIR="$DEPLOY_DIR/backups"
LOG_FILE="$DEPLOY_DIR/logs/deploy.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Criar diretórios necessários
mkdir -p $DEPLOY_DIR $BACKUP_DIR $DEPLOY_DIR/logs

# Função para logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Função para backup
backup() {
    log "Iniciando backup..."
    
    # Backup do banco de dados
    ./scripts/backup-database.sh
    
    # Backup dos arquivos
    tar -czf $BACKUP_DIR/files_$TIMESTAMP.tar.gz $DEPLOY_DIR --exclude="$DEPLOY_DIR/backups" --exclude="$DEPLOY_DIR/logs"
    
    log "Backup concluído"
}

# Função para rollback
rollback() {
    log "Iniciando rollback..."
    
    # Restaurar banco de dados
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.sql.gz | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        ./scripts/restore-database.sh $(basename $LATEST_BACKUP)
    fi
    
    # Restaurar arquivos
    LATEST_FILES_BACKUP=$(ls -t $BACKUP_DIR/files_*.tar.gz | head -1)
    if [ -n "$LATEST_FILES_BACKUP" ]; then
        tar -xzf $LATEST_FILES_BACKUP -C /
    fi
    
    log "Rollback concluído"
}

# Iniciar deploy
log "Iniciando deploy..."

# Backup antes do deploy
backup

# Parar serviços
log "Parando serviços..."
docker-compose down

# Atualizar código
log "Atualizando código..."
git pull origin main

# Instalar dependências
log "Instalando dependências..."
npm ci

# Gerar cliente Prisma
log "Gerando cliente Prisma..."
npx prisma generate

# Executar migrações
log "Executando migrações..."
npx prisma migrate deploy

# Build da aplicação
log "Build da aplicação..."
npm run build

# Iniciar serviços
log "Iniciando serviços..."
docker-compose up -d

# Verificar saúde da aplicação
log "Verificando saúde da aplicação..."
sleep 10
if curl -s http://localhost:3000/health | grep -q "ok"; then
    log "Deploy concluído com sucesso!"
else
    log "Erro no deploy! Iniciando rollback..."
    rollback
    exit 1
fi

# Limpar backups antigos
log "Limpando backups antigos..."
find $BACKUP_DIR -type f -mtime +7 -delete

log "Processo de deploy finalizado" 