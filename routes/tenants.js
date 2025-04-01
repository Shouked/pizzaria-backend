// routes/tenants.js const express = require('express'); const router = express.Router();

const tenantsController = require('../controllers/tenantsController'); const authMiddleware = require('../middleware/auth'); const superAdminAuthMiddleware = require('../middleware/superAdminAuth'); const adminAuthMiddleware = require('../middleware/adminAuth'); const tenantMiddleware = require('../middleware/tenant');

// ROTA DO SUPER ADMIN - LISTAR TODAS AS PIZZARIAS router.get('/', authMiddleware, superAdminAuthMiddleware, tenantsController.getAllTenants);

// ROTA DO SUPER ADMIN - CONSULTAR UMA PIZZARIA ESPECÍFICA router.get('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.getTenantById);

// ROTA DO SUPER ADMIN - CRIAR NOVA PIZZARIA router.post('/', authMiddleware, superAdminAuthMiddleware, tenantsController.createTenant);

// ROTA DO SUPER ADMIN - ATUALIZAR PIZZARIA router.put('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.updateTenant);

// ROTA DO SUPER ADMIN - DELETAR PIZZARIA router.delete('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.deleteTenant);

// ROTA DO ADMIN - OBTER SUA PRÓPRIA PIZZARIA router.get('/me', authMiddleware, adminAuthMiddleware, tenantMiddleware, async (req, res) => { try { const tenant = req.tenant; if (!tenant) return res.status(404).json({ message: 'Pizzaria não encontrada' }); if (req.user.tenantId !== tenant.tenantId) { return res.status(403).json({ message: 'Você só pode acessar sua própria pizzaria' }); } res.json(tenant); } catch (err) { console.error('Erro ao buscar pizzaria:', err); res.status(500).json({ message: 'Erro interno no servidor' }); } });

// ROTA DO ADMIN - ATUALIZAR SUA PRÓPRIA PIZZARIA router.put('/:tenantId/me', authMiddleware, adminAuthMiddleware, tenantMiddleware, async (req, res) => { try { const tenantId = req.params.tenantId; if (req.user.tenantId !== tenantId) { return res.status(403).json({ message: 'Você só pode editar sua própria pizzaria' }); }

const updatedTenant = await tenantsController.updateTenantDirect(tenantId, req.body);
if (!updatedTenant) {
  return res.status(404).json({ message: 'Pizzaria não encontrada' });
}
res.json(updatedTenant);

} catch (error) { console.error('Erro ao atualizar pizzaria:', error); res.status(500).json({ message: 'Erro interno no servidor' }); } });

module.exports = router;

