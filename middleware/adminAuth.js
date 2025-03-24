const adminAuthMiddleware = (req, res, next) => {
  // Já tem req.user vindo do authMiddleware
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  // Verificação de tenant redundante (opcional, se quiser garantir)
  if (req.tenant && req.user.tenantId !== req.tenant._id.toString()) {
    return res.status(403).json({ message: 'Access denied to this tenant (admin)' });
  }

  next();
};

module.exports = adminAuthMiddleware;