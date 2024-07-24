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
