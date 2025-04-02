const express = require('express'); const router = express.Router();

const tenantsController = require('../controllers/tenantsController'); const authMiddleware = require('../middleware/auth'); const superAdminAuthMiddleware = require('../middleware/superAdminAuth'); const adminAuthMiddleware = require('../middleware/adminAuth'); const tenantMiddleware = require('../middleware/tenant');

// Log para debug 
console.log('✅ tenants.js carregado');

// Rota para admins comuns obterem os dados da própria pizzaria

router.get('/me', authMiddleware, adminAuthMiddleware, tenantMiddleware, async (req, res) => { try { const tenant = req.tenant;

if (!tenant) {
  return res.status(404).json({ message: 'Pizzaria não encontrada' });
}

if (req.user.tenantId !== tenant.tenantId) {
  return res.status(403).json({ message: 'Você só pode acessar sua própria pizzaria' });
}

res.json(tenant);

} catch (error) { console.error('Erro ao buscar pizzaria do admin:', error); res.status(500).json({ message: 'Erro interno no servidor' }); } });

// Rotas do super admin
router.get('/', authMiddleware, superAdminAuthMiddleware, tenantsController.getAllTenants); router.get('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.getTenantById); router.post('/', authMiddleware, superAdminAuthMiddleware, tenantsController.createTenant); router.put('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.updateTenant); router.delete('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.deleteTenant);

// Rota para admin comum atualizar sua própria pizzaria 
router.put('/:tenantId/me', authMiddleware, adminAuthMiddleware, tenantMiddleware, async (req, res) => { try { const tenantId = req.params.tenantId; const updates = req.body;

if (req.user.tenantId !== tenantId) {
  return res.status(403).json({ message: 'Você só pode editar a sua própria pizzaria' });
}

const updatedTenant = await tenantsController.updateTenantDirect(tenantId, updates);
if (!updatedTenant) {
  return res.status(404).json({ message: 'Pizzaria não encontrada' });
}

res.json(updatedTenant);

} catch (error) { console.error('Erro ao atualizar pizzaria do admin:', error.message); res.status(500).json({ message: 'Erro interno no servidor' }); } });

module.exports = router;

