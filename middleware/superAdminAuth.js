const superAdminAuthMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isSuperAdmin) {
    return res.status(403).json({ message: 'Super admin access required' });
  }
  next();
};

module.exports = superAdminAuthMiddleware;