import axios from "axios";

// ─── Axios instances ───────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred";
    throw new Error(message);
  }
);

// PRODUCTS
export const getProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/products/categories");
  return res.data.data;
};

export const getBrands = async () => {
  const res = await api.get("/products/brands");
  return res.data.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// ORDERS
export const placeOrder = async (productIds, customer = {}) => {
  const res = await api.post("/orders", { productIds, ...customer });
  return res.data;
};

export const getOrders = async (params = {}) => {
  const res = await api.get("/orders", { params });
  return res.data;
};

// SSG / ISR helpers (server-side only)
export const fetchProductsForISR = async (params = {}) => {
  const { default: axiosNode } = await import("axios");
  const BASE = "http://localhost:5000/api";
  try {
    const res = await axiosNode.get(`${BASE}/products`, { params, timeout: 8000 });
    return res.data;
  } catch {
    const fallback = await axiosNode.get("https://dummyjson.com/products?limit=30");
    const products = fallback.data.products || [];
    return {
      data: products.map((p) => ({
        _id: String(p.id),
        title: p.title,
        description: p.description,
        price: p.price,
        brand: p.brand,
        category: p.category,
        image: p.thumbnail,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
      })),
      pagination: { currentPage: 1, totalPages: 1, totalCount: products.length, limit: 30 },
    };
  }
};

export const fetchProductByIdForISR = async (id) => {
  const { default: axiosNode } = await import("axios");
  const BASE = "http://localhost:5000/api";
  try {
    const res = await axiosNode.get(`${BASE}/products/${id}`, { timeout: 8000 });
    return res.data.data;
  } catch {
    try {
      const fallback = await axiosNode.get(`https://dummyjson.com/products/${id}`);
      const p = fallback.data;
      return {
        _id: String(p.id), title: p.title, description: p.description,
        price: p.price, brand: p.brand, category: p.category,
        image: p.thumbnail, discountPercentage: p.discountPercentage,
        rating: p.rating, stock: p.stock,
      };
    } catch { return null; }
  }
};
