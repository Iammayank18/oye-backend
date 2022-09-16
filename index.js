const express = require("express");
const cors = require("cors");
const app = express();
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
require("./db/db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
const authRouter = require("./router/auth");
app.use(authRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});


const port = process.env.PORT || 4000;

app.listen(port, console.log(`Server running on port ${port}`));
