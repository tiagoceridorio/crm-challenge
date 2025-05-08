# CRM Challenge

API de autenticação, gerenciamento de usuários e eventos em tempo real via Socket.IO.

## Funcionalidades
- Login e renovação de token JWT
- CRUD de usuários (criação, listagem, atualização, remoção)
- Upload de mídia para usuários
- Emissão de eventos em tempo real (userUpdated, userDeleted) via WebSocket (Socket.IO)
- Documentação REST via Swagger
- Documentação de eventos em tempo real via AsyncAPI

## Requisitos
- Node.js 18+
- npm

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd crm-challenge
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```

## Uso

### Rodando localmente
```bash
npm start
```
A API estará disponível em http://localhost:3000

### Rodando em modo desenvolvimento (com hot reload)
```bash
npm run dev
```

### Rodando com Docker
```bash
# Build da imagem
docker build -t crm-challenge .
# Execução do container
docker run -p 3000:3000 crm-challenge
```

## Testes
```bash
npm test
```

## Documentação

### Swagger (API REST)
Acesse http://localhost:3000/api-docs para visualizar e testar os endpoints REST.

### AsyncAPI (Eventos em tempo real)
- Os eventos emitidos pelo backend estão documentados no arquivo `asyncapi.yaml`.
- Visualize a documentação dos eventos em https://studio.asyncapi.com/ abrindo o arquivo `asyncapi.yaml`.
- Eventos disponíveis:
  - `userUpdated`: emitido quando um usuário é atualizado
  - `userDeleted`: emitido quando um usuário é removido
- URL do servidor de eventos: `ws://localhost:3000`

## Estrutura do Projeto
```
asyncapi.yaml         # Documentação dos eventos Socket.IO
Dockerfile            # Configuração para container Docker
package.json          # Dependências e scripts
swagger.json          # Documentação Swagger da API REST
users.json            # Base de dados dos usuários (JSON)
src/
  index.js            # Inicialização do Express
  server.js           # Inicialização do servidor HTTP + Socket.IO
  controllers/        # Lógica dos endpoints
  middlewares/        # Middlewares de autenticação
  routes/             # Rotas da API
uploads/              # Uploads de arquivos
```

## Observações
- O arquivo `users.json` serve como banco de dados local.
- Para consumir os eventos em tempo real, conecte-se ao servidor Socket.IO e escute pelos eventos documentados.
- Para adicionar novos eventos, edite o arquivo `asyncapi.yaml`.

---

Projeto para fins de desafio técnico. Qualquer dúvida, abra uma issue!
