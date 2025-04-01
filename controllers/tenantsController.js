const Tenant = require('../models/Tenant');

exports.getAllTenants = async (req, res) => { try { const tenants = await Tenant.find(); res.json(tenants); } catch (error) { res.status(500).json({ message: 'Erro ao buscar pizzarias' }); } };

exports.getTenantById = async (req, res) => { try { const tenant = await Tenant.findOne({ tenantId: req.params.tenantId }); if (!tenant) { return res.status(404).json({ message: 'Pizzaria não encontrada' }); } res.json(tenant); } catch (error) { res.status(500).json({ message: 'Erro ao buscar pizzaria' }); } };

exports.createTenant = async (req, res) => { try { const { tenantId, name, logoUrl, phone, address } = req.body; const existingTenant = await Tenant.findOne({ tenantId }); if (existingTenant) { return res.status(400).json({ message: 'Pizzaria já cadastrada' }); } const tenant = new Tenant({ tenantId, name, logoUrl, phone, address }); await tenant.save(); res.status(201).json(tenant); } catch (error) { res.status(500).json({ message: 'Erro ao criar pizzaria' }); } };

exports.updateTenant = async (req, res) => { try { const updated = await Tenant.findOneAndUpdate( { tenantId: req.params.tenantId }, req.body, { new: true } ); if (!updated) { return res.status(404).json({ message: 'Pizzaria não encontrada' }); } res.json(updated); } catch (error) { res.status(500).json({ message: 'Erro ao atualizar pizzaria' }); } };

exports.deleteTenant = async (req, res) => { try { const deleted = await Tenant.findOneAndDelete({ tenantId: req.params.tenantId }); if (!deleted) { return res.status(404).json({ message: 'Pizzaria não encontrada' }); } res.json({ message: 'Pizzaria removida com sucesso' }); } catch (error) { res.status(500).json({ message: 'Erro ao deletar pizzaria' }); } };

exports.updateTenantDirect = async (tenantId, updates) => { try { const updatedTenant = await Tenant.findOneAndUpdate( { tenantId }, updates, { new: true } ); return updatedTenant; } catch (error) { console.error('Erro em updateTenantDirect:', error.message); return null; } };

