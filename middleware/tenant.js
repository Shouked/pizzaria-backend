const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  console.log('--- Tenant Middleware Debug ---');
  console.log('req.path:', req.path);
  console.log('req.method:', req.method);
  console.log('req.params:', req.params);
  console.log('req.user:', req.user);

  // Se o usuário for super admin, ignora validação
  if (req.user?.isSuperAdmin) {
    console.log('Usuário é super admin. Ignorando tenantMiddleware.');
    return next();
  }

  let tenantId;

  if (req.path === '/me') {
    tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID não fornecido (me)' });
    }
  } else if (req.params.tenantId) {
    tenantId = req.params.tenantId;
  } else if (req.user?.tenantId) {
    tenantId = req.user.tenantId;
  } else {
    return res.status(400).json({ message: 'Tenant ID não fornecido' });
  }

  try {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant não encontrado' });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    console.error('Erro ao buscar tenant:', error.message);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = tenantMiddleware;