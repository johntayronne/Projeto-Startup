# Criar diretório para certificados
New-Item -ItemType Directory -Force -Path "nginx/ssl"

# Gerar certificado SSL
$opensslPath = "C:\Program Files\OpenSSL-Win64\bin\openssl.exe"

if (Test-Path $opensslPath) {
    & $opensslPath req -x509 -nodes -days 365 -newkey rsa:2048 `
        -keyout nginx/ssl/key.pem `
        -out nginx/ssl/cert.pem `
        -subj "/C=BR/ST=Sao Paulo/L=Sao Paulo/O=Startup/CN=localhost"
    
    Write-Host "Certificados SSL gerados com sucesso!"
} else {
    Write-Host "OpenSSL não encontrado. Por favor, instale o OpenSSL para Windows."
    Write-Host "Você pode baixar em: https://slproweb.com/products/Win32OpenSSL.html"
    exit 1
} 