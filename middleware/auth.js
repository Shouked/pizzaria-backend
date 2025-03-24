const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificações básicas
    if (!decoded || !decoded.userId || !decoded.tenantId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Adiciona o usuário decodificado no request
    req.user = decoded;

    // Verifica se o tenant da URL ou middleware de tenant existe e bate com o token
    if (req.tenant) {
      const tenantIdFromRequest = req.tenant._id.toString();
      const tenantIdFromToken = decoded.tenantId;

      if (tenantIdFromRequest !== tenantIdFromToken) {
        return res.status(403).json({ message: 'Access denied to this tenant' });
      }
    }

    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;