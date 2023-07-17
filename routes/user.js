const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userController");
const { User, validateUser } = require("../models/user");
const {Product, validateProduct} = require("../models/product")

const jwt = require("jsonwebtoken");

//! Handle registration
router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = await registerUser(req.body);
    await user.save();
    // return res.send({ _id: user._id, name: user.name, email: user.email });
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_SECRET
    );
    
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({ _id: user._id, name: user.name, email: user.email });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//! Gets shopping cart items of user who's email is sent in through request url
router.get("/:userEmail/shoppingcart",async(req,res)=>{
  try{
    const userDetails = await User.findOne({email:req.params.userEmail})
    if (!userDetails) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

    return res.status(200).send(userDetails.shoppingCart)
  }catch(ex){
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
})

//! Adds a product to the users shopping cart
router.post("/:userId/shoppingcart/:productId",async(req,res)=>{
  try{
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(400).send(`The product with id "${req.params.productId}" does not exist.`);

    user.shoppingCart.push(product);
    await user.save();
    return res.status(201).send(user.shoppingCart);
  }catch(ex){
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
})

//! Updates a product in the users shopping cart
router.put("/:userId/shoppingcart/:productId",async(req,res)=>{
  try{
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error);

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
 
    const product = user.shoppingCart.findById(req.params.productId);
    if (!product) return res.status(400).send(`The product with id "${req.params.productId}" does not in the users shopping cart.`);

    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    await user.save();
    return res.status(200).send(product);
  }catch(ex){
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
})

module.exports = router;
