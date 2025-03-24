const Product = require('../models/Product');

// GET: Listar todos os produtos de um tenant
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ tenantId: req.tenant._id });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// GET: Pegar um produto específico do tenant
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.productId, 
      tenantId: req.tenant._id 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};

// POST: Criar um novo produto (somente admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;

    // Cria o novo produto com o tenantId atual
    const newProduct = new Product({
      tenantId: req.tenant._id,
      name,
      description,
      price,
      imageUrl
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// PUT: Atualizar um produto (somente admin)
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, imageUrl } = req.body;

    // Atualiza somente se for do mesmo tenant
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, tenantId: req.tenant._id },
      { name, description, price, imageUrl },
      { new: true } // Retorna o documento atualizado
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found or access denied' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// DELETE: Excluir um produto (somente admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.findOneAndDelete({
      _id: productId,
      tenantId: req.tenant._id
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found or access denied' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};