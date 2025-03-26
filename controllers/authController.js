const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// Função para login de superadmin
const superAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log('Iniciando superadmin login para:', { email });

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
    console.error('Erro no superadmin login:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Função para login comum
const login = async (req, res) => {
  const { email, password } = req.body;
  const { tenantId } = req.params;

  console.log('Iniciando login para:', { email, tenantId });

  try {
    console.log('Buscando usuário no banco...');
    const user = await User.findOne({ email, tenantId });
    console.log('Usuário encontrado:', user || 'Nenhum usuário encontrado');

    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    console.log('Comparando senha...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Senha válida:', isMatch);

    if (!isMatch) {
      console.log('Senha inválida');
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const payload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      isAdmin: user.isAdmin
    };

    console.log('Gerando token...');
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token gerado com sucesso');

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

// Função para registro (exemplo básico, ajuste conforme seu código original)
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
    console.error('Erro no registro:', err.message);
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
    console.error('Erro no getMe:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Exportação explícita como objeto
module.exports = {
  superAdminLogin,
  login,
  register,
  getMe
};
