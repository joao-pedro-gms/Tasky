import crypto from 'crypto';

// Simple hash function for passwords (for demo purposes)
// In production, use bcrypt or similar
export const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Generate a simple session token
export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Simple in-memory session store
// In production, use Redis or similar
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

// Middleware to authenticate requests
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
