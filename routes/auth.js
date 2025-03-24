const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de login
router.post('/:tenantId/login', authController.login);

// Rota de registro
router.post('/:tenantId/register', authController.register);

// Rota para pegar o usuário autenticado (quem está logado) - opcional
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

router.get('/:tenantId/me', tenantMiddleware, authMiddleware, authController.getMe);

module.exports = router;