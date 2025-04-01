const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// Login de superadmin (sem tenantId)
router.post('/superadmin/login', authController.superAdminLogin);

// Login normal (admin comum)
router.post('/:tenantId/login', tenantMiddleware, authController.login);

// Registro de admin comum
router.post('/:tenantId/register', tenantMiddleware, authController.register);

// Obter perfil do usuário autenticado
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;