const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ─── GET /api/products  (with pagination + filters) ───────
router.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      search,
      sort = "createdAt",
      order = "desc",
      minPrice,
      maxPrice,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter = {};
    if (category) filter.category = category.toLowerCase();
    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Sort mapping
    const sortOrder = order === "asc" ? 1 : -1;
    const sortField = ["price", "rating", "title", "createdAt"].includes(sort)
      ? sort : "createdAt";
    const sortObj = { [sortField]: sortOrder };

    const [products, totalCount] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/categories ─────────────────────────
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ success: true, data: categories.sort() });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/brands ─────────────────────────────
router.get("/brands", async (req, res, next) => {
  try {
    const brands = await Product.distinct("brand");
    res.json({ success: true, data: brands.filter(Boolean).sort() });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/:id ────────────────────────────────
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }
    next(err);
  }
});

// ─── POST /api/products ───────────────────────────────────
router.post("/", async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json({ success: true, data: saved, message: "Product created successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    next(err);
  }
});

// ─── PUT /api/products/:id ────────────────────────────────
router.put("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product, message: "Product updated successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    next(err);
  }
});

// ─── DELETE /api/products/:id ─────────────────────────────
router.delete("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully", data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
