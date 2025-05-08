const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Redireciona a home para a documentação do Swagger
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});
app.use('/', userRoutes);

const JWT_SECRET = 'mysecret';
const JWT_EXPIRES = '15m';
const JWT_REFRESH_EXPIRES = '7d';

// Cache simples em memória
const cache = new Map();

function getUsers() {
  const data = fs.readFileSync(require('path').join(__dirname, '../users.json'), 'utf8');
  return JSON.parse(data).Users;
}

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });
  const payload = { id: user.id, email: user.email, profile: user.profile, tokenVersion: user.tokenVersion };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  const refreshToken = jwt.sign({ id: user.id, tokenVersion: user.tokenVersion }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });
  res.json({ token, refreshToken });
});

// Renovar token
app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Token ausente' });
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const users = getUsers();
    const user = users.find(u => u.id === decoded.id);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    const payload = { id: user.id, email: user.email, profile: user.profile, tokenVersion: user.tokenVersion };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
});

// Middleware de autenticação
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = app;
