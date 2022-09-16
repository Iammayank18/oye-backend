const mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);
const ProductSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required: true,
    default: "../public/productImage/9.jpeg",
  },
});
ProductSchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "id" });
const products = mongoose.model("Products", ProductSchema);
module.exports = products;
