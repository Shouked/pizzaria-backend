const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// LOGIN SUPER ADMIN (sem tenantId)
router.post('/superadmin/login', authController.superAdminLogin);

// LOGIN de admin comum ou cliente com tenantId na URL
router.post('/:tenantId/login', authController.login);

// REGISTRO de cliente com tenantId na URL
router.post('/:tenantId/register', authController.register);

// DADOS DO USUÁRIO LOGADO (admin, super admin ou cliente)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;