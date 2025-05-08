# Use imagem oficial do Node.js
FROM node:18

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta padrão (ajuste se necessário)
EXPOSE 3000

# Comando padrão para iniciar a aplicação
CMD ["npm", "start"]
