const { User } = require("../models/user");
const bcrypt = require("bcrypt");

exports.registerUser = async (body) => {
  const salt = await bcrypt.genSalt(10);
  try {
    let user = new User({
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, salt),
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};
