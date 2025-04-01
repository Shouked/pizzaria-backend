const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET: Listar usuários do tenant (apenas admin)
exports.getUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Apenas administradores podem listar usuários' });
    }

    const users = await User.find({ tenantId: req.tenant.tenantId }).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar usuários' });
  }
};

// GET: Buscar o próprio perfil
exports.getMyProfile = async (req, res) => {
  try {
    const query = { _id: req.user.userId };

    // Se não for super admin, incluir tenantId no filtro
    if (!req.user.isSuperAdmin) {
      query.tenantId = req.tenant.tenantId;
    }

    const user = await User.findOne(query).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar perfil' });
  }
};

// PUT: Atualizar usuário (admin atualiza outros, user atualiza o próprio)
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.user.isAdmin && req.user.userId !== userId) {
      return res.status(403).json({ message: 'Você só pode atualizar sua própria conta' });
    }

    const { name, email, password, isAdmin } = req.body;

    const updateFields = {
      name,
      email
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    if (req.user.isAdmin && typeof isAdmin !== 'undefined') {
      updateFields.isAdmin = isAdmin;
    }

    const query = { _id: userId };
    if (!req.user.isSuperAdmin) {
      query.tenantId = req.tenant.tenantId;
    }

    const updatedUser = await User.findOneAndUpdate(query, updateFields, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado ou acesso negado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor ao atualizar usuário' });
  }
};

// DELETE: Excluir usuário (apenas admin)
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Apenas administradores podem excluir usuários' });
    }

    const { userId } = req.params;
    const query = { _id: userId };

    if (!req.user.isSuperAdmin) {
      query.tenantId = req.tenant.tenantId;
    }

    const deletedUser = await User.findOneAndDelete(query);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado ou acesso negado' });
    }

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ message: 'Erro no servidor ao excluir usuário' });
  }
};