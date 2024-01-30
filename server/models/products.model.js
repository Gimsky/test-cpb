const Sequelize = require("sequelize");
const db = require("../config/db");

const Products = db.define("products", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bodyHtml: {
    type: Sequelize.TEXT,
  },
  imageSrc: {
    type: Sequelize.STRING,
  },
});

module.exports = Products;
