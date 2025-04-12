#!/bin/bash

# Criar diretório para certificados
mkdir -p nginx/ssl

# Gerar chave privada
openssl genrsa -out nginx/ssl/key.pem 2048

# Gerar certificado
openssl req -new -x509 -key nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -subj "/CN=localhost"

# Ajustar permissões
chmod 644 nginx/ssl/cert.pem
chmod 600 nginx/ssl/key.pem

echo "Certificados SSL gerados com sucesso!" 