const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    console.log('Nenhum token fornecido');
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Ajusta para pegar o objeto user do payload
    console.log('Token decodificado:', req.user); // Log para depuração
    if (!req.user.isAdmin) {
      console.log('Usuário não é admin:', req.user);
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }
    console.log('Acesso permitido para admin:', req.user);
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    res.status(400).json({ message: 'Token inválido.' });
  }
};