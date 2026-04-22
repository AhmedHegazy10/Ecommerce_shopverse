const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order must contain at least one product",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "confirmed",
    },
    customerName: {
      type: String,
      default: "Guest",
    },
    customerEmail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calc total on save
orderSchema.pre("save", function (next) {
  if (this.products && this.products.length > 0) {
    this.totalPrice = parseFloat(
      this.products
        .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
        .toFixed(2)
    );
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
