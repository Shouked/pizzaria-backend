// routes/tenants.js
const express = require('express');
const router = express.Router();

const tenantsController = require('../controllers/tenantsController');
const authMiddleware = require('../middleware/auth');
const superAdminAuthMiddleware = require('../middleware/superAdminAuth');
const adminAuthMiddleware = require('../middleware/adminAuth');
const tenantMiddleware = require('../middleware/tenant');
const Tenant = require('../models/Tenant');

// Rotas para super admins
router.get('/', authMiddleware, superAdminAuthMiddleware, tenantsController.getAllTenants);
router.get('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.getTenantById);
router.post('/', authMiddleware, superAdminAuthMiddleware, tenantsController.createTenant);
router.put('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.updateTenant);
router.delete('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.deleteTenant);

// Rota para admins comuns: retorna o tenant do usuário logado
router.get('/me', authMiddleware, adminAuthMiddleware, tenantMiddleware, async (req, res) => {
  try {
    const tenant = req.tenant;
    if (!tenant) return res.status(404).json({ message: 'Tenant not found for this user' });
    if (req.user.tenantId !== tenant.tenantId) return res.status(403).json({ message: 'You can only access your own tenant' });
    res.json(tenant);
  } catch (error) {
    console.error('Erro ao buscar tenant do admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /tenants/:tenantId/me - Atualizar pizzaria pelo admin da própria unidade
router.put('/:tenantId/me', authMiddleware, adminAuthMiddleware, tenantMiddleware, async (req, res) => {
  try {
    if (req.user.tenantId !== req.tenant.tenantId) {
      return res.status(403).json({ message: 'Você só pode editar sua própria pizzaria.' });
    }

    const updates = req.body;
    const updatedTenant = await Tenant.findOneAndUpdate(
      { tenantId: req.user.tenantId },
      updates,
      { new: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ message: 'Pizzaria não encontrada.' });
    }

    res.json(updatedTenant);
  } catch (error) {
    console.error('Erro ao atualizar tenant do admin:', error.message);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
