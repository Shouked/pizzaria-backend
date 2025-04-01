const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

console.log('✅ auth.js carregado em: ' + new Date().toISOString());

// Login do super admin
router.post('/superadmin/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.isSuperAdmin) {
    return res.status(400).json({ message: 'Usuário não é super admin' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Senha incorreta' });
  }

  const token = jwt.sign({
    userId: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin,
  }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    }
  });
});

// Login comum por tenant
router.post('/:tenantId/login', tenantMiddleware, async (req, res) => {
  const { email, password } = req.body;
  const { tenantId } = req.params;

  const user = await User.findOne({ email, tenantId });

  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Senha incorreta' });
  }

  const token = jwt.sign({
    userId: user._id,
    tenantId: user.tenantId,
    email: user.email,
    isAdmin: user.isAdmin
  }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      tenantId: user.tenantId,
      isAdmin: user.isAdmin
    }
  });
});

// Registro por tenant
router.post('/:tenantId/register', tenantMiddleware, async (req, res) => {
  const { name, email, password } = req.body;
  const { tenantId } = req.params;

  const existingUser = await User.findOne({ email, tenantId });
  if (existingUser) {
    return res.status(400).json({ message: 'Usuário já existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ name, email, password: hashedPassword, tenantId });
  await newUser.save();

  res.status(201).json({ message: 'Usuário registrado com sucesso' });
});

// Obter perfil autenticado
router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  res.json(user);
});

module.exports = router;