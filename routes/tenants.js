const express = require('express');
const router = express.Router();

const tenantsController = require('../controllers/tenantsController');
const authMiddleware = require('../middleware/auth');
const superAdminAuthMiddleware = require('../middleware/superAdminAuth');
const adminAuthMiddleware = require('../middleware/adminAuth');
const tenantMiddleware = require('../middleware/tenant');

// Rotas restritas a superadmins
router.get('/', authMiddleware, superAdminAuthMiddleware, tenantsController.getAllTenants);
router.get('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.getTenantById);
router.post('/', authMiddleware, superAdminAuthMiddleware, tenantsController.createTenant);
router.put('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.updateTenant);
router.delete('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.deleteTenant);

// Rota para admins comuns: retorna o tenant do usuário logado
router.get('/me', authMiddleware, adminAuthMiddleware, tenantMiddleware, async (req, res) => {
  try {
    console.log('GET /tenants/me chamado');
    console.log('req.user:', req.user);
    console.log('req.tenant:', req.tenant);
    const tenant = req.tenant;
    if (!tenant) {
      console.log('Tenant não encontrado');
      return res.status(404).json({ message: 'Tenant not found for this user' });
    }
    if (req.user.tenantId !== tenant.tenantId) {
      console.log('TenantId do usuário não corresponde:', req.user.tenantId, tenant.tenantId);
      return res.status(403).json({ message: 'You can only access your own tenant' });
    }
    console.log('Retornando tenant:', tenant);
    res.json(tenant);
  } catch (error) {
    console.error('Erro ao buscar tenant do admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
