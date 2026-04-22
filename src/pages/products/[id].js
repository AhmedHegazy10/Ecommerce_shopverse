import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  HiArrowLeft, HiShoppingCart, HiHeart, HiShare,
  HiCheckCircle, HiExclamationCircle, HiChevronLeft, HiChevronRight,
} from "react-icons/hi";
import StarRating from "@/components/StarRating";
import { fetchProductByIdForISR, getProductById } from "@/services/api";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ product: initialProduct }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(initialProduct);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { id } = router.query;

  // Try to fetch live data from backend
  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then((live) => { if (live) setProduct(live); })
      .catch(() => {});
  }, [id]);

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <p className="text-5xl">😕</p>
          <h2 className="font-heading text-2xl text-white font-bold">Product not found</h2>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 text-sm">
            <HiArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const productId = product._id || product.id;
  const thumbnail = product.image || product.thumbnail;
  const images = [thumbnail, ...(product.images || []).filter(img => img !== thumbnail)].filter(Boolean);
  if (!images.length) images.push("https://placehold.co/600x500/12121a/f97316?text=No+Image");

  const discountedPrice = product.price && product.discountPercentage
    ? (product.price - (product.price * product.discountPercentage) / 100).toFixed(2)
    : null;
  const savings = product.price && product.discountPercentage
    ? ((product.price * product.discountPercentage) / 100).toFixed(2)
    : null;

  const handleAddToCart = () => {
    setAdding(true);
    addToCart({ ...product, _id: productId });
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <>
      <Head>
        <title>{product.title} — ShopVerse</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-8 animate-slide-down">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-white/70 truncate max-w-[200px]">{product.title}</span>
          </nav>

          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors group">
            <HiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>

          <div className="grid lg:grid-cols-2 gap-12 animate-slide-up">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-dark-700 rounded-2xl overflow-hidden border border-white/5 group">
                <Image
                  src={images[activeImage]}
                  alt={product.title}
                  fill className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-xl flex items-center justify-center text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                      <HiChevronLeft size={20} />
                    </button>
                    <button onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-xl flex items-center justify-center text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                      <HiChevronRight size={20} />
                    </button>
                  </>
                )}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl">
                    -{Math.round(product.discountPercentage)}% OFF
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? "border-primary-500 shadow-glow-sm" : "border-white/10 hover:border-white/30"}`}>
                      <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                {product.category && <span className="badge-category capitalize">{product.category.replace(/-/g, " ")}</span>}
                {product.brand && <span className="text-white/40 text-sm">by {product.brand}</span>}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl text-white font-bold leading-tight">{product.title}</h1>

              <div className="flex items-center gap-4 flex-wrap">
                {product.rating > 0 && <StarRating rating={product.rating} size={16} />}
                {product.stock !== undefined && (
                  <div className={`flex items-center gap-1.5 text-sm ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                    {product.stock > 0 ? (<><HiCheckCircle size={16} /><span>{product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}</span></>) : (<><HiExclamationCircle size={16} /><span>Out of Stock</span></>)}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold gradient-text font-heading">${discountedPrice || product.price}</span>
                  {discountedPrice && <span className="text-white/30 text-xl line-through">${product.price}</span>}
                </div>
                {savings && <p className="text-green-400 text-sm font-medium">You save ${savings} ({Math.round(product.discountPercentage)}% off)</p>}
              </div>

              {product.description && <p className="text-white/50 leading-relaxed border-t border-white/5 pt-5">{product.description}</p>}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-white/50 text-sm">Quantity:</span>
                <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30">−</button>
                  <span className="w-12 text-center text-white font-semibold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} disabled={product.stock && quantity >= product.stock} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30">+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button onClick={handleAddToCart} disabled={adding || product.stock === 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-base">
                  {adding ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding...</>) : (<><HiShoppingCart size={20} />Add to Cart</>)}
                </button>
                <button className="w-12 h-12 glass border border-white/10 hover:border-red-500/30 rounded-xl flex items-center justify-center text-white/40 hover:text-red-400 transition-all">
                  <HiHeart size={20} />
                </button>
                <button className="w-12 h-12 glass border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <HiShare size={20} />
                </button>
              </div>

              {/* Specs */}
              {(product.sku || product.weight || product.warrantyInformation) && (
                <div className="glass border border-white/5 rounded-xl p-4 space-y-3">
                  <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider">Product Details</h4>
                  <div className="space-y-2.5">
                    {[
                      { label: "SKU", value: product.sku },
                      { label: "Weight", value: product.weight ? `${product.weight}g` : null },
                      { label: "Warranty", value: product.warrantyInformation },
                      { label: "Return Policy", value: product.returnPolicy },
                    ].filter(s => s.value).map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-white/40">{label}</span>
                        <span className="text-white/70 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const data = await fetchProductByIdForISR ? null : null; // just return empty paths
    return { paths: [], fallback: true };
  } catch {
    return { paths: [], fallback: true };
  }
}

// ISR — revalidate every 10 seconds
export async function getStaticProps({ params }) {
  try {
    const product = await fetchProductByIdForISR(params.id);
    if (!product) return { notFound: true };
    return { props: { product }, revalidate: 10 };
  } catch {
    return { notFound: true };
  }
}
