const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  console.log('--- [Tenant Middleware] ---');
  console.log('req.method:', req.method);
  console.log('req.path:', req.path);
  console.log('req.params:', req.params);
  console.log('req.user:', req.user);

  // Se for super admin, ignora este middleware
  if (req.user?.isSuperAdmin) {
    console.log('Usuário é super admin, ignorando validação de tenant');
    return next();
  }

  let tenantId = null;

  // Para rota /me, prioriza o tenantId vindo do token
  if (req.path === '/me' && req.user?.tenantId) {
    tenantId = req.user.tenantId;
  }
  // Para outras rotas, tenta pegar da URL
  else if (req.params?.tenantId) {
    tenantId = req.params.tenantId;
  }
  // Ou pega do usuário logado (se estiver presente)
  else if (req.user?.tenantId) {
    tenantId = req.user.tenantId;
  }

  if (!tenantId) {
    console.log('Tenant ID não fornecido');
    return res.status(400).json({ message: 'Tenant ID não fornecido' });
  }

  try {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) {
      console.log('Tenant não encontrado no banco:', tenantId);
      return res.status(404).json({ message: 'Tenant não encontrado' });
    }

    req.tenant = tenant;
    console.log('✅ Tenant encontrado:', tenant.tenantId);
    next();
  } catch (error) {
    console.error('Erro ao buscar tenant:', error);
    res.status(500).json({ message: 'Erro interno ao buscar tenant' });
  }
};

module.exports = tenantMiddleware;