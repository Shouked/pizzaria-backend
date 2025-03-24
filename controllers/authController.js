const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { tenantId } = req.params;

  if (!tenantId) {
    return res.status(400).json({ message: 'Tenant ID is required' });
  }

  try {
    // Busca o usuário pelo tenantId + email
    const user = await User.findOne({ email, tenantId });

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or tenant' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Payload do JWT
    const payload = {
      userId: user._id,
      tenantId: user.tenantId,
      isAdmin: user.isAdmin
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  const { tenantId } = req.params;

  if (!tenantId) {
    return res.status(400).json({ message: 'Tenant ID is required' });
  }

  try {
    // Verifica se já existe um usuário com o mesmo email no mesmo tenant
    const existingUser = await User.findOne({ email, tenantId });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists for this tenant' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      tenantId,
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user.userId,
      tenantId: req.tenant._id
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error while fetching user data' });
  }
};