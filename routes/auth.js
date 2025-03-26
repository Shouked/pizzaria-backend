const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// Login com tenantId na URL
router.post('/:tenantId/login', tenantMiddleware, authController.login);

// Registro com tenantId na URL
router.post('/:tenantId/register', tenantMiddleware, authController.register);

// Obter perfil autenticado
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;