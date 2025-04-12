# Backend da Plataforma de Validação de Startups

Este é o backend da plataforma de validação de startups, desenvolvido com Node.js, TypeScript, Express e Prisma.

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- Prisma (ORM)
- PostgreSQL
- Redis
- Jest
- ESLint
- Prettier

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis >= 6

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd backend
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados
```bash
npm run prisma:migrate
```

5. Gere o cliente Prisma
```bash
npm run prisma:generate
```

## 🚀 Executando o projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

## 📝 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run build`: Compila o projeto
- `npm start`: Inicia o servidor em modo produção
- `npm test`: Executa os testes
- `npm run test:watch`: Executa os testes em modo watch
- `npm run test:coverage`: Gera relatório de cobertura de testes
- `npm run lint`: Executa o linter
- `npm run format`: Formata o código
- `npm run prisma:generate`: Gera o cliente Prisma
- `npm run prisma:migrate`: Executa as migrações do banco de dados
- `npm run prisma:studio`: Abre o Prisma Studio

## 🔒 Segurança

- Rate limiting implementado para proteção contra ataques
- Validação de entrada com Zod
- Autenticação JWT
- Proteção contra CSRF
- Headers de segurança configurados

## 📦 Cache

- Cache com Redis para melhor performance
- Cache em endpoints de consulta
- Invalidação automática de cache em mutações

## 📚 Documentação da API

A documentação da API está disponível em `/api-docs` quando o servidor estiver em execução.

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. 