const express = require('express');
const router = express.Router();

const tenantsController = require('../controllers/tenantsController');
const authMiddleware = require('../middleware/auth');
const superAdminAuthMiddleware = require('../middleware/superAdminAuth');
const adminAuthMiddleware = require('../middleware/adminAuth');
const tenantMiddleware = require('../middleware/tenant');

console.log('✅ tenants.js carregado em: ' + new Date().toISOString());

// ROTA DE TESTE
router.get('/test', authMiddleware, adminAuthMiddleware, (req, res) => {
  console.log('GET /tenants/test chamado em: ' + new Date().toISOString());
  res.json({ message: 'Rota de teste funcionando', user: req.user });
});

// ROTA DO ADMIN COMUM - obter dados da pizzaria
router.get('/me', authMiddleware, adminAuthMiddleware, tenantMiddleware, async (req, res) => {
  try {
    console.log('GET /tenants/me chamado em: ' + new Date().toISOString());
    console.log('VERSÃO DEPLOYADA: tenants.js com adminAuthMiddleware');
    console.log('Middleware usado: adminAuthMiddleware');
    console.log('req.user:', req.user);
    console.log('req.tenant:', req.tenant);
    const tenant = req.tenant;
    if (!tenant) {
      console.log('Tenant não encontrado');
      return res.status(404).json({ message: 'Pizzaria não encontrada' });
    }
    if (req.user.tenantId !== tenant.tenantId) {
      console.log('TenantId mismatch:', { userTenantId: req.user.tenantId, tenantTenantId: tenant.tenantId });
      return res.status(403).json({ message: 'Você só pode acessar sua própria pizzaria' });
    }
    console.log('Tenant retornado com sucesso:', tenant);
    res.json(tenant);
  } catch (error) {
    console.error('Erro ao buscar pizzaria do admin:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// ROTAS DO SUPER ADMIN
router.get('/', authMiddleware, superAdminAuthMiddleware, tenantsController.getAllTenants);
router.get('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.getTenantById);
router.post('/', authMiddleware, superAdminAuthMiddleware, tenantsController.createTenant);
router.put('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.updateTenant);
router.delete('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.deleteTenant);

// ROTA DO ADMIN COMUM - atualizar pizzaria
router.put('/:tenantId/me', authMiddleware, adminAuthMiddleware, tenantMiddleware, async (req, res) => {
  try {
    console.log('PUT /:tenantId/me chamado em: ' + new Date().toISOString());
    console.log('Middleware usado: adminAuthMiddleware');
    console.log('req.user:', req.user);
    console.log('req.params:', req.params);
    const tenantId = req.params.tenantId;
    const updates = req.body;
    console.log('Tentando atualizar tenantId:', tenantId);
    if (req.user.tenantId !== tenantId) {
      console.log('Acesso negado: tenantId do usuário não corresponde', { userTenantId: req.user.tenantId, requestedTenantId: tenantId });
      return res.status(403).json({ message: 'Você só pode editar a sua própria pizzaria' });
    }
    const updatedTenant = await tenantsController.updateTenantDirect(tenantId, updates);
    if (!updatedTenant) {
      console.log('Tenant não encontrado para atualização');
      return res.status(404).json({ message: 'Pizzaria não encontrada' });
    }
    console.log('Tenant atualizado com sucesso:', updatedTenant);
    res.json(updatedTenant);
  } catch (error) {
    console.error('Erro ao atualizar pizzaria do admin:', error.message);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Log para todas as requisições
router.use((req, res, next) => {
  console.log('Rota requisitada no tenants.js:', req.method, req.path, 'em: ' + new Date().toISOString());
  next();
});

module.exports = router;
