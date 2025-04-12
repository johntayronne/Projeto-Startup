# Verificar se o Docker está instalado
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker não encontrado. Por favor, instale o Docker Desktop para Windows."
    exit 1
}

# Verificar se o Docker Compose está instalado
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Compose não encontrado. Por favor, instale o Docker Desktop para Windows."
    exit 1
}

# Verificar se o Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js não encontrado. Por favor, instale o Node.js."
    exit 1
}

# Verificar se o npm está instalado
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm não encontrado. Por favor, instale o Node.js."
    exit 1
}

# Verificar se o OpenSSL está instalado
if (!(Test-Path "C:\Program Files\OpenSSL-Win64\bin\openssl.exe")) {
    Write-Host "OpenSSL não encontrado. Por favor, instale o OpenSSL para Windows."
    Write-Host "Você pode baixar em: https://slproweb.com/products/Win32OpenSSL.html"
    exit 1
}

# Gerar certificados SSL
Write-Host "Gerando certificados SSL..."
& .\generate-certificates.ps1

# Instalar dependências do backend
Write-Host "Instalando dependências do backend..."
Set-Location backend
npm install
Set-Location ..

# Instalar dependências do frontend
Write-Host "Instalando dependências do frontend..."
Set-Location frontend
npm install
Set-Location ..

# Iniciar os serviços com Docker Compose
Write-Host "Iniciando serviços..."
docker-compose up -d

Write-Host "Ambiente de produção iniciado com sucesso!"
Write-Host "Frontend: https://localhost:3000"
Write-Host "Backend: https://localhost:3001"
Write-Host "Redis: localhost:6379"
Write-Host "PostgreSQL: localhost:5432" 