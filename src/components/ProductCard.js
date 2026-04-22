import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiEye, HiPencil, HiTrash, HiShoppingCart } from "react-icons/hi";
import StarRating from "@/components/StarRating";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product, onEdit, onDelete }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Support both MongoDB (_id) and DummyJSON (id) shapes
  const productId = product._id || product.id;

  const discountedPrice = product.price && product.discountPercentage
    ? (product.price - (product.price * product.discountPercentage) / 100).toFixed(2)
    : null;

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.title}"?`)) return;
    setDeleting(true);
    await onDelete(productId);
    setDeleting(false);
  };

  const thumbnail = product.image || product.thumbnail || product.images?.[0];
  const fallbackImg = `https://placehold.co/400x300/12121a/f97316?text=${encodeURIComponent(product.title?.slice(0, 10) || "Product")}`;

  return (
    <div className="card group flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden bg-dark-700 aspect-[4/3]">
        <Image
          src={imgError ? fallbackImg : thumbnail || fallbackImg}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
        {product.stock !== undefined && product.stock <= 5 && (
          <div className="absolute top-3 right-3 bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {product.stock === 0 ? "Out of Stock" : `Only ${product.stock} left`}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {product.category && <span className="badge-category capitalize">{product.category}</span>}
          {product.brand && <span className="text-xs text-white/30">{product.brand}</span>}
        </div>

        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary-300 transition-colors duration-200">
          {product.title}
        </h3>

        {product.rating > 0 && <StarRating rating={product.rating} />}

        <div className="flex items-center gap-3 mt-auto">
          <span className="text-primary-400 font-bold text-lg">
            ${discountedPrice || product.price}
          </span>
          {discountedPrice && (
            <span className="text-white/30 text-sm line-through">${product.price}</span>
          )}
        </div>

        {/* Buy button */}
        <button
          onClick={() => addToCart({ ...product, _id: productId })}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 bg-primary-500/15 hover:bg-primary-500/25 border border-primary-500/30 hover:border-primary-500/60 text-primary-300 hover:text-primary-200 text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <HiShoppingCart size={14} />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>

        {/* CRUD Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => router.push(`/products/${productId}`)}
            className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-xs font-medium py-2 rounded-xl transition-all duration-200 active:scale-95"
          >
            <HiEye size={13} /> View
          </button>
          <button
            onClick={() => onEdit({ ...product, _id: productId })}
            className="flex items-center justify-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 text-xs font-medium py-2 rounded-xl transition-all duration-200 active:scale-95"
          >
            <HiPencil size={13} /> Edit
          </button>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-medium py-2 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          {deleting ? <span className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <HiTrash size={13} />}
          {deleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>
    </div>
  );
}
