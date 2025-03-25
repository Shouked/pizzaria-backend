const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Rota de login (por tenant)
router.post('/:tenantId/login', authController.login);

// Rota de registro (por tenant)
router.post('/:tenantId/register', authController.register);

// Rota para obter o perfil do usuário logado
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;