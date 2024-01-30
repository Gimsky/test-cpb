require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

const db = require("./config/db");
const productsRoutes = require("./routes/products.route");
const ProductsController = require("./controllers/products.controller");
const port = 8080;
const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
const shopifyHost = process.env.SHOPIFY_HOST;

app.use(cors());

db.authenticate()
  .then(() => {
    app.use("/api", productsRoutes);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const graphqlQuery = `
  {
    shop {
      products(first: 10) {
        edges {
          node {
            id
            bodyHtml
            images(first: 3) {
              nodes {
                src
              }
            }
          }
        }
      }
    }
  }
`;

const startServer = async () => {
  try {
    db.sync({ force: true });
    const shopifyResponse = await axios.post(
      `${shopifyHost}admin/api/2024-01/graphql.json`,
      {
        query: graphqlQuery,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopifyAccessToken,
        },
      }
    );

    const products = await shopifyResponse.data.data.shop.products.edges.map(
      (edge, index) => {
        const node = edge.node;
        return {
          id: index,
          bodyHtml: node.bodyHtml,
          imageSrc: node.images.nodes[0].src,
        };
      }
    );

    // console.log("Products have been fetched from Shopify.");

    await ProductsController.setProducts(products);
  } catch (error) {
    console.error("Error while fetching products from Shopify:", error);
  }
};

startServer();
