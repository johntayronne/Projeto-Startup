# AI Startup Creator

Sistema de criação e validação de startups usando Inteligência Artificial.

## 🚀 Deploy em Produção

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- PostgreSQL 15+ (para desenvolvimento local)
- Domínio configurado com DNS apontando para o servidor
- Certificados SSL válidos (recomendado Let's Encrypt)

### Configuração do Servidor

1. Instale as dependências necessárias:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y docker docker-compose nginx certbot python3-certbot-nginx
```

2. Configure o Docker:
```bash
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

3. Clone o repositório:
```bash
git clone https://seu-repositorio/ai-startup-creator.git
cd ai-startup-creator
```

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

5. Gere certificados SSL:
```bash
sudo certbot --nginx -d seudominio.com -d www.seudominio.com -d api.seudominio.com
```

### Deploy

1. Execute o script de deploy:
```bash
chmod +x deploy.sh
./deploy.sh
```

2. Verifique os logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Monitoramento

O sistema inclui:
- Prometheus para coleta de métricas
- Grafana para visualização
- PM2 para gerenciamento de processos
- Logs centralizados

Acesse:
- Grafana: https://seudominio.com:3000
- Métricas: https://seudominio.com:9090

### Backup

O sistema realiza backups automáticos:
- Banco de dados: Diariamente
- Arquivos: Semanalmente

Backups são armazenados em: `/backups`

### Manutenção

1. Atualizar o sistema:
```bash
git pull
./deploy.sh
```

2. Verificar status:
```bash
docker-compose -f docker-compose.prod.yml ps
```

3. Reiniciar serviços:
```bash
docker-compose -f docker-compose.prod.yml restart
```

4. Limpar recursos não utilizados:
```bash
docker system prune -a
```

### Segurança

- Firewall configurado (UFW)
- Rate limiting implementado
- Headers de segurança configurados
- SSL/TLS configurado
- Autenticação JWT
- Validação de entrada
- Sanitização de dados

### Troubleshooting

1. Verificar logs:
```bash
# Backend
docker-compose -f docker-compose.prod.yml logs backend

# Frontend
docker-compose -f docker-compose.prod.yml logs frontend

# Nginx
docker-compose -f docker-compose.prod.yml logs nginx
```

2. Verificar status dos serviços:
```bash
docker-compose -f docker-compose.prod.yml ps
```

3. Reiniciar um serviço específico:
```bash
docker-compose -f docker-compose.prod.yml restart [serviço]
```

### Suporte

Para suporte, entre em contato:
- Email: suporte@seudominio.com
- Telegram: @seu_suporte

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 