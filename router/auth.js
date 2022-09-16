const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cookie = require("cookie");
// const jscookie = require("js-cookie");
const multer = require("multer");
require("../db/db");

const User = require("../userSchema/registerUser");
const authenticated = require("../middleware/userAuth");
const Product = require("../userSchema/productsSchema");

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/productImage/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "epi" + "-" + file.originalname);
  },
});

const editproductStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/productImage/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "pi" + "-" + file.originalname);
  },
});

const pupload = multer({ storage: productStorage });
const uupload = multer({ storage: editproductStorage });

//Register USer
router.post("/api/register", (req, res) => {
  const { email } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.json({
          msg: "email exists",
        });
      } else {
        const newUser = new User(req.body);
        newUser.save().then((user) => {
          res.status(200).json({
            msg: "User registered successfully",
            data: user,
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Error",
      });
    });
});

//login user
router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  let token;
  try {
    const getLogin = await User.findOne({
      email: email,
    });
    // console.log(getLogin);
    const isMatch = await bcrypt.compare(password, getLogin.password);
    token = await getLogin.generateAuthToken();

    res.cookie("logtoken", token);
    // console.log(cookie);
    if (getLogin) {
      console.log("==========token=======");
      // console.log(token);
      console.log("==========token=======");

      if (!isMatch) {
        res.json({
          msg: "Invalid Credentials",
        });
      } else {
        res.status(200).json({
          msg: "Login Successful",
          data: getLogin,
          token: token,
        });
      }
    } else {
      res.json({
        msg: "Invalid Credentials",
      });
    }
  } catch (e) {
    res.json({
      msg: "User Does Not Exist",
    });
    console.log(e);
  }
});

router.post("/api/singleuser", (req, res) => {
  const id = req.body.id;
  User.findOne({ _id: id }).then((user) => {
    res.json({
      msg: "Single User",
      data: user,
    });
  });
});

router.get("/api/logout", (req, res) => {
  res.clearCookie("logtoken");
  res.json({
    msg: "logout",
  });
  res.end();
});

router.post("/api/profile", authenticated, (req, res) => {
  var cookiess = cookie.parse(req.headers.cookie || "");

  res.json({
    msg: "Profile",
    data: req.rootUser,
  });
});

router.post("/api/add/product", pupload.single("image"), async (req, res) => {
  const files = req.file;
  const data = req.body;
  // console.log(data);
  const product = new Product({
    title: data.title,
    price: data.price,
    amount: data.amount,
    category: data.category,
    image: files.filename,
  });
  product.save().then((product) => {
    // console.log(product);
    res.json({
      msg: "Product Added",
      data: product,
    });
  });
});

router.get("/api/get/allproduct", async (req, res) => {
  console.log("get all product");
  const getProduct = await Product.find();
  try {
    const response = getProduct;
    // console.log(response);
    res.json({
      msg: "Products",
      data: response,
    });
  } catch (e) {
    console.log(e);
  }
});

router.delete("/api/delete/product", async (req, res) => {
  const id = req.body.id;
  // console.log(req.body);
  const getProduct = await Product.findByIdAndDelete({ _id: id });
  try {
    const response = getProduct;
    // console.log(response);
    res.json({
      msg: "Product Deleted",
      data: response,
    });
  } catch (e) {
    console.log(e);
  }
});

//update admin products
router.patch(
  "/api/update/product",
  uupload.single("image"),
  async (req, res) => {
    const files = req.file;
    const data = req.body;

    const updateProduct = await Product.findByIdAndUpdate(
      { _id: data.id },
      {
        title: data.title,
        price: data.price,
        amount: data.amount,
        category: data.category,
        image: files.filename,
      },
      { new: true }
    );
    try {
      const response = updateProduct;
      // console.log(response);
      res.json({
        msg: "Product Updated",
        data: response,
      });
    } catch (e) {
      console.log(e);
    }
  }
);

router.get("/api/get/singleproduct/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const getProduct = await Product.findById({ _id: id });
  try {
    const response = getProduct;
    // console.log(response);
    res.json({
      msg: "Product",
      data: response,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/", (req, res) => {
  res.send("Hey am from router");
});

module.exports = router;
