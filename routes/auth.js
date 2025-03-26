const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// Rota para superadmins (sem tenantMiddleware, definida primeiro)
router.post('/superadmin/login', authController.superAdminLogin);

// Rotas que usam tenantMiddleware
router.post('/:tenantId/login', tenantMiddleware, authController.login);
router.post('/:tenantId/register', tenantMiddleware, authController.register);

// Rota protegida por authMiddleware
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
