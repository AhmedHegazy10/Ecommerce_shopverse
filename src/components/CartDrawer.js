import { useState } from "react";
import Image from "next/image";
import { HiX, HiTrash, HiShoppingCart, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/services/api";
import toast from "react-hot-toast";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems, productIds } = useCart();
  const [step, setStep] = useState("cart"); // cart | confirm | success
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [customer, setCustomer] = useState({ customerName: "", customerEmail: "" });

  const handleClose = () => {
    setIsOpen(false);
    if (step === "success") {
      setTimeout(() => setStep("cart"), 400);
    }
  };

  const handleCheckout = async () => {
    if (step === "cart") { setStep("confirm"); return; }

    try {
      setLoading(true);
      const result = await placeOrder(productIds, customer);
      setOrderResult(result.data);
      clearCart();
      setStep("success");
      toast.success("🎉 Order placed successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-800 border-l border-white/10 z-50 flex flex-col shadow-2xl animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <HiShoppingCart className="text-primary-400" size={22} />
            <div>
              <h2 className="text-white font-bold font-heading text-lg">
                {step === "success" ? "Order Confirmed!" : step === "confirm" ? "Confirm Order" : "Your Cart"}
              </h2>
              {step === "cart" && (
                <p className="text-white/40 text-xs mt-0.5">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
            <HiX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === "success" ? (
            <SuccessView orderResult={orderResult} onClose={handleClose} />
          ) : step === "confirm" ? (
            <ConfirmView
              items={items}
              totalPrice={totalPrice}
              customer={customer}
              setCustomer={setCustomer}
              onBack={() => setStep("cart")}
            />
          ) : items.length === 0 ? (
            <EmptyCart onClose={handleClose} />
          ) : (
            <div className="p-5 space-y-3">
              {items.map(({ product, quantity }) => (
                <CartItem
                  key={product._id}
                  product={product}
                  quantity={quantity}
                  onRemove={() => removeFromCart(product._id)}
                  onQtyChange={(q) => updateQuantity(product._id, q)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== "success" && items.length > 0 && (
          <div className="border-t border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Total</span>
              <span className="text-2xl font-bold gradient-text font-heading">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : step === "confirm" ? (
                <>
                  <HiCheckCircle size={18} /> Confirm & Place Order
                </>
              ) : (
                "Proceed to Checkout →"
              )}
            </button>
            {step === "cart" && (
              <button onClick={clearCart} className="btn-danger w-full text-sm">
                Clear Cart
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function CartItem({ product, quantity, onRemove, onQtyChange }) {
  const price = product.discountPercentage
    ? (product.price - (product.price * product.discountPercentage) / 100)
    : product.price;

  return (
    <div className="flex gap-3 bg-dark-700 rounded-xl p-3 border border-white/5">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-dark-600">
        <Image
          src={product.image || "https://placehold.co/64x64/12121a/f97316?text=?"}
          alt={product.title}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium line-clamp-2 leading-snug">{product.title}</p>
        <p className="text-primary-400 text-sm font-bold mt-1">${(price * quantity).toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => onQtyChange(quantity - 1)} className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm">−</button>
            <span className="w-8 text-center text-white text-xs font-semibold">{quantity}</span>
            <button onClick={() => onQtyChange(quantity + 1)} className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm">+</button>
          </div>
          <button onClick={onRemove} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <HiTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmView({ items, totalPrice, customer, setCustomer, onBack }) {
  return (
    <div className="p-5 space-y-5">
      <button onClick={onBack} className="text-white/40 hover:text-white text-sm flex items-center gap-1 transition-colors">
        ← Back to cart
      </button>
      <div className="space-y-2">
        <label className="text-white/60 text-sm block">Name (optional)</label>
        <input value={customer.customerName} onChange={(e) => setCustomer(p => ({ ...p, customerName: e.target.value }))} placeholder="Your name" className="input-field text-sm" />
      </div>
      <div className="space-y-2">
        <label className="text-white/60 text-sm block">Email (optional)</label>
        <input value={customer.customerEmail} onChange={(e) => setCustomer(p => ({ ...p, customerEmail: e.target.value }))} placeholder="your@email.com" type="email" className="input-field text-sm" />
      </div>
      <div className="bg-dark-700 rounded-xl p-4 border border-white/5 space-y-2">
        <p className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-3">Order Summary</p>
        {items.map(({ product, quantity }) => (
          <div key={product._id} className="flex justify-between text-sm">
            <span className="text-white/60 truncate max-w-[200px]">{product.title} ×{quantity}</span>
            <span className="text-white font-medium ml-2">
              ${((product.discountPercentage ? product.price * (1 - product.discountPercentage / 100) : product.price) * quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
          <span className="text-white">Total</span>
          <span className="gradient-text">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function SuccessView({ orderResult, onClose }) {
  return (
    <div className="p-8 text-center space-y-6">
      <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
        <HiCheckCircle className="text-green-400" size={40} />
      </div>
      <div>
        <h3 className="font-heading text-2xl text-white font-bold mb-2">Order Placed!</h3>
        <p className="text-white/40 text-sm">
          Your order has been confirmed successfully.
        </p>
      </div>
      {orderResult && (
        <div className="bg-dark-700 rounded-xl p-4 border border-white/5 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Order ID</span>
            <span className="text-white font-mono text-xs truncate max-w-[160px]">{orderResult.orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Total</span>
            <span className="text-primary-400 font-bold">${orderResult.totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Items</span>
            <span className="text-white">{orderResult.products?.length}</span>
          </div>
        </div>
      )}
      <button onClick={onClose} className="btn-primary w-full">Continue Shopping</button>
    </div>
  );
}

function EmptyCart({ onClose }) {
  return (
    <div className="p-8 text-center space-y-4">
      <div className="text-5xl">🛒</div>
      <h3 className="font-heading text-xl text-white font-bold">Your cart is empty</h3>
      <p className="text-white/40 text-sm">Add some products to get started</p>
      <button onClick={onClose} className="btn-outline text-sm">Browse Products</button>
    </div>
  );
}
