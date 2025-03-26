const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// Rota para superadmins (linha 7)
router.post('/superadmin/login', authController.superAdminLogin);

// Rotas que usam tenantMiddleware (linha 11)
router.post('/:tenantId/login', tenantMiddleware, authController.login);
router.post('/:tenantId/register', tenantMiddleware, authController.register);

// Rota protegida
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
