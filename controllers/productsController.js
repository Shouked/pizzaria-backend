const Product = require('../models/Product');

// GET: Listar todos os produtos de um tenant
exports.getAllProducts = async (req, res) => {
  try {
    console.log('💡 [getAllProducts] req.tenant:', req.tenant);

    if (!req.tenant) {
      console.log('❌ Nenhum tenant detectado!');
      return res.status(400).json({ message: 'Tenant not resolved' });
    }

    const tenantId = req.tenant.tenantId;
    console.log('🔍 Buscando produtos para tenantId:', tenantId);

    const products = await Product.find({ tenantId });

    console.log(`📦 Produtos encontrados: ${products.length}`);
    res.json(products);
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// GET: Pegar um produto específico do tenant
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      tenantId: req.tenant.tenantId
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};

// POST: Criar um novo produto (somente admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

    const newProduct = new Product({
      tenantId: req.tenant.tenantId,
      name,
      description,
      price,
      imageUrl,
      category
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// PUT: Atualizar um produto (somente admin)
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, imageUrl, category } = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, tenantId: req.tenant.tenantId },
      { name, description, price, imageUrl, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found or access denied' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// DELETE: Excluir um produto (somente admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.findOneAndDelete({
      _id: productId,
      tenantId: req.tenant.tenantId
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found or access denied' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};