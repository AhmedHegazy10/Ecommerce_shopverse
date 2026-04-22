# 🛍️ ShopVerse — E-Commerce Products Website

A professional e-commerce products website built with **Next.js (Pages Router)**, **TailwindCSS**, **Axios**, and **JSON Server**.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Project (Dev + JSON Server together)

```bash
npm run dev:full
```

This runs:
- **Next.js dev server** → `http://localhost:3000`
- **JSON Server** → `http://localhost:3001`

### Or run them separately:

```bash
# Terminal 1 — Next.js
npm run dev

# Terminal 2 — JSON Server
npm run server
```

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── _app.js              ← Root app with layout & providers
│   ├── _document.js         ← Custom HTML document
│   ├── index.js             ← Home page (SSG)
│   ├── 404.js               ← Custom 404 (no layout)
│   └── products/
│       ├── index.js         ← Products listing page (SSG + client CRUD)
│       └── [id].js          ← Product detail page (SSG + fallback)
│
├── components/
│   ├── Navbar.js            ← Responsive navbar with scroll effect
│   ├── Footer.js            ← Full footer with links & newsletter
│   ├── ProductCard.js       ← Card with View / Edit / Delete actions
│   ├── ProductSlider.js     ← Swiper.js slider for featured products
│   ├── AddProductModal.js   ← Modal form for creating products
│   ├── EditProductModal.js  ← Modal form for editing products
│   ├── SkeletonCard.js      ← Skeleton loading cards
│   └── StarRating.js        ← Star rating display
│
├── layout/
│   └── MainLayout.js        ← Wraps Navbar + main + Footer
│
├── services/
│   └── api.js               ← Axios API layer (local + dummyjson)
│
├── context/
│   └── ProductContext.js    ← Global state for CRUD operations
│
└── styles/
    └── globals.css          ← Tailwind + custom CSS variables
```

---

## ⚙️ Tech Stack

| Tool | Purpose |
|---|---|
| **Next.js 14** (Pages Router) | Framework |
| **TailwindCSS** | Styling |
| **Axios** | HTTP client |
| **JSON Server** | Local REST API (CRUD) |
| **Swiper.js** | Product slider |
| **react-hot-toast** | Toast notifications |
| **React Icons** | Icon library |

---

## 🌐 Routes

| Route | Description |
|---|---|
| `/` | Home page with hero + featured products |
| `/products` | Products listing with filters + CRUD |
| `/products/[id]` | Product detail page |
| `/404` | Custom error page (no navbar/footer) |

---

## 🔄 CRUD Flow

1. **Initial load**: Uses `getStaticProps` to fetch from `https://dummyjson.com/products`
2. **After hydration**: Tries to connect to local JSON Server (`http://localhost:3001/products`)
3. **If JSON Server running**: All CRUD ops go through it via Axios
4. **If not running**: Shows SSG data in read-only mode with a warning banner

---

## 🎨 Features

- ✅ Dark theme with orange accent colors
- ✅ Responsive design (mobile + tablet + desktop)
- ✅ Skeleton loading states
- ✅ Toast notifications for all CRUD actions
- ✅ Product search + filter by category & brand + sort
- ✅ Image gallery with thumbnails on detail page
- ✅ Quantity selector
- ✅ Swiper.js product slider on homepage
- ✅ Custom animated 404 page (no navbar/footer)
- ✅ Glassmorphism effects & ambient glows
- ✅ Smooth animations & hover effects

---

## 📡 API Endpoints (JSON Server)

```
GET    http://localhost:3001/products
GET    http://localhost:3001/products/:id
POST   http://localhost:3001/products
PUT    http://localhost:3001/products/:id
DELETE http://localhost:3001/products/:id
```
