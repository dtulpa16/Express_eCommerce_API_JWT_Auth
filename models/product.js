const { Schema, model } = require("mongoose");
const Joi = require("joi");

const productSchema = new Schema({
  name: String,
  description: String,
  price: Number,
});

const Product = model("Product", productSchema);

const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(2).max(500).required(),
    price: Joi.number().required(),
  });

  return schema.validate(product);
};

module.exports = {
  Product,
  validateProduct,
};
