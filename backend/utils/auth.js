import crypto from 'crypto';

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

// Armazenamento de sessão simples em memória
// Em produção, use Redis ou similar
const sessions = new Map();

export const createSession = (userId) => {
  const token = generateToken();
  sessions.set(token, { userId, createdAt: Date.now() });
  return token;
};

export const getSession = (token) => {
  return sessions.get(token);
};

export const deleteSession = (token) => {
  sessions.delete(token);
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
