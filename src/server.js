const app = require('./index');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');


const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors({ origin: '*' }));

// Torna o io acessível globalmente para os controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Novo cliente conectado ao socket');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});