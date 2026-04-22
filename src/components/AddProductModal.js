import { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { useProducts } from "@/context/ProductContext";

const INITIAL_FORM = {
  title: "", description: "", price: "",
  category: "", brand: "", stock: "",
  discountPercentage: 0, rating: 4.0, image: "",
};

export default function AddProductModal({ isOpen, onClose }) {
  const { addProduct, actionLoading } = useProducts();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errs.price = "Valid price is required";
    if (!form.category.trim()) errs.category = "Category is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      discountPercentage: parseFloat(form.discountPercentage) || 0,
      rating: parseFloat(form.rating) || 4.0,
    };
    const success = await addProduct(payload);
    if (success) { setForm(INITIAL_FORM); setErrors({}); onClose(); }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-dark-800 z-10">
          <div>
            <h2 className="font-heading text-xl text-white font-bold">Add New Product</h2>
            <p className="text-white/40 text-sm mt-0.5">Fill in the details below</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
            <HiX size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Product Title *" error={errors.title}>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Wireless Headphones" className={`input-field ${errors.title ? "border-red-500" : ""}`} />
          </Field>
          <Field label="Description">
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief description..." rows={3} className="input-field resize-none" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price ($) *" error={errors.price}>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} placeholder="0.00" className={`input-field ${errors.price ? "border-red-500" : ""}`} />
            </Field>
            <Field label="Stock">
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="0" className="input-field" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category *" error={errors.category}>
              <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. electronics" className={`input-field ${errors.category ? "border-red-500" : ""}`} />
            </Field>
            <Field label="Brand">
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Apple" className="input-field" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Discount (%)">
              <input name="discountPercentage" type="number" step="0.1" min="0" max="100" value={form.discountPercentage} onChange={handleChange} placeholder="0" className="input-field" />
            </Field>
            <Field label="Rating (0-5)">
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} placeholder="4.0" className="input-field" />
            </Field>
          </div>
          <Field label="Image URL">
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className="input-field" />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={actionLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {actionLoading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding...</>) : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-white/60 text-sm font-medium block">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
