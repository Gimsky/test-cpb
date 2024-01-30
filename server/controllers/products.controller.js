const Products = require("../models/products.model");

const isValidProduct = (product) => {
  if (!product || typeof product !== "object") {
    return false;
  }

  const { bodyHtml, imageSrc } = product;

  const bodyHtmlIsValid =
    typeof bodyHtml === "string" || bodyHtml === undefined;
  const imageSrcIsValid =
    typeof imageSrc === "string" || imageSrc === undefined;

  return bodyHtmlIsValid && imageSrcIsValid;
};

const ProductsController = {
  setProducts: async (products) => {
    try {
      if (products.every(isValidProduct)) {
        await Products.bulkCreate(products);
        // console.log("Products have been saved to the database.");
      } else {
        console.error("Invalid products data.");
      }
    } catch (error) {
      console.error("Error in setProducts: ", error);
      throw error;
    }
  },
  getProducts: async (req, res) => {
    try {
      const products = await Products.findAll();
      // console.log("Products have been fetched from the database.");
      if (!products) {
        console.log("No products found in the database.");
        return;
      }
      res.send(products);
    } catch (error) {
      console.error("Error in getProducts: ", error);
      throw error;
    }
  },
};

module.exports = ProductsController;
