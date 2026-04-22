import Head from "next/head";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiLightningBolt,
  HiTrendingUp,
  HiGlobe,
  HiShoppingBag,
  HiClock,
  HiTag,
  HiArrowRight,
  HiRefresh,
} from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";

// ─── Mock news data ────────────────────────────────────────
const MOCK_ARTICLES = [
  {
    id: 1,
    category: "E-Commerce",
    title: "Global E-Commerce Sales Expected to Surpass $7 Trillion by 2025",
    summary:
      "New research from leading analysts indicates that worldwide online retail is growing at an unprecedented rate, driven by mobile shopping and emerging markets.",
    author: "Sarah Mitchell",
    date: "2025-04-20",
    readTime: "4 min read",
    tag: "trending",
    icon: "TrendingUp",
    accent: "from-primary-500/20 to-orange-600/10",
    border: "border-primary-500/20",
  },
  {
    id: 2,
    category: "Technology",
    title: "AI-Powered Product Recommendations Drive 35% More Conversions",
    summary:
      "Retailers implementing machine learning recommendation engines report significant boosts in average order value and customer retention metrics.",
    author: "James Carter",
    date: "2025-04-19",
    readTime: "6 min read",
    tag: "ai",
    icon: "LightningBolt",
    accent: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
  },
  {
    id: 3,
    category: "Logistics",
    title: "Same-Day Delivery Now Available in 150+ Cities Worldwide",
    summary:
      "Major fulfillment networks announce expansion of express delivery infrastructure, promising sub-4-hour windows for urban customers.",
    author: "Priya Sharma",
    date: "2025-04-18",
    readTime: "3 min read",
    tag: "logistics",
    icon: "Globe",
    accent: "from-green-500/20 to-green-600/10",
    border: "border-green-500/20",
  },
  {
    id: 4,
    category: "Retail",
    title: "Sustainable Shopping: 68% of Consumers Prioritize Eco-Friendly Brands",
    summary:
      "A comprehensive survey reveals shifting consumer values, with environmental impact becoming a key purchasing factor across all age demographics.",
    author: "Emma Wilson",
    date: "2025-04-17",
    readTime: "5 min read",
    tag: "sustainability",
    icon: "ShoppingBag",
    accent: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/20",
  },
  {
    id: 5,
    category: "Finance",
    title: "Buy Now, Pay Later Surges: BNPL Transactions Up 80% Year-Over-Year",
    summary:
      "Flexible payment solutions continue to reshape checkout behavior, with younger shoppers leading the adoption of instalment-based purchasing.",
    author: "Tom Reynolds",
    date: "2025-04-16",
    readTime: "4 min read",
    tag: "finance",
    icon: "Tag",
    accent: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/20",
  },
  {
    id: 6,
    category: "Security",
    title: "Fraud Detection Breakthroughs Cut E-Commerce Losses by 40%",
    summary:
      "Next-generation behavioral analytics tools are significantly reducing chargebacks and fraudulent transactions for online retailers worldwide.",
    author: "Lena Müller",
    date: "2025-04-15",
    readTime: "5 min read",
    tag: "security",
    icon: "LightningBolt",
    accent: "from-red-500/20 to-red-600/10",
    border: "border-red-500/20",
  },
];

const ICON_MAP = {
  TrendingUp: HiTrendingUp,
  LightningBolt: HiLightningBolt,
  Globe: HiGlobe,
  ShoppingBag: HiShoppingBag,
  Tag: HiTag,
};

// Random toast messages triggered on each SSR request
const TOAST_MESSAGES = [
  { msg: "🔥 Flash Sale — 50% off Electronics today only!", type: "success" },
  { msg: "📦 Free shipping on orders over $50 this week", type: "success" },
  { msg: "🆕 New arrivals just dropped — check them out!", type: "success" },
  { msg: "⭐ You have 250 loyalty points to redeem", type: "success" },
  { msg: "🎁 Exclusive members-only deal unlocked!", type: "success" },
  { msg: "📊 Market update: Tech stocks rally 3.2% today", type: "success" },
  { msg: "🌍 Worldwide shipping now available at checkout", type: "success" },
  { msg: "💡 Tip: Save your cart for later using our wishlist feature", type: "success" },
];

export default function NewsPage({ articles, fetchedAt, randomToast, stats }) {
  const router = useRouter();

  // Trigger random toast on every SSR page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (randomToast) {
        toast[randomToast.type || "success"](randomToast.msg, {
          duration: 5000,
          icon: "📣",
          style: {
            background: "#12121a",
            color: "#f1f1f1",
            border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: "12px",
          },
        });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [randomToast]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [featured, ...rest] = articles;
  const FeaturedIcon = ICON_MAP[featured?.icon] || HiTrendingUp;

  return (
    <>
      <Head>
        <title>News & Insights — ShopVerse</title>
        <meta
          name="description"
          content="Latest e-commerce news, trends, and market insights."
        />
      </Head>

      <div className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ─── Header ─────────────────────────────────────── */}
          <div className="mb-12 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                SSR — Server-Side Rendered
              </span>
              <span className="text-white/25 text-xs font-mono">
                fetched: {fetchedAt}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold">
                  News &amp;{" "}
                  <span className="gradient-text italic">Insights</span>
                </h1>
                <p className="text-white/40 mt-2 max-w-lg">
                  The latest in e-commerce trends, technology breakthroughs,
                  and market analysis — refreshed on every request.
                </p>
              </div>
              <button
                onClick={() => router.replace(router.asPath)}
                className="flex items-center gap-2 glass border border-white/10 hover:border-primary-500/30 text-white/60 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-all duration-200 self-start sm:self-auto"
              >
                <HiRefresh size={16} />
                Refresh (new toast)
              </button>
            </div>
          </div>

          {/* ─── Stats bar ─────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {stats.map(({ label, value, change }) => (
              <div
                key={label}
                className="glass border border-white/5 rounded-2xl p-4 hover:border-primary-500/20 transition-all duration-300"
              >
                <p className="text-white/40 text-xs mb-1">{label}</p>
                <p className="text-xl font-bold text-white font-heading">{value}</p>
                <p
                  className={`text-xs font-medium mt-1 ${
                    change.startsWith("+") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {change} vs last month
                </p>
              </div>
            ))}
          </div>

          {/* ─── Featured Article ───────────────────────────── */}
          {featured && (
            <div
              className={`relative overflow-hidden bg-gradient-to-br ${featured.accent} border ${featured.border} rounded-3xl p-8 sm:p-10 mb-10 group hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-fade-in`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/2 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <FeaturedIcon className="text-primary-400" size={26} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-category">{featured.category}</span>
                    <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl text-white font-bold leading-tight group-hover:text-primary-300 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-white/50 leading-relaxed">{featured.summary}</p>
                  <div className="flex items-center gap-4 pt-2 flex-wrap">
                    <span className="text-white/40 text-sm">By {featured.author}</span>
                    <span className="flex items-center gap-1 text-white/30 text-sm">
                      <HiClock size={13} /> {featured.readTime}
                    </span>
                    <span className="text-white/30 text-sm">{formatDate(featured.date)}</span>
                  </div>
                  <button className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-semibold transition-colors group/btn mt-2">
                    Read full article
                    <HiArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Articles grid ──────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {rest.map((article, i) => {
              const Icon = ICON_MAP[article.icon] || HiGlobe;
              return (
                <article
                  key={article.id}
                  className={`card p-6 space-y-4 cursor-pointer animate-slide-up`}
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${article.accent} border ${article.border} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="text-white/70" size={18} />
                    </div>
                    <span className="badge-category mt-1">{article.category}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary-300 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <HiClock size={11} /> {article.readTime}
                      </span>
                      <span>{formatDate(article.date)}</span>
                    </div>
                    <button className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors flex items-center gap-1 group/link">
                      Read more
                      <HiArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ─── SSR Explanation Banner ─────────────────────── */}
          <div className="glass border border-blue-500/15 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <HiLightningBolt className="text-blue-400" size={22} />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-lg font-heading">
                  How SSR works on this page
                </h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
                  This page uses <code className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono text-xs">getServerSideProps</code> — 
                  every visit triggers a fresh server render. The timestamp above updates on each request, 
                  and a random promotional toast fires on load. Compare this with the Products page 
                  which uses ISR (<code className="text-primary-300 bg-primary-500/10 px-1.5 py-0.5 rounded font-mono text-xs">revalidate: 10</code>) — 
                  cached between requests.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/products" className="btn-primary text-sm flex items-center gap-1.5">
                    <HiShoppingBag size={15} /> ISR Products Page
                  </Link>
                  <button
                    onClick={() => router.replace(router.asPath)}
                    className="btn-outline text-sm flex items-center gap-1.5"
                  >
                    <HiRefresh size={15} /> Re-run getServerSideProps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── SSR — runs on every request ──────────────────────────
export async function getServerSideProps(context) {
  // Pick a random toast message server-side
  const randomToast = TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];

  // Generate dynamic stats (simulate live data)
  const stats = [
    {
      label: "Global GMV",
      value: `$${(6.8 + Math.random() * 0.4).toFixed(1)}T`,
      change: `+${(12 + Math.random() * 5).toFixed(1)}%`,
    },
    {
      label: "Mobile Share",
      value: `${(71 + Math.random() * 5).toFixed(0)}%`,
      change: `+${(3 + Math.random() * 2).toFixed(1)}%`,
    },
    {
      label: "Avg. Order Value",
      value: `$${(128 + Math.random() * 20).toFixed(0)}`,
      change: `+${(5 + Math.random() * 3).toFixed(1)}%`,
    },
    {
      label: "Return Rate",
      value: `${(18 + Math.random() * 4).toFixed(1)}%`,
      change: `-${(1 + Math.random() * 1.5).toFixed(1)}%`,
    },
  ];

  return {
    props: {
      articles: MOCK_ARTICLES,
      fetchedAt: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
      randomToast,
      stats,
    },
  };
}
