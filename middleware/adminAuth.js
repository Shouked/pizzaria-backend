const adminAuthMiddleware = (req, res, next) => {
  console.log('adminAuthMiddleware chamado para:', req.path);
  console.log('req.user:', req.user);
  if (!req.user || !req.user.isAdmin) {
    console.log('Acesso negado: não é admin');
    return res.status(403).json({ message: 'Admin access required' });
  }
  console.log('Admin autorizado');
  next();
};

module.exports = adminAuthMiddleware;
