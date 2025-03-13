const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded); // Log para depuração
    req.user = decoded; // Deve conter req.user.id
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err.message); // Log para depuração
    res.status(401).json({ message: 'Token inválido.' });
  }
};