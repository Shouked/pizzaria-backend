// src/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// Criar conta
exports.register = async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  const { tenantId } = req.params;

  try {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) return res.status(400).json({ msg: 'TenantId inválido' });

    const userExists = await User.findOne({ email, tenantId });
    if (userExists) return res.status(400).json({ msg: 'Usuário já existe neste tenant' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      tenantId
    });

    await user.save();

    const payload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      isAdmin: user.isAdmin
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tenantId: user.tenantId,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error('Erro no registro:', err.message);
    res.status(500).json({ msg: 'Erro no servidor ao registrar usuário' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { tenantId } = req.params;

  try {
    const user = await User.findOne({ email, tenantId });
    if (!user) return res.status(400).json({ msg: 'Credenciais inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciais inválidas' });

    const payload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      isAdmin: user.isAdmin
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tenantId: user.tenantId,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ msg: 'Erro no servidor ao fazer login' });
  }
};

// Obter perfil do usuário logado
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err.message);
    res.status(500).json({ msg: 'Erro no servidor ao buscar perfil' });
  }
};