const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  try {
    const tenantIdFromUrl = req.params.tenantId;
    const tenantIdFromHeader = req.headers['x-tenant-id'];
    const tenantIdFromToken = req.user?.tenantId;

    const tenantId = tenantIdFromUrl || tenantIdFromHeader || tenantIdFromToken;

    console.log('--- Tenant Middleware Debug ---');
    console.log('tenantIdFromUrl:', tenantIdFromUrl);
    console.log('tenantId:', tenantId);

    if (!tenantId) {
      console.log('Nenhum tenantId encontrado!');
      return res.status(400).json({ message: 'Tenant ID is required' });
    }

    const tenant = await Tenant.findOne({ tenantId });

    console.log('Tenant encontrado:', tenant);

    if (!tenant) {
      console.log('Tenant não encontrado no banco.');
      return res.status(404).json({ message: 'Tenant not found' });
    }

    req.tenant = tenant;
    next();

  } catch (error) {
    console.error('Erro no tenantMiddleware:', error);
    res.status(500).json({ message: 'Server error in tenant middleware' });
  }
};

module.exports = tenantMiddleware;