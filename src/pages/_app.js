import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import MainLayout from "@/layout/MainLayout";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const NO_LAYOUT_PAGES = ["/404"];

export default function App({ Component, pageProps, router }) {
  const isNoLayout = NO_LAYOUT_PAGES.includes(router.pathname);

  const content = (
    <ProductProvider initialProducts={pageProps.initialProducts || []}>
      <CartProvider>
        {isNoLayout ? (
          <Component {...pageProps} />
        ) : (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        )}
        <CartDrawer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#12121a",
              color: "#f1f1f1",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
            },
            success: { iconTheme: { primary: "#f97316", secondary: "#12121a" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#12121a" } },
          }}
        />
      </CartProvider>
    </ProductProvider>
  );

  return content;
}
