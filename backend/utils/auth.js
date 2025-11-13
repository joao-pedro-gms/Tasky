import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função simples de hash para senhas (apenas para fins de demonstração)
// AVISO: SHA-256 não é suficiente para hash de senhas em produção
// Em produção, use bcrypt, argon2 ou scrypt com salt e iterações apropriadas
// Isso é aceitável para uma aplicação de demonstração local com armazenamento JSON
export const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Gera um token de sessão simples
export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Armazenamento de sessão persistente em JSON
// Em produção, use Redis ou similar
const DATA_DIR = path.join(__dirname, '../data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Garante que o diretório de dados existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicializa o arquivo de sessões se ele não existir
if (!fs.existsSync(SESSIONS_FILE)) {
  fs.writeFileSync(SESSIONS_FILE, '{}', 'utf8');
}

// Lê sessões do arquivo JSON
const readSessions = () => {
  try {
    const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading sessions:', error);
    return {};
  }
};

// Escreve sessões no arquivo JSON
const writeSessions = (sessions) => {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing sessions:', error);
    return false;
  }
};

export const createSession = (userId) => {
  const token = generateToken();
  const sessions = readSessions();
  sessions[token] = { userId, createdAt: Date.now() };
  writeSessions(sessions);
  return token;
};

export const getSession = (token) => {
  const sessions = readSessions();
  return sessions[token];
};

export const deleteSession = (token) => {
  const sessions = readSessions();
  delete sessions[token];
  writeSessions(sessions);
};

// Middleware para autenticar requisições
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }
  
  const session = getSession(token);
  
  if (!session) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
  
  req.userId = session.userId;
  next();
};
