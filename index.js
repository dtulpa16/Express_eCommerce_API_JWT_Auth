require("dotenv").config();
const express = require("express");
const app = express();

const products = require("./routes/products");
const users = require("./routes/user");
const auth = require("./routes/auth");

const connectDb = require("./db/db");

connectDb();

app.use(express.json());
app.use("/api/products", products);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
