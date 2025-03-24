const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET: Listar usuários do tenant (apenas admin)
exports.getUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.find({ tenantId: req.tenant._id }).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// GET: Buscar o próprio perfil
exports.getMyProfile = async (req, res) => {
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
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// PUT: Atualizar usuário (admin atualiza outros usuários, user atualiza o próprio)
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Apenas admin pode atualizar outros usuários
    if (!req.user.isAdmin && req.user.userId !== userId) {
      return res.status(403).json({ message: 'Access denied to update user' });
    }

    const { name, email, password, isAdmin } = req.body;

    const updateFields = {
      name,
      email
    };

    // Atualiza senha se enviada
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Só admin pode alterar isAdmin
    if (req.user.isAdmin && typeof isAdmin !== 'undefined') {
      updateFields.isAdmin = isAdmin;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, tenantId: req.tenant._id },
      updateFields,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found or access denied' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

// DELETE: Excluir usuário (apenas admin)
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { userId } = req.params;

    const deletedUser = await User.findOneAndDelete({
      _id: userId,
      tenantId: req.tenant._id
    });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found or access denied' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};