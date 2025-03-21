const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded); // Deve mostrar { user: { id: "..." }, iat: ..., exp: ... }
    req.user = decoded.user; // Certifique-se de que req.user.id existe
    if (!req.user.id) {
      throw new Error('ID do usuário não encontrado no token');
    }
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    res.status(401).json({ message: 'Token inválido.' });
  }
};
