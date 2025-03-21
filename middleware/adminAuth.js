const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acesso negado.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};
