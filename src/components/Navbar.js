import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiMenu, HiX, HiShoppingCart } from "react-icons/hi";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "News", href: "/news" },
  { label: "Contact Us", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { totalItems, setIsOpen: openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [router.asPath]);

  const isActive = (href) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-dark-900/90 backdrop-blur-xl shadow-lg border-b border-white/5" : "bg-transparent"
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-orange transition-all duration-300 group-hover:rotate-6">
              <RiShoppingBag3Fill className="text-white text-lg" />
            </div>
            <span className="font-heading text-xl font-bold">
              <span className="text-white">Shop</span>
              <span className="gradient-text">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href) ? "text-primary-400" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => openCart(true)}
              className="relative w-10 h-10 rounded-xl glass border border-white/10 hover:border-primary-500/40 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
              aria-label="Open cart"
            >
              <HiShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-glow-sm animate-scale-in">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button className="btn-primary text-sm py-2.5 px-5">Sign Up</button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => openCart(true)} className="relative w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60">
              <HiShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition-all duration-200 hover:bg-white/10"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"}`}>
          <div className="glass rounded-2xl p-4 space-y-1 mt-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href) ? "bg-primary-500/15 text-primary-400" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <button className="btn-primary w-full text-sm">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
