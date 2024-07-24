const express = require("express");
const {
  createProduct,
  getProducts,
} = require("../controllers/productController");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", createProduct);
router.get("/", getProducts);

module.exports = router;
