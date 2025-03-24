const express = require('express');
const router = express.Router();

const tenantsController = require('../controllers/tenantsController');
const authMiddleware = require('../middleware/auth');
const superAdminAuthMiddleware = require('../middleware/superAdminAuth');

// ✅ Apenas usuários autenticados E superAdmins podem acessar essas rotas

// Listar todos os tenants (apenas superAdmins)
router.get('/', authMiddleware, superAdminAuthMiddleware, tenantsController.getAllTenants);

// Pegar um tenant específico (apenas superAdmins)
router.get('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.getTenantById);

// Criar um tenant (apenas superAdmins)
router.post('/', authMiddleware, superAdminAuthMiddleware, tenantsController.createTenant);

// Atualizar tenant (apenas superAdmins)
router.put('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.updateTenant);

// Excluir tenant (apenas superAdmins)
router.delete('/:tenantId', authMiddleware, superAdminAuthMiddleware, tenantsController.deleteTenant);

module.exports = router;