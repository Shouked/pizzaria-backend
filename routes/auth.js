const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// Rota de login - usando tenantId como parte da URL
router.post('/:tenantId/login', tenantMiddleware, authController.login);

// Rota de cadastro - usando body com tenantId
router.post('/register', tenantMiddleware, authController.register);

// Rota para pegar os dados do usuário logado
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;