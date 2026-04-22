import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  HiArrowRight,
  HiShieldCheck,
  HiTruck,
  HiRefresh,
  HiStar,
  HiSparkles,
} from "react-icons/hi";
import { RiShoppingBag3Fill } from "react-icons/ri";
import ProductSlider from "@/components/ProductSlider";
import { fetchInitialProducts } from "@/services/api";

const FEATURES = [
  {
    icon: HiTruck,
    title: "Free Shipping",
    desc: "Free delivery on all orders over $50. Fast & reliable.",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: HiShieldCheck,
    title: "Secure Payment",
    desc: "Your payment information is always safe & encrypted.",
    color: "from-green-500/20 to-green-600/10",
    border: "border-green-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: HiRefresh,
    title: "Easy Returns",
    desc: "30-day hassle-free return policy. No questions asked.",
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: HiStar,
    title: "Top Rated",
    desc: "Thousands of 5-star reviews from happy customers.",
    color: "from-primary-500/20 to-primary-600/10",
    border: "border-primary-500/20",
    iconColor: "text-primary-400",
  },
];

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products Listed" },
  { value: "150+", label: "Brands Available" },
  { value: "99%", label: "Satisfaction Rate" },
];

export default function HomePage({ featuredProducts, categories }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Head>
        <title>ShopVerse — Discover Premium Products</title>
        <meta
          name="description"
          content="ShopVerse is your premium destination for quality products at unbeatable prices."
        />
      </Head>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-80px)] py-20">
            {/* Left */}
            <div className={`space-y-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 glass border border-primary-500/20 rounded-full px-4 py-2">
                <HiSparkles className="text-primary-400" size={14} />
                <span className="text-primary-300 text-sm font-medium">
                  New Arrivals for 2025
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-white">
                  Discover
                  <br />
                  <span className="gradient-text italic">Premium</span>
                  <br />
                  Products
                </h1>
              </div>

              <p className="text-white/50 text-lg leading-relaxed max-w-md">
                Shop thousands of curated products from the world&apos;s best
                brands. Fast shipping, easy returns, and unbeatable prices.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-primary flex items-center gap-2 text-base">
                  Shop Now
                  <HiArrowRight size={18} />
                </Link>
                <button className="btn-outline flex items-center gap-2 text-base">
                  <RiShoppingBag3Fill size={18} />
                  View Categories
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-bold gradient-text font-heading">{value}</p>
                    <p className="text-white/40 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product mosaic */}
            <div
              className={`relative hidden lg:grid grid-cols-2 gap-4 transition-all duration-700 delay-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {featuredProducts.slice(0, 4).map((product, i) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className={`group relative rounded-2xl overflow-hidden bg-dark-700 border border-white/5 hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-1 ${
                    i === 0 ? "row-span-2" : ""
                  }`}
                  style={{ aspectRatio: i === 0 ? "3/4" : "4/3" }}
                >
                  <Image
                    src={product.thumbnail || "/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs font-semibold line-clamp-1">
                      {product.title}
                    </p>
                    <p className="text-primary-400 text-xs font-bold mt-0.5">
                      ${product.price}
                    </p>
                  </div>
                </Link>
              ))}
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 glass border border-primary-500/20 rounded-2xl px-4 py-3 animate-float">
                <p className="text-white text-xs font-semibold">🔥 Hot Deals</p>
                <p className="text-primary-400 text-xs mt-0.5">Up to 50% off</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, border, iconColor }) => (
              <div
                key={title}
                className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${iconColor}`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-white font-semibold mb-1">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">
                Curated for you
              </p>
              <h2 className="font-heading text-4xl text-white font-bold">
                Featured <span className="gradient-text italic">Products</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-semibold transition-colors group"
            >
              View All Products
              <HiArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <ProductSlider products={featuredProducts} />
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────────── */}
      {categories?.length > 0 && (
        <section className="py-20 bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">
                Browse by category
              </p>
              <h2 className="font-heading text-4xl text-white font-bold">
                Shop by <span className="gradient-text italic">Category</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.slice(0, 16).map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${cat}`}
                  className="glass border border-white/10 hover:border-primary-500/40 hover:bg-primary-500/5 text-white/60 hover:text-primary-400 text-sm font-medium px-5 py-2.5 rounded-full capitalize transition-all duration-200"
                >
                  {cat.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-500/20 to-primary-700/10 border border-primary-500/20 rounded-3xl p-12 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/15 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="font-heading text-4xl sm:text-5xl text-white font-bold mb-4">
                Ready to start shopping?
              </h2>
              <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
                Join 50,000+ customers who trust ShopVerse for their everyday needs.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/products" className="btn-primary text-base flex items-center gap-2">
                  Explore Products
                  <HiArrowRight size={18} />
                </Link>
                <button className="glass border border-white/15 text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-white/5 transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  try {
    const data = await fetchInitialProducts(20);
    const categories = [...new Set(data.products?.map((p) => p.category) || [])];

    return {
      props: {
        featuredProducts: data.products?.slice(0, 12) || [],
        categories: categories.slice(0, 20),
      },
      revalidate: 3600,
    };
  } catch (error) {
    return {
      props: { featuredProducts: [], categories: [] },
      revalidate: 60,
    };
  }
}
