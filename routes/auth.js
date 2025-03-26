const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// 🔐 Login do superadmin (não precisa de tenantId)
router.post('/superadmin/login', authController.superAdminLogin);

// 🔐 Login do cliente (requer tenantId na URL)
router.post('/:tenantId/login', tenantMiddleware, authController.login);

// 📝 Cadastro de cliente (requer tenantId na URL e no body)
router.post('/:tenantId/register', tenantMiddleware, authController.register);

// 👤 Obter dados do usuário logado
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
