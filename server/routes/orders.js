const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// ─── POST /api/orders ─────────────────────────────────────
// Accept: { productIds: [...], customerName, customerEmail }
router.post("/", async (req, res, next) => {
  try {
    const { productIds, customerName = "Guest", customerEmail = "" } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "productIds must be a non-empty array",
      });
    }

    // Fetch products from DB
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid products found for provided IDs",
      });
    }

    // Count occurrences (in case same ID appears multiple times)
    const quantityMap = {};
    productIds.forEach((id) => {
      const key = id.toString();
      quantityMap[key] = (quantityMap[key] || 0) + 1;
    });

    // Build order items
    const orderItems = products.map((p) => ({
      product: p._id,
      title: p.title,
      price: p.discountPercentage
        ? parseFloat((p.price - (p.price * p.discountPercentage) / 100).toFixed(2))
        : p.price,
      image: p.image || "",
      quantity: quantityMap[p._id.toString()] || 1,
    }));

    // Calculate total
    const totalPrice = parseFloat(
      orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    );

    const order = new Order({
      products: orderItems,
      totalPrice,
      customerName,
      customerEmail,
    });

    const saved = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: {
        orderId: saved._id,
        products: orderItems,
        totalPrice,
        status: saved.status,
        createdAt: saved.createdAt,
      },
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "One or more invalid product IDs" });
    }
    next(err);
  }
});

// ─── GET /api/orders ──────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalCount: total,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/orders/:id ──────────────────────────────────
router.get("/:id", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
