const Tenant = require('../models/Tenant');

// GET: Listar todos os tenants (para administração)
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ message: 'Server error while fetching tenants' });
  }
};

// GET: Buscar um tenant específico por ID
exports.getTenantById = async (req, res) => {
  const { tenantId } = req.params;

  try {
    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ message: 'Server error while fetching tenant' });
  }
};

// POST: Criar um novo tenant
exports.createTenant = async (req, res) => {
  const { name, logoUrl, primaryColor, secondaryColor } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const tenant = new Tenant({
      name,
      logoUrl,
      primaryColor,
      secondaryColor
    });

    const savedTenant = await tenant.save();
    res.status(201).json(savedTenant);
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ message: 'Server error while creating tenant' });
  }
};

// PUT: Atualizar um tenant existente
exports.updateTenant = async (req, res) => {
  const { tenantId } = req.params;
  const { name, logoUrl, primaryColor, secondaryColor } = req.body;

  try {
    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { name, logoUrl, primaryColor, secondaryColor },
      { new: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(updatedTenant);
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ message: 'Server error while updating tenant' });
  }
};

// DELETE: Excluir um tenant
exports.deleteTenant = async (req, res) => {
  const { tenantId } = req.params;

  try {
    const deletedTenant = await Tenant.findByIdAndDelete(tenantId);

    if (!deletedTenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ message: 'Server error while deleting tenant' });
  }
};