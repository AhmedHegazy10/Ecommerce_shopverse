import Head from "next/head";
import { useState, useEffect, useMemo, useCallback } from "react";
import { HiSearch, HiPlus, HiX, HiFilter, HiRefresh, HiExclamationCircle, HiDatabase } from "react-icons/hi";
import ProductCard from "@/components/ProductCard";
import AddProductModal from "@/components/AddProductModal";
import EditProductModal from "@/components/EditProductModal";
import Pagination from "@/components/Pagination";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { useProducts } from "@/context/ProductContext";
import { fetchProductsForISR, getCategories, getBrands } from "@/services/api";

const LIMIT = 10;

export default function ProductsPage({ initialProducts, initialPagination, allCategories, allBrands }) {
  const { products, setProducts, loading, fetchProducts, removeProduct, pagination, setPagination } = useProducts();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [usingBackend, setUsingBackend] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [categories, setCategories] = useState(allCategories || []);
  const [brands, setBrands] = useState(allBrands || []);

  // Initial load: try backend, fallback to ISR data
  useEffect(() => {
    const tryBackend = async () => {
      try {
        const { api } = await import("@/services/api");
        await api.get("/health"); // quick health check
        setUsingBackend(true);
        // Load categories + brands from backend
        try {
          const [cats, brnds] = await Promise.all([getCategories(), getBrands()]);
          if (cats?.length) setCategories(cats);
          if (brnds?.length) setBrands(brnds);
        } catch {}
      } catch {
        setBackendError(true);
        // Use ISR data
        setProducts(initialProducts);
        setPagination(initialPagination || { currentPage: 1, totalPages: 1, totalCount: initialProducts.length, limit: LIMIT });
      }
    };
    tryBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch from backend when filters/page change
  useEffect(() => {
    if (!usingBackend) return;
    const params = {
      page: currentPage,
      limit: LIMIT,
      ...(selectedCategory && { category: selectedCategory }),
      ...(selectedBrand && { brand: selectedBrand }),
      ...(search.trim() && { search: search.trim() }),
    };
    if (sortBy === "price-asc") { params.sort = "price"; params.order = "asc"; }
    else if (sortBy === "price-desc") { params.sort = "price"; params.order = "desc"; }
    else if (sortBy === "rating") { params.sort = "rating"; params.order = "desc"; }
    else if (sortBy === "name") { params.sort = "title"; params.order = "asc"; }

    fetchProducts(params);
  }, [usingBackend, currentPage, selectedCategory, selectedBrand, search, sortBy]);

  // For ISR mode: client-side filtering
  const displayedProducts = useMemo(() => {
    if (usingBackend) return products; // backend handles it
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
    }
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedBrand) result = result.filter(p => p.brand === selectedBrand);
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "name") result.sort((a, b) => a.title?.localeCompare(b.title));
    return result;
  }, [usingBackend, products, search, selectedCategory, selectedBrand, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch(""); setSelectedCategory(""); setSelectedBrand(""); setSortBy("default"); setCurrentPage(1);
  };

  const hasFilters = search || selectedCategory || selectedBrand || sortBy !== "default";
  const paginationData = usingBackend ? pagination : { ...pagination, totalCount: displayedProducts.length };

  return (
    <>
      <Head>
        <title>Products — ShopVerse</title>
        <meta name="description" content="Browse all our premium products" />
      </Head>

      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <HiDatabase className={usingBackend ? "text-green-400" : "text-yellow-400"} size={14} />
              <p className={`text-sm font-semibold uppercase tracking-widest ${usingBackend ? "text-green-400" : "text-yellow-400"}`}>
                {usingBackend ? "Live — MongoDB Backend" : "Static — ISR Data (build-time)"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold">
                  All <span className="gradient-text italic">Products</span>
                </h1>
                <p className="text-white/40 mt-2">
                  {usingBackend
                    ? <>{paginationData.totalCount} total products · Page {paginationData.currentPage} of {paginationData.totalPages}</>
                    : <>{displayedProducts.length} products</>
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => usingBackend ? fetchProducts({ page: currentPage, limit: LIMIT }) : setProducts(initialProducts)}
                  className="flex items-center gap-2 glass border border-white/10 hover:border-primary-500/30 text-white/60 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-all duration-200"
                >
                  <HiRefresh size={16} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
                <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
                  <HiPlus size={16} /> Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Backend error banner */}
          {backendError && (
            <div className="mb-6 flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 rounded-xl px-5 py-4 text-sm">
              <HiExclamationCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Backend not running — showing ISR data (read-only)</p>
                <p className="text-yellow-400/70 text-xs">
                  Run <code className="font-mono bg-yellow-500/10 px-1.5 py-0.5 rounded">cd server && npm install && npm run dev</code> to enable full CRUD with MongoDB.
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="glass border border-white/5 rounded-2xl p-4 mb-8 space-y-4 animate-slide-up animation-delay-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input value={search} onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
                  placeholder="Search products..." className="input-field pl-10 py-2.5 text-sm" />
                {search && (
                  <button onClick={() => handleFilterChange(setSearch)("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                    <HiX size={14} />
                  </button>
                )}
              </div>
              <select value={selectedCategory} onChange={(e) => handleFilterChange(setSelectedCategory)(e.target.value)}
                className="input-field py-2.5 text-sm appearance-none cursor-pointer">
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-dark-800 capitalize">{cat.replace(/-/g, " ")}</option>
                ))}
              </select>
              <select value={selectedBrand} onChange={(e) => handleFilterChange(setSelectedBrand)(e.target.value)}
                className="input-field py-2.5 text-sm appearance-none cursor-pointer">
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand} className="bg-dark-800">{brand}</option>
                ))}
              </select>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="input-field py-2.5 text-sm appearance-none cursor-pointer">
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">A → Z</option>
              </select>
            </div>
            {hasFilters && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="flex items-center gap-1.5 text-white/40 text-xs"><HiFilter size={12} /> Active:</span>
                {search && <FilterTag label={`"${search}"`} onRemove={() => handleFilterChange(setSearch)("")} />}
                {selectedCategory && <FilterTag label={selectedCategory} onRemove={() => handleFilterChange(setSelectedCategory)("")} />}
                {selectedBrand && <FilterTag label={selectedBrand} onRemove={() => handleFilterChange(setSelectedBrand)("")} />}
                {sortBy !== "default" && <FilterTag label={sortBy} onRemove={() => setSortBy("default")} />}
                <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 font-medium ml-1 transition-colors">Clear all</button>
              </div>
            )}
          </div>

          {/* Products grid */}
          {loading ? (
            <SkeletonGrid count={LIMIT} />
          ) : displayedProducts.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    onEdit={setEditTarget}
                    onDelete={removeProduct}
                  />
                ))}
              </div>
              <Pagination
                currentPage={usingBackend ? (pagination.currentPage || 1) : currentPage}
                totalPages={usingBackend ? (pagination.totalPages || 1) : Math.ceil(displayedProducts.length / LIMIT)}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>

      <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <EditProductModal isOpen={!!editTarget} onClose={() => setEditTarget(null)} product={editTarget} />
    </>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-primary-300"><HiX size={10} /></button>
    </span>
  );
}

function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="text-center py-24">
      <div className="w-20 h-20 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
        {hasFilters ? "🔍" : "📭"}
      </div>
      <h3 className="font-heading text-2xl text-white font-bold mb-2">
        {hasFilters ? "No products found" : "No products yet"}
      </h3>
      <p className="text-white/40 text-sm mb-6 max-w-xs mx-auto">
        {hasFilters ? "Try adjusting your search or filters." : "Add your first product using the button above."}
      </p>
      {hasFilters && <button onClick={onClear} className="btn-outline text-sm">Clear Filters</button>}
    </div>
  );
}

// ISR — revalidate every 10 seconds
export async function getStaticProps() {
  try {
    const data = await fetchProductsForISR({ page: 1, limit: LIMIT });
    const categories = [...new Set((data.data || []).map((p) => p.category).filter(Boolean))];
    const brands = [...new Set((data.data || []).map((p) => p.brand).filter(Boolean))];
    return {
      props: {
        initialProducts: data.data || [],
        initialPagination: data.pagination || {},
        allCategories: categories,
        allBrands: brands,
      },
      revalidate: 10,
    };
  } catch {
    return {
      props: { initialProducts: [], initialPagination: {}, allCategories: [], allBrands: [] },
      revalidate: 10,
    };
  }
}
