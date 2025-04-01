const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  let tenantId;

  if (req.path === '/me') {
    tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID não fornecido' });
    }
  } else {
    tenantId = req.params.tenantId || req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID não fornecido' });
    }
  }

  try {
    const tenant = await Tenant.findOne({ tenantId });

    if (!tenant) {
      return res.status(404).json({ message: 'Pizzaria não encontrada' });
    }

    req.tenant = tenant;
    next();
  } catch (err) {
    console.error('Erro ao buscar tenant:', err.message);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = tenantMiddleware;