const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Obter o token do cabeçalho Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '12345');
    req.user = decoded; // Adiciona o payload do token (incluindo o user.id) ao req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};
