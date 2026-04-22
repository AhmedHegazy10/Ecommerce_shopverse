require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/shopverse";

// ─── Middleware ───────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// ─── Routes ──────────────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ─── Health check ─────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ShopVerse API is running",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ─── 404 handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ─── MongoDB connection + start ───────────────────────────
const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected:", MONGO_URI);

    // Seed initial data if DB is empty
    await seedIfEmpty();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 API: http://localhost:${PORT}/api/products`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    console.log("💡 Make sure MongoDB is running: mongod --dbpath /data/db");
    process.exit(1);
  }
};

// ─── Seed ─────────────────────────────────────────────────
async function seedIfEmpty() {
  const Product = require("./models/Product");
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`📊 DB already has ${count} products — skipping seed`);
    return;
  }

  console.log("🌱 Seeding initial products from DummyJSON...");
  try {
    const https = require("https");
    const data = await new Promise((resolve, reject) => {
      https.get("https://dummyjson.com/products?limit=30", (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(JSON.parse(body)));
        res.on("error", reject);
      });
    });

    const products = (data.products || []).map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      brand: p.brand || "Unknown",
      category: p.category,
      image: p.thumbnail,
      discountPercentage: p.discountPercentage || 0,
      rating: p.rating || 0,
      stock: p.stock || 0,
    }));

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
  } catch (err) {
    console.warn("⚠️ Could not seed from DummyJSON:", err.message);
    // Insert a few manual products as fallback
    await Product.insertMany([
      { title: "Sample Product 1", description: "A great product", price: 29.99, brand: "ShopVerse", category: "electronics", image: "https://placehold.co/400x300/12121a/f97316?text=Product+1" },
      { title: "Sample Product 2", description: "Another great product", price: 49.99, brand: "ShopVerse", category: "beauty", image: "https://placehold.co/400x300/12121a/f97316?text=Product+2" },
    ]);
    console.log("✅ Seeded 2 fallback products");
  }
}

start();
