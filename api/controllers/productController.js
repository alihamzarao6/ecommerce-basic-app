const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, quantity, images } = req.body;

    const product = await Product.create({
      name,
      price,
      quantity,
      images,
      user: req.user.id,
    });
    
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, images } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product.images = images;

    await product.save();

    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};
