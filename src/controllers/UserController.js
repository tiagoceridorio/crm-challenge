const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_PATH = path.join(__dirname, '../../users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8')).Users;
}
function writeUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify({ Users: users }, null, 2));
}

module.exports = {
  index: (req, res) => {
    // Lista todos os usuários, pode receber filtros via query
    const { companyId } = req.query;
    let users = readUsers();
    if (companyId) users = users.filter(u => u.companyId === Number(companyId));
    users = users.map(u => { const { passwordHash, ...rest } = u; return rest; });
    return res.status(200).json(users);
  },
  list: (req, res) => {
    // Lista simplificada (id, name, email) filtrada por companyId
    const { companyId } = req.query;
    let users = readUsers();
    if (companyId) users = users.filter(u => u.companyId === Number(companyId));
    const simple = users.map(u => ({ id: u.id, name: u.name, email: u.email }));
    return res.status(200).json(simple);
  },
  store: (req, res) => {
    // Cria um novo usuário
    const users = readUsers();
    const { name, email, password, companyId } = req.body;
    if (!name || !email || !password || !companyId) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, email, password, companyId' });
    }
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const now = new Date().toISOString();
    const passwordHash = bcrypt.hashSync(password, 8);
    const user = {
      id, name, email, passwordHash, createdAt: now, updatedAt: now, profile: 'user',
      tokenVersion: 0, companyId: Number(companyId), super: false, online: false, endWork: '23:59',
      startWork: '00:00', color: null, farewellMessage: null, whatsappId: null, allTicket: 'enable',
      allowGroup: true, defaultMenu: 'closed', defaultTheme: 'light', profileImage: null, wpp: null
    };
    users.push(user);
    writeUsers(users);
    const { passwordHash: _, ...userNoPass } = user;
    return res.status(201).json(userNoPass);
  },
  update: (req, res) => {
    // Atualiza um usuário existente
    const users = readUsers();
    const { userId } = req.params;
    const idx = users.findIndex(u => u.id === Number(userId));
    if (idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
    const { name, email, password, ...rest } = req.body;
    if (name) users[idx].name = name;
    if (email) users[idx].email = email;
    if (password) users[idx].passwordHash = bcrypt.hashSync(password, 8);
    Object.assign(users[idx], rest);
    users[idx].updatedAt = new Date().toISOString();
    writeUsers(users);
    const { passwordHash, ...userNoPass } = users[idx];
    return res.status(200).json(userNoPass);
  },
  show: (req, res) => {
    // Mostra detalhes de um usuário
    const users = readUsers();
    const { userId } = req.params;
    const user = users.find(u => u.id === Number(userId));
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const { passwordHash, ...userNoPass } = user;
    return res.status(200).json(userNoPass);
  },
  remove: (req, res) => {
    // Remove um usuário
    let users = readUsers();
    const { userId } = req.params;
    const idx = users.findIndex(u => u.id === Number(userId));
    if (idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
    users.splice(idx, 1);
    writeUsers(users);
    return res.status(200).json({ success: true });
  },
  mediaUpload: (req, res) => {
    // Upload de mídia para o usuário (apenas salva o nome do arquivo no profileImage)
    const users = readUsers();
    const { userId } = req.params;
    const idx = users.findIndex(u => u.id === Number(userId));
    if (idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
    if (!req.files || !req.files.length) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    users[idx].profileImage = req.files[0].filename;
    users[idx].updatedAt = new Date().toISOString();
    writeUsers(users);
    const { passwordHash, ...userNoPass } = users[idx];
    return res.status(200).json(userNoPass);
  }
};
