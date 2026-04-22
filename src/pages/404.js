import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiHome, HiShoppingBag, HiArrowLeft } from "react-icons/hi";
import { RiShoppingBag3Fill } from "react-icons/ri";

export default function Custom404() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Head>
        <title>404 — Page Not Found | ShopVerse</title>
      </Head>

      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div
          className={`relative z-10 text-center max-w-lg mx-auto space-y-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-orange transition-all duration-300 group-hover:rotate-6">
              <RiShoppingBag3Fill className="text-white text-xl" />
            </div>
            <span className="font-heading text-2xl font-bold">
              <span className="text-white">Shop</span>
              <span className="gradient-text">Verse</span>
            </span>
          </Link>

          {/* Big 404 */}
          <div className="relative">
            <p
              className="text-[10rem] sm:text-[14rem] font-heading font-bold leading-none select-none"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,146,60,0.05))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </p>
            {/* Icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-dark-700 border border-white/10 rounded-3xl flex items-center justify-center shadow-card animate-float">
                <span className="text-5xl">🛒</span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h1 className="font-heading text-3xl sm:text-4xl text-white font-bold">
              Oops! Lost in the Store
            </h1>
            <p className="text-white/40 text-base leading-relaxed max-w-sm mx-auto">
              The page you&apos;re looking for doesn&apos;t exist, was moved, or
              is temporarily unavailable.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="btn-primary flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
            >
              <HiHome size={16} />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="btn-outline flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
            >
              <HiShoppingBag size={16} />
              Browse Products
            </Link>
          </div>

          {/* Helpful links */}
          <div className="border-t border-white/5 pt-6 space-y-2">
            <p className="text-white/30 text-xs uppercase tracking-wider font-semibold">
              Quick Links
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Contact Us", href: "/#contact" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-white/40 hover:text-primary-400 text-sm transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Error code */}
          <p className="text-white/15 text-xs font-mono">
            Error 404 · Page Not Found
          </p>
        </div>
      </div>
    </>
  );
}
