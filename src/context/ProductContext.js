import { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/services/api";

const ProductContext = createContext(null);

export const ProductProvider = ({ children, initialProducts = [] }) => {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 });

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await getProducts(params);
      setProducts(data.data || []);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      toast.error("Failed to load products: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productData) => {
    try {
      setActionLoading(true);
      const newProduct = await createProduct(productData);
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("Product added successfully!");
      return true;
    } catch (err) {
      toast.error("Failed to add product: " + err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const editProduct = useCallback(async (id, productData) => {
    try {
      setActionLoading(true);
      const updated = await updateProduct(id, productData);
      setProducts((prev) => prev.map((p) => (p._id === id || p.id === id ? { ...p, ...updated } : p)));
      toast.success("Product updated!");
      return true;
    } catch (err) {
      toast.error("Failed to update: " + err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const removeProduct = useCallback(async (id) => {
    try {
      setActionLoading(true);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      toast.success("Product deleted!");
    } catch (err) {
      toast.error("Failed to delete: " + err.message);
    } finally {
      setActionLoading(false);
    }
  }, []);

  return (
    <ProductContext.Provider value={{
      products, setProducts, loading, actionLoading,
      pagination, setPagination,
      fetchProducts, addProduct, editProduct, removeProduct,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
