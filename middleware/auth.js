const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('--- Auth Middleware Debug ---');
  console.log('req.path:', req.path);
  console.log('req.headers.authorization:', req.headers.authorization);

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('Nenhum token fornecido');
    return res.status(401).json({ message: 'Acesso negado: nenhum token fornecido' });
  }

  try {
    console.log('Verificando token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    req.user = decoded;
    console.log('req.user definido:', req.user);
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    res.status(401).json({ message: 'Acesso negado: token inválido' });
  }
};

module.exports = authMiddleware;
