#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar diretórios necessários
log "Criando diretórios necessários..."
mkdir -p nginx/ssl
mkdir -p logs

# Verificar certificados SSL
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    warning "Certificados SSL não encontrados. Gerando certificados self-signed..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=BR/ST=Estado/L=Cidade/O=Organização/CN=seudominio.com"
fi

# Parar containers existentes
log "Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down

# Remover imagens antigas
log "Removendo imagens antigas..."
docker-compose -f docker-compose.prod.yml down --rmi all

# Construir novas imagens
log "Construindo novas imagens..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar containers
log "Iniciando containers..."
docker-compose -f docker-compose.prod.yml up -d

# Verificar status dos containers
log "Verificando status dos containers..."
docker-compose -f docker-compose.prod.yml ps

# Executar migrações do banco de dados
log "Executando migrações do banco de dados..."
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

# Verificar logs
log "Verificando logs..."
docker-compose -f docker-compose.prod.yml logs --tail=100

log "Deploy concluído com sucesso!"
log "A aplicação está disponível em: https://seudominio.com"
log "API está disponível em: https://api.seudominio.com" 
log "Deploy concluído com sucesso!" 