const express = require("express");
const router = express.Router();
const ProductsController = require("../controllers/products.controller");

router.post("/products", ProductsController.setProducts);
router.get("/products", ProductsController.getProducts);

module.exports = router;
