const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      tenantId: user.tenantId,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// POST: Registro
exports.register = async (req, res) => {
  try {
    const {
      tenantId, name, email, password, phone, address
    } = req.body;

    if (!tenantId || !name || !email || !password) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    const existing = await User.findOne({ email, tenantId });
    if (existing) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      tenantId,
      name,
      email,
      password: hashedPassword,
      phone,
      address
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser);

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
        tenantId: savedUser.tenantId
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
};

// POST: Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { tenantId } = req.params;

  try {
    const user = await User.findOne({ email, tenantId });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        tenantId: user.tenantId
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
};

// GET: Perfil do usuário logado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    res.status(500).json({ message: 'Erro ao carregar perfil' });
  }
};