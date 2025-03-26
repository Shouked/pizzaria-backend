const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// Função para login de superadmin
const superAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isSuperAdmin) {
      return res.status(400).json({ msg: 'Credenciais inválidas ou não é superadmin' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Função para login comum
const login = async (req, res) => {
  const { email, password } = req.body;
  const { tenantId } = req.params;
  try {
    const user = await User.findOne({ email, tenantId });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
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
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Função para registro
const register = async (req, res) => {
  const { name, email, password, tenantId } = req.body;
  try {
    let user = await User.findOne({ email, tenantId });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      tenantId
    });
    await user.save();
    res.json({ msg: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Função para obter dados do usuário autenticado
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Exportação explícita
module.exports = {
  superAdminLogin,
  login,
  register,
  getMe
};
