const express = require('express');
const router = express.Router();
const tenantMiddleware = require('../middleware/tenant');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');
const usersController = require('../controllers/usersController');

// Listar todos os usuários do tenant (admin)
router.get('/:tenantId/users', tenantMiddleware, authMiddleware, adminAuthMiddleware, usersController.getUsers);

// Ver o próprio perfil (autenticado)
router.get('/:tenantId/profile', tenantMiddleware, authMiddleware, usersController.getMyProfile);

// Atualizar um usuário (admin ou o próprio usuário)
router.put('/:tenantId/users/:userId', tenantMiddleware, authMiddleware, usersController.updateUser);

// Excluir um usuário (apenas admin)
router.delete('/:tenantId/users/:userId', tenantMiddleware, authMiddleware, adminAuthMiddleware, usersController.deleteUser);

module.exports = router;