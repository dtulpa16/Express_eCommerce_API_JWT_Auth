const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { productSchema } = require("./product");

const userSchema = new Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: { type: String, required: true, maxlength: 1024, minlength: 5 },
  shoppingCart: { type: [productSchema], default: [] },
});

const User = model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
}

module.exports = {
  User,
  validateUser,
};
