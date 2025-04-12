#!/bin/bash

# Configurações
APP_URL="http://localhost:3000"
LOG_FILE="logs/health-check.log"
ALERT_EMAIL="admin@exemplo.com"
MAX_RETRIES=3
RETRY_INTERVAL=5

# Criar diretório de logs se não existir
mkdir -p logs

# Função para logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Função para enviar alerta
send_alert() {
    local subject="$1"
    local message="$2"
    echo "$message" | mail -s "$subject" $ALERT_EMAIL
    log "ALERTA: $message"
}

# Verificar endpoint de saúde
check_health() {
    local retries=0
    local success=false
    
    while [ $retries -lt $MAX_RETRIES ] && [ "$success" = false ]; do
        response=$(curl -s -w "%{http_code}" $APP_URL/health)
        status_code=${response: -3}
        body=${response%???}
        
        if [ $status_code -eq 200 ] && [ "$body" = "ok" ]; then
            success=true
            log "Health check bem sucedido"
            return 0
        fi
        
        retries=$((retries + 1))
        if [ $retries -lt $MAX_RETRIES ]; then
            log "Tentativa $retries falhou. Aguardando $RETRY_INTERVAL segundos..."
            sleep $RETRY_INTERVAL
        fi
    done
    
    if [ "$success" = false ]; then
        send_alert "Falha no Health Check" "O endpoint de saúde não está respondendo corretamente após $MAX_RETRIES tentativas"
        return 1
    fi
}

# Verificar banco de dados
check_database() {
    if ! PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1; then
        send_alert "Falha no Banco de Dados" "Não foi possível conectar ao banco de dados"
        return 1
    fi
    log "Conexão com banco de dados OK"
    return 0
}

# Verificar Redis
check_redis() {
    if ! redis-cli ping > /dev/null 2>&1; then
        send_alert "Falha no Redis" "Não foi possível conectar ao Redis"
        return 1
    fi
    log "Conexão com Redis OK"
    return 0
}

# Verificar uso de recursos
check_resources() {
    # CPU
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
    if [ $cpu_usage -gt 90 ]; then
        send_alert "Alto Uso de CPU" "Uso de CPU está em ${cpu_usage}%"
    fi
    
    # Memória
    memory_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}' | cut -d. -f1)
    if [ $memory_usage -gt 90 ]; then
        send_alert "Alto Uso de Memória" "Uso de memória está em ${memory_usage}%"
    fi
    
    # Disco
    disk_usage=$(df / | tail -1 | awk '{print $5}' | cut -d% -f1)
    if [ $disk_usage -gt 90 ]; then
        send_alert "Alto Uso de Disco" "Uso de disco está em ${disk_usage}%"
    fi
}

# Executar verificações
log "Iniciando health check..."

check_health
health_status=$?

check_database
db_status=$?

check_redis
redis_status=$?

check_resources

# Verificar status geral
if [ $health_status -eq 0 ] && [ $db_status -eq 0 ] && [ $redis_status -eq 0 ]; then
    log "Todos os sistemas estão funcionando corretamente"
    exit 0
else
    log "Problemas detectados nos sistemas"
    exit 1
fi 