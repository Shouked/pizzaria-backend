const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  try {
    // Prioridade 1: URL param (exemplo: /:tenantId/rota)
    const tenantIdFromUrl = req.params.tenantId;

    // Prioridade 2: Header (opcional, útil para APIs)
    const tenantIdFromHeader = req.headers['x-tenant-id'];

    // Prioridade 3: JWT (opcional, se preferir trabalhar por token)
    const tenantIdFromToken = req.user?.tenantId; // Se usar JWT com tenantId embutido

    // Decide de onde veio o tenantId
    const tenantId = tenantIdFromUrl || tenantIdFromHeader || tenantIdFromToken;

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }

    // Busca o tenant no banco de dados
    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Disponibiliza o tenant para os próximos middlewares/controllers
    req.tenant = tenant;

    next();
  } catch (error) {
    console.error('Error in tenantMiddleware:', error);
    res.status(500).json({ message: 'Server error in tenant middleware' });
  }
};

module.exports = tenantMiddleware;