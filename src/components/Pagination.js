import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Pagination({ currentPage, totalPages, onPageChange, loading }) {
  if (totalPages <= 1) return null;

  // Build page numbers to show (max 7 visible)
  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white/60 hover:text-white hover:border-primary-500/40 hover:bg-primary-500/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
      >
        <HiChevronLeft size={16} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-3 py-2.5 text-white/30 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`min-w-[42px] h-10 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              page === currentPage
                ? "bg-primary-500 border-primary-500 text-white shadow-glow-sm"
                : "bg-dark-700 border-white/10 text-white/60 hover:text-white hover:border-primary-500/40 hover:bg-primary-500/5"
            } disabled:cursor-not-allowed`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white/60 hover:text-white hover:border-primary-500/40 hover:bg-primary-500/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
      >
        <span className="hidden sm:inline">Next</span>
        <HiChevronRight size={16} />
      </button>

      {/* Page info */}
      <span className="text-white/30 text-xs ml-2">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
