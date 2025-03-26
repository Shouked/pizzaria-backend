const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// Rota de login - tenantId via URL
router.post('/:tenantId/login', tenantMiddleware, authController.login);

// Rota de cadastro - tenantId via URL (corrigido)
router.post('/:tenantId/register', tenantMiddleware, authController.register);

// Rota para pegar dados do usuário logado
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;