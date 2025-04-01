const superAdminAuthMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isSuperAdmin) {
    return res.status(403).json({ message: 'Acesso restrito para super admin' });
  }
  next();
};

module.exports = superAdminAuthMiddleware;