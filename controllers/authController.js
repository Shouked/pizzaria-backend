const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// Criar conta
exports.register = async (req, res) => {
  const { name, email, phone, address, password, tenantId } = req.body;

  try {
    // Verifica se o tenant existe
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) {
      return res.status(400).json({ msg: 'TenantId inválido' });
    }

    // Verifica se o usuário já existe
    let user = await User.findOne({ email, tenantId });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe para este tenant' });
    }

    // Cria novo usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      tenantId
    });

    await user.save();

    // Cria token
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
    res.status(500).send('Erro no servidor');
  }
};

// Login
exports.login = async (req, res) => {
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
    console.error('Erro no login:', err.message);
    res.status(500).send('Erro no servidor');
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
    res.status(500).send('Erro no servidor');
  }
};