const express = require("express");
const router = express.Router();

const productController = require("../controllers/ProductController");

router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductsDetail);


module.exports = router;