#!/bin/bash

# Configurações
LOG_FILE="logs/monitor.log"
ALERT_EMAIL="admin@exemplo.com"
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=80

# Criar diretório de logs se não existir
mkdir -p logs

# Função para enviar alerta por email
send_alert() {
    local subject="$1"
    local message="$2"
    echo "$message" | mail -s "$subject" $ALERT_EMAIL
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ALERTA: $message" >> $LOG_FILE
}

# Verificar uso de CPU
check_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
    if [ $cpu_usage -gt $CPU_THRESHOLD ]; then
        send_alert "Alerta de CPU" "Uso de CPU está em ${cpu_usage}%"
    fi
}

# Verificar uso de memória
check_memory() {
    local memory_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}' | cut -d. -f1)
    if [ $memory_usage -gt $MEMORY_THRESHOLD ]; then
        send_alert "Alerta de Memória" "Uso de memória está em ${memory_usage}%"
    fi
}

# Verificar uso de disco
check_disk() {
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | cut -d% -f1)
    if [ $disk_usage -gt $DISK_THRESHOLD ]; then
        send_alert "Alerta de Disco" "Uso de disco está em ${disk_usage}%"
    fi
}

# Verificar serviços
check_services() {
    local services=("nginx" "postgresql" "redis" "node")
    for service in "${services[@]}"; do
        if ! systemctl is-active --quiet $service; then
            send_alert "Alerta de Serviço" "O serviço $service está inativo"
        fi
    done
}

# Verificar logs de erro
check_error_logs() {
    local error_count=$(grep -c "ERROR" logs/error.log)
    if [ $error_count -gt 100 ]; then
        send_alert "Alerta de Logs" "Muitos erros detectados nos logs: $error_count"
    fi
}

# Verificar conexões de banco de dados
check_db_connections() {
    local connections=$(psql -U user -d startup -c "SELECT count(*) FROM pg_stat_activity;" -t)
    if [ $connections -gt 100 ]; then
        send_alert "Alerta de Banco de Dados" "Muitas conexões ativas: $connections"
    fi
}

# Loop principal
while true; do
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Iniciando verificação..." >> $LOG_FILE
    
    check_cpu
    check_memory
    check_disk
    check_services
    check_error_logs
    check_db_connections
    
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Verificação concluída" >> $LOG_FILE
    
    # Aguardar 5 minutos antes da próxima verificação
    sleep 300
done 