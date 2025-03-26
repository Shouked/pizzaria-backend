const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// Rotas existentes
router.post('/:tenantId/login', tenantMiddleware, authController.login);
router.post('/:tenantId/register', tenantMiddleware, authController.register);
router.get('/me', authMiddleware, authController.getMe);

// Nova rota para superadmins
router.post('/superadmin/login', authController.superAdminLogin);

module.exports = router;
