const superAdminAuthMiddleware = (req, res, next) => {
  console.log('superAdminAuthMiddleware chamado para:', req.path, 'em: ' + new Date().toISOString());
  console.log('Pilha de chamada:', new Error().stack.split('\n').slice(1, 4).join('\n'));
  console.log('req.user:', req.user);
  if (!req.user || !req.user.isSuperAdmin) {
    console.log('Acesso negado: não é super admin');
    return res.status(403).json({ message: 'Super admin access required' });
  }
  console.log('Super admin autorizado');
  next();
};
module.exports = superAdminAuthMiddleware;
