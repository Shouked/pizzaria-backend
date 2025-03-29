const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  console.log('--- Tenant Middleware Debug ---');
  console.log('req.path:', req.path);
  console.log('req.params:', req.params);
  console.log('req.user:', req.user);
  let tenantId;

  if (req.path === '/me') {
    if (req.user && req.user.tenantId) {
      tenantId = req.user.tenantId;
      console.log('tenantIdFromUser (priorizado para /me):', tenantId);
    } else {
      console.log('Nenhum tenantId encontrado em req.user para /me');
      return res.status(400).json({ message: 'Tenant ID não fornecido' });
    }
  } else if (req.params.tenantId) {
    tenantId = req.params.tenantId;
    console.log('tenantIdFromUrl:', tenantId);
  } else if (req.user && req.user.tenantId) {
    tenantId = req.user.tenantId;
    console.log('tenantIdFromUser:', tenantId);
  } else {
    console.log('Nenhum tenantId encontrado');
    return res.status(400).json({ message: 'Tenant ID não fornecido' });
  }

  console.log('tenantId final usado:', tenantId);

  try {
    console.log('Buscando tenant no banco para tenantId:', tenantId);
    const tenant = await Tenant.findOne({ tenantId });
    console.log('Resultado da busca:', tenant);

    if (!tenant) {
      console.log('Tenant não encontrado no banco para tenantId:', tenantId);
      return res.status(404).json({ message: 'Tenant não encontrado' });
    }

    console.log('✅ Tenant encontrado:', tenant);
    req.tenant = tenant;
    console.log('Antes de chamar next() no tenantMiddleware');
    next();
    console.log('Depois de chamar next() no tenantMiddleware');
  } catch (error) {
    console.error('Erro ao buscar tenant:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = tenantMiddleware;
