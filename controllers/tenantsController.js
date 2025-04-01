const Tenant = require('../models/Tenant');

// Buscar todas as pizzarias (super admin)
const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
    console.error('Erro ao buscar pizzarias:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Buscar uma pizzaria por ID (super admin)
const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ tenantId: req.params.tenantId });
    if (!tenant) return res.status(404).json({ message: 'Pizzaria não encontrada' });
    res.json(tenant);
  } catch (error) {
    console.error('Erro ao buscar pizzaria:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Criar nova pizzaria (super admin)
const createTenant = async (req, res) => {
  try {
    const existing = await Tenant.findOne({ tenantId: req.body.tenantId });
    if (existing) return res.status(400).json({ message: 'Este ID já está em uso' });

    const newTenant = new Tenant(req.body);
    await newTenant.save();
    res.status(201).json(newTenant);
  } catch (error) {
    console.error('Erro ao criar pizzaria:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Atualizar pizzaria (super admin)
const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { tenantId: req.params.tenantId },
      req.body,
      { new: true }
    );
    if (!tenant) return res.status(404).json({ message: 'Pizzaria não encontrada' });
    res.json(tenant);
  } catch (error) {
    console.error('Erro ao atualizar pizzaria:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Deletar pizzaria (super admin)
const deleteTenant = async (req, res) => {
  try {
    const deleted = await Tenant.findOneAndDelete({ tenantId: req.params.tenantId });
    if (!deleted) return res.status(404).json({ message: 'Pizzaria não encontrada' });
    res.json({ message: 'Pizzaria excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pizzaria:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Atualização direta (usada pelo admin comum)
const updateTenantDirect = async (tenantId, updates) => {
  return await Tenant.findOneAndUpdate({ tenantId }, updates, { new: true });
};

// Buscar dados da própria pizzaria (admin comum)
const getMyTenant = async (req, res) => {
  try {
    const tenant = req.tenant;
    if (!tenant) {
      return res.status(404).json({ message: 'Pizzaria não encontrada' });
    }
    res.json(tenant);
  } catch (error) {
    console.error('Erro ao buscar pizzaria do admin:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  updateTenantDirect,
  getMyTenant
};