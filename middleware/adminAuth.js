const adminAuthMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso restrito para administradores' });
  }
  next();
};

module.exports = adminAuthMiddleware;