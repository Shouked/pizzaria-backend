const Tenant = require('../models/Tenant'); // Adicionei a importação que faltava no trecho enviado

const tenantMiddleware = async (req, res, next) => {
  try {
    const tenantIdFromUrl = req.params.tenantId;
    const tenantId = tenantIdFromUrl || req.headers['x-tenant-id'] || req.user?.tenantId;

    console.log('--- Tenant Middleware Debug ---');
    console.log('tenantIdFromUrl:', tenantIdFromUrl);
    console.log('tenantId:', tenantId);

    if (!tenantId) {
      console.log('❌ Nenhum tenantId fornecido');
      return res.status(400).json({ message: 'Tenant ID is required' });
    }

    console.log('Buscando tenant no banco para tenantId:', tenantId);
    const tenant = await Tenant.findOne({ tenantId });
    console.log('Resultado da busca:', tenant || 'Nenhum tenant encontrado');

    if (!tenant) {
      console.log('❌ Tenant não encontrado no banco');
      return res.status(404).json({ message: 'Tenant not found' });
    }

    console.log('✅ Tenant encontrado:', tenant);
    req.tenant = tenant.toObject();
    next();
  } catch (error) {
    console.error('❌ Erro no tenantMiddleware:', error.message);
    res.status(500).json({ message: 'Server error in tenant middleware' });
  }
};

module.exports = tenantMiddleware; // Adicionado
